# Jithendra Sai Kilaru: portfolio and Rising Ideas

The personal site of Jithendra Sai Kilaru, with a built-in admin panel for publishing Rising Ideas editions and essays.

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, GSAP with ScrollTrigger, Lenis smooth scrolling and three.js for the stealth venture gem. Sound is synthesised in the browser with the Web Audio API and stays off until a visitor turns it on.

## Run it

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD and ADMIN_SECRET
npm run dev                  # http://localhost:3000
```

The admin panel is at `/admin`.

## What the admin panel controls

- **Writing**: Rising Ideas editions and essays. Markdown body with live preview, cover image, topic, featured flag, draft or published, and a link to where a piece was first published. A piece with no body shows its summary and a link to the original.
- **Availability signal**: Off, a small sun beside his name, or a sunrise banner across the top. His own words, a button label and an optional end date. The site never prints "open to".
- **Stealth venture**: the sealed "precious jewel" card, with a Reveal switch that swaps in the venture's name, summary and link.
- **Profile and numbers**: subscriber and edition counts, the hero headline and thesis, portrait, bio and links.

## Content storage

Locally, content lives in `content/` as JSON (`settings.json`, `posts/*.json`). Images uploaded in the admin go to `content/uploads/` and are served from `/media/...`. This needs no database or account.

For hosting on Vercel, whose disk is read-only, the site switches itself to hosted storage when these environment variables are set:

- `KV_REST_API_URL` and `KV_REST_API_TOKEN` (Vercel's Redis integration, or Upstash): settings and posts are stored in Redis.
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob): images uploaded in the admin are stored in Blob.

On the first deploy, copy the local content into Redis once:

```bash
node --env-file=.env.local scripts/push-content.mjs
```

`node scripts/seed.mjs` rewrites `content/` with the starter content. It overwrites existing posts.

## Images

Source photos are in `assets-src/`. The lightly retouched versions used on the site are in `public/images/`.
