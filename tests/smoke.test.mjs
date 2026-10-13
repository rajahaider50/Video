import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const js = await readFile(new URL("../app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../styles.css", import.meta.url), "utf8");

test("static entry point includes required views and controls", () => {
  for (const id of ["editorView", "assistantView", "projectsView", "settingsView", "fileInput", "exportBtn"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
});
test("local project persistence and export pipeline are present", () => {
  assert.match(js, /indexedDB\.open/);
  assert.match(js, /ff\.exec\(args\)/);
  assert.match(js, /readFile\(output\)/);
  assert.match(js, /loadedmetadata/);
});
test("Gemini models are discovered from the live API and filtered by capability", () => {
  assert.match(js, /supportedGenerationMethods/);
  assert.match(js, /generateContent/);
  assert.match(js, /chooseModel/);
});
test("responsive layout and mobile navigation exist", () => {
  assert.match(css, /@media\(max-width:820px\)/);
  assert.match(html, /menuBtn/);
});
