# ClipForge AI Studio 1.1

A local-first browser video editor starter with TypeScript, Vite, FFmpeg.wasm, IndexedDB, and optional Gemini API chat/model discovery. The HTML file is only the required browser document shell; application logic is TypeScript and Vite bundles dependencies for deployment.

## What changed in 1.1

- Replaced the remote `https://esm.sh/@ffmpeg/ffmpeg...` runtime import with the npm package `@ffmpeg/ffmpeg@0.12.10`. Vite now bundles the FFmpeg class worker into the app build instead of asking the browser to construct a worker directly from a cross-origin esm.sh URL.
- Updated the FFmpeg core CDN assets to version `0.12.10` and retained `toBlobURL` for core/WASM CORS compatibility.
- Added Vite + TypeScript build scripts, build-time Tailwind CSS (no runtime Tailwind CDN), and Vercel build/output settings.
- Gemini chat now uses the Interactions API recommended by Google and automatically falls back through other compatible models when the preferred model is listed but unavailable to that API key.
- Improved automatic Gemini model ranking to prefer available newer model families such as `gemini-3.8-flash`, then other compatible models returned by the live API. Actual availability is determined by the API key's model list.
- Updated smoke tests for the new TypeScript entry.

## Requirements

- Node.js 20.19+ or 22.12+ recommended for Vite 6.
- A modern browser; large exports need substantial RAM and storage.
- Optional Gemini API key from Google AI Studio. API use is subject to Google's availability, quotas, terms, and any applicable charges.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The first dependency install requires internet access. To create the production bundle:

```bash
npm run build
npm test
npm run preview
```

## Deploy to Vercel

Push this project to GitHub, import the repository into Vercel, and keep the defaults from `vercel.json`: install `npm install`, build `npm run build`, output `dist`.

## Important limitations and security

- This is a browser-only application. The Gemini API key is entered and stored on the user's device in IndexedDB and is visible to browser developer tools/network requests. Do not use a valuable/private production key in a public frontend. For a production service that protects keys, a server-side proxy is required; that is intentionally not included in this no-backend build.
- FFmpeg.wasm is a real WebAssembly encoder but can be slow or fail on large clips, unsupported codecs, memory pressure, or mobile browsers. The first export downloads FFmpeg core assets from jsDelivr. The worker JavaScript package itself is bundled locally by Vite.
- Gemini chat uses the official Gemini Interactions API with a live model list. It does not perform web search by itself or guarantee citations. Model access can vary by key/region and Google can change availability.
- Saved projects store editing metadata only; the original video is not copied into IndexedDB. Re-select the source file after reopening a saved project.
- URL import, full automatic transcription/semantic clip detection, multi-track editing, and cloud sync are not implemented in this version. The clip assistant explicitly avoids claiming it inspected media frames/audio/transcript.
- Browser storage may be cleared or evicted. Keep original files and exported files backed up.

## Stack

- TypeScript + Vite
- Tailwind CSS compiled at build time + existing responsive CSS (HTML remains the required browser document format)
- `@ffmpeg/ffmpeg` + `@ffmpeg/util` and FFmpeg WebAssembly core
- IndexedDB for local project metadata/settings
- Gemini API model discovery and Interactions API chat

## Tests

```bash
npm test
```
