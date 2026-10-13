# ClipForge AI Video Studio

A mobile-first, static browser application for local video trimming and optional Gemini-powered chat/planning. Designed for GitHub + Vercel deployment without a backend server.

## Important status and scope

This is a production-oriented **starter**, not a claim that every item in the larger specification is already implemented. The working parts are local video selection/preview, timestamp-based trim UI, FFmpeg WASM export path, IndexedDB project metadata, browser storage estimates, responsive layouts, Gemini API model discovery, task-based model routing, chat, and clip-plan prompts.

Not yet implemented: semantic transcript/scene-based clip detection, actual local transcription models, multi-clip concatenation UI, subtitle authoring, audio/filter controls, full OPFS file management/recovery, automated browser E2E suite, or full frame-by-frame output verification. AI clip suggestions do not analyze the video itself; they only use the prompt and basic file metadata. No fake transcript or clip scores are generated.

## Deploy

1. Download/extract this folder.
2. Push the files to a GitHub repository (root must contain `index.html`, `app.js`, `styles.css`, and `vercel.json`).
3. Import the repository into Vercel as a static site. No build command is required; output directory is `.`.
4. Open the HTTPS deployment. HTTPS is required for some browser capabilities.
5. In **Settings & API**, enter your Google Gemini API key and use **Test & list models**.
6. Core editing does not require Gemini. Gemini chat/planning requires a valid API key and network access.

## Gemini key and privacy

This app calls Google's Gemini API directly from the browser. The key is stored in this browser's IndexedDB only when you press Save; it is not embedded in the repository. However, a client-side key is visible to the browser user and can be inspected in devtools/network requests. This is appropriate only for a personal/testing deployment with a key you control and suitable quota restrictions. **Do not deploy a private/shared production key in a public frontend.** A secure proxy would require a backend, which this project explicitly forbids.

The model list is fetched from the Gemini API and filtered to models declaring `generateContent` support. Routing is heuristic: research-style prompts prefer available Pro/reasoning-like model names; general chat prefers Flash-like names. The API's current list and naming may change, and a name is not a guarantee of better quality. Chat is not web search: the assistant is instructed not to fabricate current research or citations.

## Video processing

FFmpeg is lazy-loaded from public CDNs the first time you export. You need internet access to load the FFmpeg JavaScript/WASM files, but the selected video is processed locally after they load. Codec support varies by FFmpeg core build and browser. If the chosen encoder is absent, export fails with an error rather than claiming success. MP4 uses H.264/AAC; WebM requests VP8/Vorbis, but the core build may not include every encoder.

The app verifies that the output file is non-empty and that the browser can read its video metadata. This is **not** a full visual/audio playback QA test. Always play the downloaded file before publishing. Large files can exhaust memory, especially on Android; start with short clips and reduce resolution/quality if needed. Current starter guardrail is 2 GB, not a promise that every smaller file will work.

## Storage and project recovery

Project metadata/settings use IndexedDB. Source video files are not copied into IndexedDB/OPFS in this starter; the active source uses a temporary browser object URL and must be selected again in a later session. Browser data can be cleared or evicted. Do not treat browser storage as permanent backup. OPFS support is detected but persistent video-file storage is not implemented yet.

## Dependencies and licenses

- Tailwind CSS Play CDN — Tailwind Labs; development/prototyping convenience. For a strict production CSP, compile Tailwind during a build or replace with a generated stylesheet.
- Font Awesome Free — Fonticons, Inc.; see https://fontawesome.com/license/free
- Inter — SIL Open Font License; see https://fonts.google.com/specimen/Inter
- FFmpeg.wasm — LGPL-2.1-or-later; see https://github.com/ffmpegwasm/ffmpeg.wasm
- FFmpeg core — licensing depends on build configuration and enabled codecs; check the exact distributed core's license and codec obligations before commercial redistribution.
- Gemini API — subject to Google's API terms, regional availability, quota and billing policies.
- `vercel.json` adds basic security headers. External CDN scripts/styles mean a strict Content Security Policy is not configured here.

## Browser compatibility and mobile testing checklist

Test on the actual devices/browsers you target; compatibility is not guaranteed by this checklist.

- [ ] Android Chrome: HTTPS page loads, import from file picker, preview, seek, start/end controls.
- [ ] Android Chrome: try a short H.264 MP4, export, download, locate file in Downloads, play it in a separate player.
- [ ] Android Chrome: try a small WebM and record codec errors if any.
- [ ] Desktop Chrome/Edge: drag-and-drop, trim, MP4/WebM export, cancel behavior.
- [ ] Safari/iOS: verify file picker and browser download behavior; FFmpeg WASM/codec availability may differ.
- [ ] Settings: invalid API key displays an error; valid key lists current available models.
- [ ] Chat: general prompt routes to an available model; research prompt uses heuristic routing; failures are visible.
- [ ] Storage: refresh estimate, export metadata JSON, delete saved project metadata.
- [ ] Reload: saved project metadata survives if browser storage remains; source video must be selected again.
- [ ] Test short clips first and check output in an independent media player.

## Automated checks

`tests/smoke.test.mjs` contains basic source-level smoke checks runnable with Node.js on a development machine (`node --test tests/smoke.test.mjs`). Node is only used for tests, not as an application backend.
