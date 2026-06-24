# Ark Academy Facilitator Portal — Vercel deploy

This folder is ready to deploy to Vercel as a static site.

## Option 1 — Vercel CLI (fastest)

```bash
cd export
npx vercel deploy --prod
```

The first run will ask which Vercel team/project to deploy under. Subsequent runs reuse the answers stored in `.vercel/`.

## Option 2 — drag-and-drop

1. Go to https://vercel.com/new
2. Choose **"Deploy without Git"** → drag this `export/` folder in
3. Hit Deploy

## Option 3 — Git

Commit the contents of `export/` to a repo and import it at https://vercel.com/new — Vercel auto-detects it as a static site.

## What's inside

- `Ark Student Portal.html` — single self-contained bundle (all assets inlined). This is what `/` serves.
- `src/` — the unbundled source (HTML + JSX + CSS + assets) for editing.
- `vercel.json` — routes `/` to the bundled portal.
