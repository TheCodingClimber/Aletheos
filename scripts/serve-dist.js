import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import contactHandler from "../api/contact.js";

const root = join(process.cwd(), "dist");
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || "127.0.0.1";

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'sha256-79+jOSwdzZyQGXcWEWniRVIqLnjZAuUb96WUBEGEq/c='; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; manifest-src 'self'; media-src 'none'; object-src 'none'; worker-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Origin-Agent-Cluster": "?1",
  "Permissions-Policy":
    "accelerometer=(), autoplay=(), camera=(), clipboard-read=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), usb=(), web-share=(), xr-spatial-tracking=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000",
  "X-DNS-Prefetch-Control": "off",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Permitted-Cross-Domain-Policies": "none",
};

function withJsonHelpers(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };

  res.json = (payload) => {
    if (!res.hasHeader("Content-Type")) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    }

    res.end(JSON.stringify(payload));
  };

  return res;
}

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://${host}:${port}`).pathname);
  const requested = normalize(join(root, pathname));

  if (!requested.startsWith(root)) {
    return null;
  }

  if (existsSync(requested) && statSync(requested).isFile()) {
    return requested;
  }

  return join(root, "index.html");
}

createServer(async (req, res) => {
  const pathname = new URL(req.url || "/", `http://${host}:${port}`).pathname;

  if (pathname === "/api/contact") {
    await contactHandler(req, withJsonHelpers(res));
    return;
  }

  const file = resolvePath(req.url || "/");

  if (!file || !existsSync(file)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    ...securityHeaders,
    "Content-Type": types[extname(file)] || "application/octet-stream",
  });
  createReadStream(file).pipe(res);
}).listen(port, host, () => {
  console.log(`Aletheos server ready at http://${host}:${port}/`);
});
