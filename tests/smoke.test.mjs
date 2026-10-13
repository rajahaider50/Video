import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const ts = await readFile(new URL('../src/main.ts', import.meta.url), 'utf8');
const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('Vite entry uses TypeScript and has all primary views', () => {
  assert.match(html, /src="\/src\/main\.ts"/);
  for (const id of ['editorView', 'assistantView', 'projectsView', 'settingsView', 'fileInput', 'exportBtn']) assert.match(html, new RegExp(`id="${id}"`));
  assert.equal(pkg.dependencies['@ffmpeg/ffmpeg'], '0.12.10');
});
test('FFmpeg worker comes from bundled npm package, not a cross-origin esm.sh module', () => {
  assert.match(ts, /from "@ffmpeg\/ffmpeg"/);
  assert.match(ts, /from "@ffmpeg\/util"/);
  assert.doesNotMatch(ts, /esm\.sh\/@ffmpeg\/ffmpeg/);
  assert.match(ts, /ff\.exec\(args\)/);
  assert.match(ts, /readFile\(output\)/);
});
test('Gemini model discovery and current-model preference are implemented', () => {
  assert.match(ts, /supportedGenerationMethods/);
  assert.match(ts, /v1beta\/interactions/);
  assert.match(ts, /generation_config/);
  assert.match(ts, /gemini-3\\\.8-flash/);
  assert.match(ts, /chooseModel/);
});
test('responsive layout and mobile navigation exist', () => {
  assert.match(css, /@media\(max-width:820px\)/);
  assert.match(html, /menuBtn/);
});
