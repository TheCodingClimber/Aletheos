# Aletheos Landing Page

Production landing page for Aletheos, an operational truth engine focused on state validation, proof, and governance.

## Development

```bash
npm install
npm run dev
```

## Home Server Deployment

This repo is set up for AletheosAI at `https://aletheosai.com`.

```bash
npm install
npm run build
npm start
```

`npm start` serves the built `dist` files and handles `POST /api/contact` from the same Node process. Put your reverse proxy in front of it and proxy `https://aletheosai.com` to the local app, for example `http://127.0.0.1:5173`.

Keep the Node app bound to `127.0.0.1` and let the reverse proxy terminate HTTPS on ports 80/443. If your proxy supports it, pass `Host`, `X-Forwarded-Proto`, and `X-Forwarded-For` so origin checks and rate limiting see the public request accurately.

## Verification

```bash
npm run lint
npm run build
```

## Resend Setup

The contact form posts to `POST /api/contact`, which is served by `scripts/serve-dist.js` for the home-server deployment and can also run as a serverless-style handler if needed.

Set these environment variables in the deployment environment:

```bash
RESEND_API_KEY=replace-with-your-resend-api-key
RESEND_FROM_EMAIL=Aletheos <requests@aletheosai.com>
RESEND_TO_EMAIL=you@your-domain.com
SITE_URL=https://aletheosai.com
ALLOWED_ORIGINS=https://aletheosai.com
```

`RESEND_FROM_EMAIL` must use a domain verified in Resend. Keep these values server-side only; do not prefix them with `VITE_`.

`SITE_URL` or `ALLOWED_ORIGINS` lets the contact API reject browser submissions from unexpected origins. Use a comma-separated `ALLOWED_ORIGINS` list if production has multiple domains.

`SITE_URL` is also read during `npm run build` to emit canonical URLs, absolute social preview URLs, `sitemap.xml`, and a `Sitemap:` entry in `robots.txt` without exposing server secrets to client code.

## Security

- `api/contact.js` validates JSON content type, limits request body size, strips control characters, escapes email HTML, and returns generic delivery errors.
- The contact endpoint rate-limits by IP and submitted email in the running Node process, including malformed non-honeypot submissions.
- A honeypot field is sent to the server and silently accepted without delivery if filled.
- `scripts/serve-dist.js` applies browser security headers for the home-server Node deployment.
- `public/_headers` and `vercel.json` are retained for static hosts and optional Vercel-style deployments, but they are not used by the home server.

For heavy public traffic, replace the in-memory limiter with a shared store such as Redis or Upstash so limits persist across restarts and multiple Node processes.

## Launch SEO Checklist

- Confirm `SITE_URL=https://aletheosai.com` is present during production builds so canonical URLs, absolute social preview URLs, `sitemap.xml`, and `robots.txt` use the public domain.
- Replace the SVG social preview with a 1200x630 PNG if targeting platforms that do not render SVG previews.

## Suggested Next Improvements

- Add a short security/compliance proof section if Aletheos has real frameworks, policies, or certifications to cite.
- Create a second conversion path for qualified buyers, such as "Request Demo" beside "Request Access."
- Add customer-specific use cases once the target vertical is locked: legal ops, command centers, infrastructure teams, or executive governance.
- Add analytics and conversion event tracking after privacy requirements are decided.
