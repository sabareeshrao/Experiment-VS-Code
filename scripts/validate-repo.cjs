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
const packageWorkflow = exists(".github/workflows/package-simulator.yml")
  ? read(".github/workflows/package-simulator.yml")
  : "";
const requestedCapabilitySets = {
  intellij: ["code-editor","project-file-navigation","go-to-definition","editor-diagnostics","code-completion-popup","quick-fix-intention-actions","run-application-control","java-main-run","run-console-output","run-console-controls","external-libraries-view","java-documentation-view","import-existing-project","new-maven-project-wizard","maven-lifecycle-tool-window","integrated-terminal","java-desktop-app-preview"],
  postman: ["http-method-selector","request-url-editor","query-params-editor","request-body-editor","send-request","response-body-viewer","response-status-display"],
  mysql_workbench: ["execute-query","schema-refresh"],
  spring_initializer: ["spring-initializr-generator","language-selector","build-tool-selector","spring-boot-version-selector","project-metadata","packaging-selector","java-version-selector","config-format-selector","dependency-selector","generate-project"],
  maven_central: ["dependency-search","search-results","artifact-page","version-list","maven-dependency-snippet","copy-dependency-xml"]
};
if (manifest) {
  for (const [key, required] of Object.entries(requestedCapabilitySets)) {
    const available = new Set(manifest.simulators?.[key]?.features || []);
    for (const feature of required) {
      assert(available.has(feature), key + ": requested capability missing: " + feature);
    }
  }
}

if (exists("simulator/powerbi/index.html")) {
  const pbiIndex = read("simulator/powerbi/index.html");
  assert(pbiIndex.includes('id="onObjectClose"'), "Power BI on-object menu has no close control");
}

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

  if (exists("simulator/java-enterprise-capabilities.json")) {
    try {
      const enterprise = JSON.parse(read("simulator/java-enterprise-capabilities.json"));
      assert(Number(enterprise.targetPercent) >= 90, "Java enterprise target must remain at least 90%");
      const intellijSupported = supportedBySoftware.get("intellij") || new Set();
      for (const [domain, spec] of Object.entries(enterprise.domains || {})) {
        assert(Number(spec.target) >= 90, "Enterprise domain " + domain + " has target below 90%");
        for (const action of spec.actions || []) assert(intellijSupported.has(action), "Enterprise domain " + domain + " references unsupported IntelliJ action " + action);
      }
      const linuxSupported = supportedBySoftware.get("linux") || new Set();
      if (enterprise.kubectl) assert(linuxSupported.has(enterprise.kubectl.viaAction), "kubectl workflow references unsupported Linux action " + enterprise.kubectl.viaAction);
    } catch (error) { fail("Cannot validate simulator/java-enterprise-capabilities.json: " + error.message); }
  }
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
  assert(prepareSection.includes("enterprise-ui.js"), "IntelliJ UI artifact is missing enterprise-ui.js");
  assert(prepareSection.includes("simulator/shared"), "IntelliJ UI artifact is missing shared simulator runtimes");
}

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


// Kubernetes is a first-class master simulator.
if (contract && course) {
  assert(
    Object.prototype.hasOwnProperty.call(contract.simulators || {}, "kubernetes"),
    "Kubernetes is missing from simulator/action-contract.json"
  );
  assert(
    Object.prototype.hasOwnProperty.call((course.package && course.package.apps) || {}, "kubernetes"),
    "Kubernetes package baseline is missing"
  );
  assert(
    player.includes('id="kubernetesFrame"') && player.includes('data-app="kubernetes"'),
    "Kubernetes lazy iframe is missing from player.html"
  );
}

// Global layout runtime rule.
// Every simulator loads the common resize/persistence mechanics. Product visuals
// remain isolated in the simulator itself.
if (contract && contract.layoutPolicy?.requiredForEverySimulator) {
  for (const [software, spec] of Object.entries(contract.simulators || {})) {
    const indexPath = "simulator/" + spec.directory + "/index.html";
    if (!exists(indexPath)) continue;
    const html = read(indexPath);
    assert(
      html.includes("../shared/layout-resize.js"),
      software + ": index.html must load ../shared/layout-resize.js"
    );
  }
  assert(
    exists(contract.layoutPolicy.runtime),
    "Missing global layout runtime: " + contract.layoutPolicy.runtime
  );
}


// Redis runtime smoke contract.
// Redis must announce readiness from its own engine after the listener/API exists;
// relying only on shared boot-protocol can race and drop SIM_PACKAGE.
if (exists("simulator/redis/engine.js") && exists("simulator/redis/index.html")) {
  const redisEngine = read("simulator/redis/engine.js");
  const redisIndex = read("simulator/redis/index.html");
  assert(redisEngine.includes("function announceReady()"), "Redis engine is missing native announceReady()");
  assert(redisEngine.includes("announceReady();"), "Redis engine does not announce ENGINE_READY at startup");
  assert(redisEngine.includes("window.SimEngine"), "Redis engine is missing the SimEngine readiness adapter");
  assert(redisEngine.includes('m.type==="SIM_PING"') || redisEngine.includes("m.type === \"SIM_PING\""), "Redis engine does not respond to SIM_PING");
  assert(redisIndex.indexOf("engine.js?v=3") >= 0, "Redis index is not loading engine.js?v=3");
  assert(
    redisIndex.indexOf("engine.js?v=3") < redisIndex.indexOf("../shared/boot-protocol.js"),
    "Redis boot-protocol loads before the Redis engine and can race ENGINE_READY"
  );
  assert(
    player.includes('data-src="simulator/redis/index.html?v=3"'),
    "player.html is not cache-busted to Redis index v3"
  );
}


// Layout regression guards for the three high-interaction desktop simulators.
if (exists("simulator/shared/layout-resize.js")) {
  const layoutSource = read("simulator/shared/layout-resize.js");
  assert(
    layoutSource.includes("intellij:setupIntelliJ"),
    "IntelliJ must use the shared stable splitter/persistence runtime"
  );
  assert(
    layoutSource.includes("mysql_workbench:setupMySQLWorkbench"),
    "MySQL Workbench must use the shared stable splitter/persistence runtime"
  );
}
if (exists("simulator/intellij/engine.js")) {
  const intellijEngine = read("simulator/intellij/engine.js");
  assert(
    !intellijEngine.includes("developerJourney.intellij.nativeLayout.v1"),
    "IntelliJ has a competing native layout owner; shared layout must be the only splitter owner"
  );
}
if (exists("simulator/mysql_workbench/engine.js")) {
  const mysqlEngine = read("simulator/mysql_workbench/engine.js");
  assert(
    !mysqlEngine.includes("developerJourney.mysqlworkbench.nativeLayout.v1"),
    "MySQL Workbench has a competing native layout owner; shared layout must be the only splitter owner"
  );
}
if (exists("simulator/powerbi/index.html") && exists("simulator/powerbi/engine.js")) {
  const pbiHtml = read("simulator/powerbi/index.html");
  const pbiEngine = read("simulator/powerbi/engine.js");
  assert(
    pbiHtml.includes('id="onObjectClose"') &&
    pbiHtml.includes(".onObjectMenu{position:absolute") &&
    pbiHtml.includes(".modal.minimized .modalBody"),
    "Power BI contained transient UI / close-minimize controls regressed"
  );
  assert(
    pbiEngine.includes("refs.mainArea.getBoundingClientRect()") &&
    pbiEngine.includes("hideOnObjectMenu") &&
    pbiEngine.includes("data-pbi-modal-close"),
    "Power BI overlay positioning/dismissal regression detected"
  );
}

/* Screenshot-derived UI regression guards. */
if (exists("simulator/intellij/engine.js") && exists("simulator/shared/layout-resize.js")) {
  const ijEngine = read("simulator/intellij/engine.js");
  const layoutRuntime = read("simulator/shared/layout-resize.js");
  assert(ijEngine.includes('id="intellijProjectResizeHit"') || ijEngine.includes('projectResizeHit.id="intellijProjectResizeHit"'), "IntelliJ Project splitter wide hit target is missing");
  assert(ijEngine.includes('left:"-10px"') && ijEngine.includes('right:"-10px"'), "IntelliJ Project splitter hit target is not wide enough");
  assert(ijEngine.includes('document.addEventListener("pointermove"') && ijEngine.includes('style.setProperty("--leftW"'), "IntelliJ Project splitter document-level drag tracking is missing");
  const ijSetupStart = layoutRuntime.indexOf("function setupIntelliJ()");
  const ijSetupEnd = layoutRuntime.indexOf("function setupPostman()", ijSetupStart);
  const ijSetup = ijSetupStart >= 0 && ijSetupEnd > ijSetupStart ? layoutRuntime.slice(ijSetupStart, ijSetupEnd) : "";
  assert(ijSetup.includes("rememberExisting") && !ijSetup.includes("wirePersistentSplitter"), "Shared runtime is competing with IntelliJ native splitter ownership");
}
if (exists("simulator/mysql_workbench/index.html")) {
  const mwb = read("simulator/mysql_workbench/index.html");
  assert(
    mwb.includes("grid-template-rows:26px 32px minmax(0,1fr) 112px"),
    "MySQL Workbench Navigator must allocate rows for tabs, filter, tree, and object info"
  );
  assert((mwb.match(/data-sim-app=/g)||[]).length === 1, "MySQL Workbench contains duplicate data-sim-app attributes");
}

if (exists("simulator/intellij/ide-polish.css")) {
  const ijPolish = read("simulator/intellij/ide-polish.css");
  assert(
    !/body\.theme-dark\{[^}]*--(?:leftW|rightW|bottomH)/.test(ijPolish),
    "IntelliJ body.theme-dark must not override root layout variables; doing so makes splitter drag visually inert"
  );
}

// Detailed per-software feature catalog contract.
assert(exists("scripts/build-feature-catalog.cjs"), "Missing scripts/build-feature-catalog.cjs");
function featureCatalogSlug(value){
  return String(value||"")
    .replace(/([a-z0-9])([A-Z])/g,"$1-$2")
    .replace(/[^a-zA-Z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"")
    .toLowerCase();
}
if (contract && manifest) {
  for (const [software, spec] of Object.entries(contract.simulators || {})) {
    const featureDir = "simulator/" + spec.directory + "/features";
    const indexPath = featureDir + "/index.json";
    const readmePath = featureDir + "/README.md";
    assert(exists(indexPath), software + ": missing detailed features/index.json");
    assert(exists(readmePath), software + ": missing detailed features/README.md");
    if (!exists(indexPath)) continue;
    let featureIndex;
    try { featureIndex = JSON.parse(read(indexPath)); }
    catch (error) { fail(software + ": cannot parse " + indexPath + ": " + error.message); continue; }
    const listed = Array.isArray(featureIndex.files) ? featureIndex.files : [];
    assert(featureIndex.purpose && /individual feature/i.test(featureIndex.purpose), software + ": feature index must say individual feature files are authoritative");
    assert(featureIndex.feature_file_count === listed.length, software + ": feature_file_count does not match files[]");
    const fileSet = new Set(listed);
    const meta = manifest.simulators?.[spec.manifestKey] || {};
    for (const feature of meta.features || []) {
      const file = featureCatalogSlug(feature) + ".json";
      assert(fileSet.has(file), software + ": manifest capability missing detailed feature file: " + file);
    }
    const enginePath = "simulator/" + spec.directory + "/" + spec.engineSource;
    if (exists(enginePath)) {
      const actions = extractSupportedActions(read(enginePath));
      for (const action of actions) {
        const file = featureCatalogSlug(action) + ".json";
        assert(fileSet.has(file), software + ": engine action missing detailed feature file: " + action + " -> " + file);
      }
    }
    for (const file of listed) {
      const full = featureDir + "/" + file;
      assert(exists(full), software + ": feature index references missing file " + full);
      if (!exists(full)) continue;
      let detail;
      try { detail = JSON.parse(read(full)); }
      catch (error) { fail(software + ": cannot parse feature file " + full + ": " + error.message); continue; }
      assert(detail.schema_version === 1, software + ": unsupported feature schema in " + file);
      assert(detail.software?.id === software, software + ": feature file software id mismatch in " + file);
      assert(detail.feature?.id === file.slice(0,-5), software + ": feature id/file mismatch in " + file);
      for (const key of ["intent","ui_contract","input_contract","state_contract","transcript_matching","lesson_authoring","implementation","replay_and_quality","validation","maintenance"]) {
        assert(detail[key] && typeof detail[key] === "object", software + ": " + file + " missing detailed section " + key);
      }
      assert(detail.lesson_authoring?.missing_feature_rule, software + ": " + file + " missing missing-feature guidance");
      assert(detail.implementation?.engine_source, software + ": " + file + " missing engine source");
      assert(detail.ui_contract?.required_visibility, software + ": " + file + " missing visible UI contract");
    }
  }
}

for (const warning of warnings) console.warn("WARNING:", warning);

if (errors.length) {
  console.error("\nRepository validation failed with " + errors.length + " error(s):");
  errors.forEach((error, index) => console.error(String(index + 1).padStart(3, " ") + ". " + error));
  process.exit(1);
}


/* IDE split editor + terminal lesson guards. */
if (exists("simulator/intellij/index.html") && exists("simulator/intellij/engine.js")) { const h=read("simulator/intellij/index.html"), e=read("simulator/intellij/engine.js"); assert(h.includes('id="editorSplitWrap"'), "IntelliJ split editor DOM missing"); assert(e.includes("function renderSplitEditor()") && e.includes('case"splitEditor"'), "IntelliJ split editor behavior missing"); }
if (exists("simulator/vscode/index.html") && exists("simulator/vscode/engine.js")) { const h=read("simulator/vscode/index.html"), e=read("simulator/vscode/engine.js"); assert(h.includes('id="editorSplitPane"'), "VS Code split editor DOM missing"); assert(e.includes("function renderSplitEditor()") && e.includes('case"splitEditor"'), "VS Code split editor behavior missing"); }
if (exists("lesson-json/chapters/01-student-class-fundamentals.json")) { const c=read("lesson-json/chapters/01-student-class-fundamentals.json"); assert(c.includes('"Split the IntelliJ editor"') && c.includes('"Use IntelliJ terminal with the split editor"'), "IntelliJ split/terminal lessons missing"); }
if (exists("lesson-json/chapters/04-vscode-integration-test.json")) { const c=read("lesson-json/chapters/04-vscode-integration-test.json"); assert(c.includes('"Split the VS Code editor"') && c.includes('"Use VS Code terminal with the split editor"'), "VS Code split/terminal lessons missing"); }

console.log("Repository validation passed.");


// Downstream integration contract guards.
assert(exists("templates/downstream-project/README.md"), "Missing downstream project template README");
assert(exists("templates/downstream-project/MASTER_SOFTWARE_REF.example"), "Missing downstream master reference template");
assert(exists("templates/downstream-project/deploy-pages.yml"), "Missing downstream project deployment template");
if (exists("PROJECT_INTEGRATION_RULES.md")) {
  const downstreamRules = read("PROJECT_INTEGRATION_RULES.md");
  assert(downstreamRules.includes("MASTER_SOFTWARE_REF"), "Downstream rules must define MASTER_SOFTWARE_REF");
  assert(downstreamRules.includes("software-snapshot.json"), "Downstream rules must require software-snapshot.json");
  assert(downstreamRules.includes("Do not patch the missing simulator feature only inside one downstream repository"), "Downstream simulator ownership rule is missing");
}
if (exists("AGENTS.md")) {
  const agentRules = read("AGENTS.md");
  assert(agentRules.includes("PROJECT_INTEGRATION_RULES.md"), "AGENTS.md must point to downstream integration rules");
  assert(agentRules.includes("SIMULATOR_INTEGRATION_RULES.md"), "AGENTS.md must point to simulator integration rules");
}