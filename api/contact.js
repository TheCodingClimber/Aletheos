import { Resend } from "resend";

const MAX_BODY_BYTES = 16 * 1024;
const MAX_LIMIT_KEYS = 10000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MINUTE_WINDOW_MS = 60 * 1000;
const HOUR_WINDOW_MS = 60 * 60 * 1000;
const limits = new Map();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: `${MAX_BODY_BYTES}b`,
    },
  },
};

const SECURITY_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Origin-Agent-Cluster": "?1",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Permitted-Cross-Domain-Policies": "none",
};

function setSecurityHeaders(res) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function clean(value, maxLength) {
  return String(value ?? "")
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      return code < 32 || code === 127 ? " " : char;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return clean(value, 4000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getHeader(req, name) {
  const value = req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function assertContentLength(req) {
  const contentLength = Number.parseInt(getHeader(req, "content-length") || "0", 10);

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw createHttpError("Request is too large.", 413);
  }
}

async function readBody(req) {
  assertContentLength(req);

  const contentType = getHeader(req, "content-type") || "";

  if (contentType && !contentType.toLowerCase().includes("application/json")) {
    throw createHttpError("Unsupported content type.", 415);
  }

  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body || "{}");
    } catch {
      throw createHttpError("Invalid request body.", 400);
    }
  }

  let raw = "";

  for await (const chunk of req) {
    raw += Buffer.isBuffer(chunk) ? chunk.toString("utf8") : chunk;

    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      throw createHttpError("Request is too large.", 413);
    }
  }

  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    throw createHttpError("Invalid request body.", 400);
  }
}

function getConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESEND_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw createHttpError("Email delivery is not configured yet.", 500);
  }

  return { apiKey, to, from };
}

function getClientIp(req) {
  const forwarded = getHeader(req, "x-forwarded-for");

  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }

  return (
    getHeader(req, "cf-connecting-ip") ||
    getHeader(req, "x-real-ip") ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

function assertAllowedOrigin(req) {
  const origin = normalizeOrigin(getHeader(req, "origin"));

  if (!origin) {
    return;
  }

  const host = getHeader(req, "x-forwarded-host") || getHeader(req, "host");
  const proto = getHeader(req, "x-forwarded-proto") || "https";
  const sameOrigin = host ? `${proto}://${host}` : "";
  const configuredOrigins = (process.env.ALLOWED_ORIGINS || process.env.SITE_URL || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  if (origin === normalizeOrigin(sameOrigin) || configuredOrigins.includes(origin)) {
    return;
  }

  throw createHttpError("Request origin is not allowed.", 403);
}

function pruneLimits(now) {
  for (const [key, bucket] of limits.entries()) {
    if (now - bucket.hourStart > HOUR_WINDOW_MS) {
      limits.delete(key);
    }
  }

  while (limits.size > MAX_LIMIT_KEYS) {
    const oldestKey = limits.keys().next().value;
    limits.delete(oldestKey);
  }
}

function consumeLimit(key, now) {
  const current = limits.get(key) || {
    minuteStart: now,
    minuteCount: 0,
    hourStart: now,
    hourCount: 0,
  };

  if (now - current.minuteStart > MINUTE_WINDOW_MS) {
    current.minuteStart = now;
    current.minuteCount = 0;
  }

  if (now - current.hourStart > HOUR_WINDOW_MS) {
    current.hourStart = now;
    current.hourCount = 0;
  }

  current.minuteCount += 1;
  current.hourCount += 1;
  limits.set(key, current);

  return current;
}

function assertRateLimit(req, email) {
  const now = Date.now();
  pruneLimits(now);

  const ipBucket = consumeLimit(`ip:${getClientIp(req)}`, now);
  const emailBucket = email ? consumeLimit(`email:${email}`, now) : null;

  if (
    ipBucket.minuteCount > 5 ||
    ipBucket.hourCount > 25 ||
    emailBucket?.minuteCount > 2 ||
    emailBucket?.hourCount > 5
  ) {
    throw createHttpError("Too many requests. Please try again later.", 429);
  }
}

export default async function handler(req, res) {
  setSecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    assertAllowedOrigin(req);

    const body = await readBody(req);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw createHttpError("Invalid request body.", 400);
    }

    const name = clean(body.name, 120);
    const email = clean(body.email, 160).toLowerCase();
    const company = clean(body.company, 160);
    const message = clean(body.message, 3000);
    const website = clean(body.website, 200);

    if (website) {
      return res.status(200).json({ ok: true });
    }

    assertRateLimit(req, EMAIL_PATTERN.test(email) ? email : null);

    if (!name || !email || !company || !message) {
      return res.status(400).json({ error: "Please complete every field." });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const { apiKey, to, from } = getConfig();
    const resend = new Resend(apiKey);
    const subject = `Aletheos access request - ${company}`;
    const text = [
      "New Aletheos access request",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      "",
      "Message:",
      message,
    ].join("\n");
    const html = `
      <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5">
        <h1 style="font-size:20px;margin:0 0 16px">New Aletheos access request</h1>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html,
      tags: [{ name: "source", value: "aletheos-landing" }],
    });

    if (error) {
      throw new Error(error.message || "Resend could not deliver the request.");
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    const message =
      status >= 500
        ? "Email delivery is temporarily unavailable."
        : error.message || "The request could not be processed.";

    if (status === 429) {
      res.setHeader("Retry-After", "60");
    }

    return res.status(status).json({ error: message });
  }
}
