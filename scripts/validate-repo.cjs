"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const errors = [];
const warnings = [];

function rel(file) {
  return file.split(path.sep).join("/");
}
function exists(file) {
  return fs.existsSync(path.join(ROOT, file));
}
function read(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8");
}
function fail(message) {
  errors.push(message);
}
function warn(message) {
  warnings.push(message);
}
function assert(condition, message) {
  if (!condition) fail(message);
}
function unique(values) {
  return [...new Set(values)];
}
function walk(dir) {
  const absolute = path.join(ROOT, dir);
  if (!fs.existsSync(absolute)) return [];
  const out = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const child = path.join(absolute, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(rel(path.relative(ROOT, child))));
    } else {
      out.push(rel(path.relative(ROOT, child)));
    }
  }
  return out;
}
function extractStringLiterals(block) {
  return unique([...String(block || "").matchAll(/["']([^"']+)["']/g)].map(match => match[1]));
}
function extractSupportedActions(source) {
  let match = source.match(/(?:const|let|var)\s+SUPPORTED_ACTIONS\s*=\s*\[([\s\S]*?)\]\s*;/);
  if (match) return extractStringLiterals(match[1]);

  match = source.match(/ENGINE_READY[\s\S]{0,1600}?actions\s*:\s*\[([\s\S]*?)\]/);
  if (match) return extractStringLiterals(match[1]);

  match = source.match(/actions\s*:\s*\[([\s\S]*?)\][\s\S]{0,300}?ENGINE_READY/);
  if (match) return extractStringLiterals(match[1]);

  return [];
}

const requiredRootFiles = [
  "index.html",
  "player.html",
  "styles.css",
  "library.js",
  "library.css",
  "app.js",
  "lessons.js",
  "README.md",
  "AGENTS.md",
  "PROJECT_INTEGRATION_RULES.md",
  "AI_CAPABILITY_INDEX.json",
  "lesson-json/course.json",
  "lesson-json/chapter.schema.json"
];
for (const file of requiredRootFiles) {
  assert(exists(file), "Missing required root file: " + file);
}

assert(exists("simulator/action-contract.json"), "Missing simulator/action-contract.json");
assert(exists("simulator/adaptive-capabilities.json"), "Missing simulator/adaptive-capabilities.json");
assert(exists("scripts/build-capability-index.cjs"), "Missing scripts/build-capability-index.cjs");
assert(exists("scripts/build-lessons.cjs"), "Missing scripts/build-lessons.cjs");

let contract;
let manifest;
let course;

try {
  contract = JSON.parse(read("simulator/action-contract.json"));
} catch (error) {
  fail("Cannot parse simulator/action-contract.json: " + error.message);
}
try {
  manifest = JSON.parse(read("simulator/adaptive-capabilities.json"));
} catch (error) {
  fail("Cannot parse simulator/adaptive-capabilities.json: " + error.message);
}
try {
  const {buildCourse,renderLessons}=require("./build-lessons.cjs");
  const expectedLessons=renderLessons(buildCourse(ROOT));
  assert(read("lessons.js")===expectedLessons,"lessons.js is stale relative to lesson-json. Run: node scripts/build-lessons.cjs");
} catch (error) {
  fail("Cannot compile lesson-json source: " + error.message);
}

try {
  const raw = read("lessons.js").trim()
    .replace(/^window\.COURSE\s*=\s*/, "")
    .replace(/;\s*$/, "");
  course = JSON.parse(raw);
} catch (error) {
  fail("Cannot parse lessons.js course data: " + error.message);
}

try { const {build,json}=require("./build-capability-index.cjs"); assert(read("AI_CAPABILITY_INDEX.json")===json(build(ROOT)),"AI_CAPABILITY_INDEX.json is stale. Run: node scripts/build-capability-index.cjs"); } catch(error) { fail("Cannot validate AI capability index: "+error.message); }

const player = exists("player.html") ? read("player.html") : "";
const app = exists("app.js") ? read("app.js") : "";
assert(!player.includes('id="redisLabBtn"'), "Simulator-specific Redis sidebar navigation is forbidden; use lesson-driven activation");
assert(!player.includes('player.html?software=redis'), "Simulator-specific software preview links are forbidden in player.html");
assert(!app.includes('searchParams.get("software")'), "Simulator-specific software preview routing is forbidden in app.js");
assert(!app.includes("softwarePreview"), "Simulator-specific software preview state is forbidden in app.js");
assert(app.includes("simulator/shared/highlighter.js"), "Universal highlighter injection is missing from app.js");
assert(
  app.includes("simulator/shared/highlighter.js?v=15"),
  "Universal highlighter cache version is stale in app.js"
);
if (exists("simulator/shared/highlighter.js")) {
  const sharedHighlighter = read("simulator/shared/highlighter.js");
  assert(
    sharedHighlighter.includes("outline:4px solid #53a9ff") &&
    sharedHighlighter.includes("box-shadow:none") &&
    sharedHighlighter.includes("visibleUntil=Date.now()+5000") &&
    sharedHighlighter.includes("setTimeout(function(){clean(true)},5000)"),
    "Five-second boundary-only shared action-highlight contract is missing"
  );
  assert(
    sharedHighlighter.includes("visibleUntil") &&
    sharedHighlighter.includes("five-second notice window"),
    "Shared highlight runtime must preserve the five-second notice window"
  );
  assert(
    sharedHighlighter.includes("width:6px") &&
    sharedHighlighter.includes("background:#8bd3ff") &&
    sharedHighlighter.includes("outline:none") &&
    sharedHighlighter.includes("background-color:rgba(45,132,245,.34)") &&
    sharedHighlighter.includes("text-shadow:0 1px 1px rgba(0,0,0,.95)") &&
    !sharedHighlighter.includes("outline:2px solid #53a9ff") &&
    !sharedHighlighter.includes("content:''position") &&
    !sharedHighlighter.includes("0 0 13px 5px rgba(77,163,255,.58)"),
    "Boundary-only shared editor-line highlight contract is missing"
  );
}

if (exists("simulator/intellij/engine.js") && exists("simulator/intellij/ide-polish.css")) {
  const intellijEngine = read("simulator/intellij/engine.js");
  const intellijPolish = read("simulator/intellij/ide-polish.css");
  assert(
    intellijEngine.includes("terminalHighlightText") &&
    intellijEngine.includes("terminalCommandFocus"),
    "IntelliJ terminal command emphasis runtime is missing"
  );
  assert(
    intellijPolish.includes(".terminalCommandFocus") &&
    intellijPolish.includes("outline:2px solid #ffd400"),
    "IntelliJ terminal yellow command rectangle is missing"
  );
}

// Software simulators must be activated by lesson steps, not bespoke player navigation.
assert(exists("simulator/shared/explanation-controls.js"), "Missing simulator/shared/explanation-controls.js");
if (exists("simulator/shared/explanation-controls.js")) {
  const explanationControls = read("simulator/shared/explanation-controls.js");
  assert(
    /explanation-controls\.js\?v=\d+/.test(app),
    "Universal explanation-controls injection is missing from app.js"
  );
  assert(player.includes('data-sim-player="1"'), "player.html is missing the global explanation owner marker");
  assert(
    player.includes("simulator/shared/explanation-controls.js"),
    "player.html must load the global explanation runtime before app.js"
  );
  assert(
    explanationControls.includes('STORAGE_KEY="sim.explanation.v3"'),
    "Global explanation persistence key is missing"
  );
  assert(
    explanationControls.includes("window.SIM_EXPLANATION") &&
    explanationControls.includes("ResizeObserver"),
    "Global explanation API / dynamic height observer is missing"
  );
  assert(explanationControls.includes("data-sim-explanation-min"), "Explanation controls are missing minimize support");
  assert(explanationControls.includes("data-sim-explanation-close"), "Explanation controls are missing close support");
  assert(
    app.includes("window.SIM_EXPLANATION?.show"),
    "app.js must render explanations through the parent-owned global runtime"
  );
}