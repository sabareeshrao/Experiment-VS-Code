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
  "README.md"
];
for (const file of requiredRootFiles) {
  assert(exists(file), "Missing required root file: " + file);
}

assert(exists("simulator/action-contract.json"), "Missing simulator/action-contract.json");
assert(exists("simulator/adaptive-capabilities.json"), "Missing simulator/adaptive-capabilities.json");

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
  const raw = read("lessons.js").trim()
    .replace(/^window\.COURSE\s*=\s*/, "")
    .replace(/;\s*$/, "");
  course = JSON.parse(raw);
} catch (error) {
  fail("Cannot parse lessons.js course data: " + error.message);
}

const player = exists("player.html") ? read("player.html") : "";
const app = exists("app.js") ? read("app.js") : "";
const packageWorkflow = exists(".github/workflows/package-simulator.yml")
  ? read(".github/workflows/package-simulator.yml")
  : "";

if (contract && manifest && course) {
  const simulators = contract.simulators || {};
  const manifestSimulators = manifest.simulators || {};
  const packageApps = (course.package && course.package.apps) || {};

  const supportedBySoftware = new Map();

  for (const [software, spec] of Object.entries(simulators)) {
    const base = "simulator/" + spec.directory;
    const indexPath = base + "/index.html";
    const sourcePath = base + "/" + spec.engineSource;

    assert(exists(indexPath), software + ": missing " + indexPath);
    assert(exists(sourcePath), software + ": missing action source " + sourcePath);
    assert(
      player.includes('id="' + spec.frameId + '"') &&
      player.includes('data-app="' + software + '"'),
      software + ": player.html is missing iframe " + spec.frameId + " / data-app=" + software
    );
    assert(
      app.includes(spec.frameId),
      software + ": app.js does not reference frame " + spec.frameId
    );
    assert(
      Object.prototype.hasOwnProperty.call(packageApps, spec.packageKey),
      software + ": lessons.js package is missing apps." + spec.packageKey
    );
    assert(
      Object.prototype.hasOwnProperty.call(manifestSimulators, spec.manifestKey),
      software + ": adaptive-capabilities.json is missing " + spec.manifestKey
    );

    if (exists(sourcePath)) {
      const source = read(sourcePath);
      for (const marker of contract.protocol.requiredEngineMarkers || []) {
        assert(source.includes(marker), software + ": missing protocol marker " + marker + " in " + sourcePath);
      }
      const supported = extractSupportedActions(source);
      assert(supported.length > 0, software + ": could not discover supported actions in " + sourcePath);
      supportedBySoftware.set(software, new Set(supported));
    }
  }

  const stageTitles = new Set();
  const usedSoftware = new Set();
  let totalSteps = 0;

  for (let stageIndex = 0; stageIndex < (course.stages || []).length; stageIndex += 1) {
    const stage = course.stages[stageIndex];
    const chapter = stageIndex + 1;

    assert(stage && typeof stage.title === "string" && stage.title.trim(), "Chapter " + chapter + " has no title");
    if (stageTitles.has(stage.title)) fail("Duplicate stage title: " + stage.title);
    stageTitles.add(stage.title);

    const steps = (stage && stage.steps) || [];
    assert(Array.isArray(steps) && steps.length > 0, "Chapter " + chapter + " has no lesson steps");

    for (let localIndex = 0; localIndex < steps.length; localIndex += 1) {
      totalSteps += 1;
      const step = steps[localIndex] || {};
      const where = "Chapter " + chapter + ", step " + (localIndex + 1);
      const software = step.software || "intellij";
      const action = step.action && step.action.action;

      assert(typeof step.title === "string" && step.title.trim(), where + ": missing title");
      assert(typeof step.why === "string" && step.why.trim(), where + ": missing explanation/why text");
      assert(typeof action === "string" && action.trim(), where + ": missing action.action");
      assert(Object.prototype.hasOwnProperty.call(simulators, software), where + ": unregistered software " + software);

      usedSoftware.add(software);

      const supported = supportedBySoftware.get(software);
      if (supported && action && !supported.has(action)) {
        fail(where + ": " + software + " does not declare action " + action);
      }
    }
  }

  const books = course.books || [];
  const chapterCoverage = Array((course.stages || []).length + 1).fill(0);
  const bookIds = new Set();

  for (const book of books) {
    assert(book && typeof book.id === "string" && book.id.trim(), "Book is missing id");
    if (bookIds.has(book.id)) fail("Duplicate book id: " + book.id);
    bookIds.add(book.id);

    const start = Number(book.chapterStart);
    const end = Number(book.chapterEnd);
    assert(Number.isInteger(start) && Number.isInteger(end), "Book " + book.id + " has invalid chapter range");
    assert(start >= 1 && end >= start && end <= (course.stages || []).length, "Book " + book.id + " chapter range is outside the course");
    for (let chapter = start; chapter <= end && chapter < chapterCoverage.length; chapter += 1) {
      chapterCoverage[chapter] += 1;
    }
  }

  for (let chapter = 1; chapter < chapterCoverage.length; chapter += 1) {
    assert(chapterCoverage[chapter] === 1, "Chapter " + chapter + " must belong to exactly one book; found " + chapterCoverage[chapter]);
  }

  for (const software of usedSoftware) {
    assert(Object.prototype.hasOwnProperty.call(simulators, software), "Used software missing from action contract: " + software);
  }

  console.log("Course:", books.length, "books,", (course.stages || []).length, "chapters,", totalSteps, "steps");
  console.log("Lesson software:", [...usedSoftware].sort().join(", "));
}

const jsFiles = unique([
  "app.js",
  "library.js",
  "lessons.js",
  ...walk("simulator").filter(file => file.endsWith(".js")),
  ...walk("project-data").filter(file => file.endsWith(".js"))
]).filter(exists);

for (const file of jsFiles) {
  try {
    new vm.Script(read(file), { filename: file });
  } catch (error) {
    fail("JavaScript syntax error in " + file + ": " + error.message);
  }
}

if (packageWorkflow) {
  const triggerSection = packageWorkflow.split("permissions:")[0] || "";
  const prepareIndex = packageWorkflow.indexOf("- name: Prepare packages");
  const prepareSection = prepareIndex >= 0 ? packageWorkflow.slice(prepareIndex) : "";

  for (const file of ["player.html", "library.js", "library.css"]) {
    assert(triggerSection.includes(file), "Packaging workflow does not trigger when " + file + " changes");
    assert(prepareSection.includes(file), "Packaging workflow does not copy " + file + " into the complete trial artifact");
  }
  assert(prepareSection.includes("adaptive-ui.js"), "IntelliJ UI artifact is missing adaptive-ui.js");
  assert(prepareSection.includes("simulator/shared"), "IntelliJ UI artifact is missing shared simulator runtimes");
}

for (const warning of warnings) console.warn("WARNING:", warning);

if (errors.length) {
  console.error("\nRepository validation failed with " + errors.length + " error(s):");
  errors.forEach((error, index) => console.error(String(index + 1).padStart(3, " ") + ". " + error));
  process.exit(1);
}

console.log("Repository validation passed.");


// Regression guard: explanation-only/stale-screen failure.
// Never reset engineReady to false in the iframe load handler after a child may
// already have posted ENGINE_READY. That blocks SIM_SEEK while SIM_EXPLAIN keeps working.
if (exists("app.js")) {
  const appSource = read("app.js");
  assert(
    !/frame\.addEventListener\(["']load["'][\s\S]{0,220}?engineReady\[name\]\s*=\s*false/.test(appSource),
    "app.js clears engineReady inside iframe load handler; this causes stale simulator playback"
  );
  assert(
    appSource.includes("doc?.readyState === \"complete\"") &&
    appSource.includes("hydrateReadyFrame"),
    "app.js is missing the legacy iframe load-complete readiness fallback"
  );
}
