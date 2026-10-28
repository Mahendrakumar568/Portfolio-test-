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

Content lives in `content/` as JSON (`settings.json`, `posts/*.json`), and uploaded images go to `content/uploads/`, served from `/media/...`. This needs no database or third-party account, and works anywhere with a writable disk.

Before deploying to a read-only host such as Vercel, swap `src/lib/store.ts` and the upload route for a hosted store (for example Vercel Blob for images and a small database or Git-backed store for JSON). Nothing else in the app reads the disk directly.

`node scripts/seed.mjs` rewrites `content/` with the starter content. It overwrites existing posts.

## Images

Source photos are in `assets-src/`. The lightly retouched versions used on the site are in `public/images/`.
