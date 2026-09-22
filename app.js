(() => {
  "use strict";

  const course = window.COURSE || { stages: [] };
  const $ = id => document.getElementById(id);

  const frames = {
    intellij: $("ideFrame"),
    vscode: $("vscodeFrame"),
    pgadmin: $("pgadminFrame"),
    postman: $("postmanFrame"),
    cmd: $("cmdFrame"),
    linux: $("linuxFrame"),
    ssms: $("ssmsFrame"),
    jira: $("jiraFrame"),
    jenkins: $("jenkinsFrame")
  };

  const appIds = {
    intellij: "intellij_idea",
    vscode: "vscode",
    pgadmin: "pgadmin",
    postman: "postman",
    cmd: "cmd",
    linux: "linux",
    ssms: "sql_server_management_studio",
    jira: "jira",
    jenkins: "jenkins"
  };

  const appLabels = {
    intellij: "IntelliJ IDEA",
    vscode: "VS Code",
    pgadmin: "pgAdmin 4",
    postman: "Postman",
    cmd: "Command Prompt",
    linux: "Linux",
    ssms: "SQL Server Management Studio",
    jira: "Jira",
    jenkins: "Jenkins"
  };

  const engineReady = {
    intellij: false,
    vscode: false,
    pgadmin: false,
    postman: false,
    cmd: false,
    linux: false,
    ssms: false,
    jira: false,
    jenkins: false
  };

  function ensureGlobalSimulatorRuntime(frame) {
    if (!frame) return;
    try {
      const doc = frame.contentDocument;
      if (!doc?.documentElement || !doc.body) return;

      const ensureScript = (needle, src, flag) => {
        const loaded = [...doc.scripts].some(script =>
          String(script.src || "").includes(needle)
        );
        if (loaded) return;
        const script = doc.createElement("script");
        script.src = new URL(src, location.href).href;
        script.dataset[flag] = "1";
        doc.body.appendChild(script);
      };

      // Universal rules for every current and future simulator.
      ensureScript(
        "/simulator/shared/explanation-controls.js",
        "simulator/shared/explanation-controls.js?v=6",
        "globalExplanationRuntime"
      );
      ensureScript(
        "/simulator/shared/layout-resize.js",
        "simulator/shared/layout-resize.js?v=5",
        "globalUiPersistence"
      );
    } catch (_) {}
  }

  // Every simulator iframe, including software added later, automatically gets
  // universal explanation dragging, UI persistence and focus-follow scrolling.
  document.querySelectorAll("iframe.sim-frame").forEach(frame => {
    frame.addEventListener("load", () => ensureGlobalSimulatorRuntime(frame));
    setTimeout(() => ensureGlobalSimulatorRuntime(frame), 0);
  });

  const stageList = $("stageList");
  const stepTitle = $("stepTitle");
  const stageLabel = $("stageLabel");
  const softwareBadge = $("softwareBadge");
  const prevBtn = $("prevBtn");
  const nextBtn = $("nextBtn");
  const replayBtn = $("replayBtn");
  const stepCounter = $("stepCounter");
  const stepProgress = $("stepProgress");
  const stepSearch = $("stepSearch");
  const toggleSidebar = $("toggleSidebar");
  const ideFullscreen = $("ideFullscreen");
  const fullCodeBtn = $("fullCodeBtn");
  const playbackBar = $("playbackBar");
  const workspace = document.querySelector(".workspace");

  const flat = [];
  (course.stages || []).forEach((stage, stageIndex) => {
    (stage.steps || []).forEach((step, localIndex) => {
      flat.push({
        ...step,
        software: step.software || "intellij",
        stageIndex,
        localIndex,
        globalIndex: flat.length
      });
    });
  });

  const requestedStep = Number(new URL(location.href).searchParams.get("step"));
  let current = flat.length
    ? Math.max(0, Math.min(flat.length - 1, Number.isFinite(requestedStep) && requestedStep > 0 ? requestedStep - 1 : 0))
    : 0;

  let fullCodeMode = new URL(location.href).searchParams.get("view") === "full";
  let activeSoftware = fullCodeMode ? "intellij" : (flat[current]?.software || "intellij");
  let openStages = new Set(flat.length ? [flat[current].stageIndex] : []);

  const fullProjectPackage =
    typeof window.buildFullProjectPackage === "function"
      ? window.buildFullProjectPackage()
      : null;

  function normalizeSoftware(value) {
    if (value === "pgadmin") return "pgadmin";
    if (value === "vscode") return "vscode";
    if (value === "postman") return "postman";
    if (value === "cmd") return "cmd";
    if (value === "linux") return "linux";
    if (value === "ssms") return "ssms";
    if (value === "jira") return "jira";
    if (value === "jenkins") return "jenkins";
    return "intellij";
  }

  function switchWorkspace(software) {
    activeSoftware = normalizeSoftware(software);

    Object.entries(frames).forEach(([name, frame]) => {
      if (!frame) return;
      frame.classList.toggle("active", name === activeSoftware);
      frame.setAttribute("aria-hidden", name === activeSoftware ? "false" : "true");
    });

    softwareBadge.textContent = appLabels[activeSoftware];
    softwareBadge.classList.toggle("pgadmin", activeSoftware === "pgadmin");
    softwareBadge.classList.toggle("vscode", activeSoftware === "vscode");
    softwareBadge.classList.toggle("postman", activeSoftware === "postman");
    softwareBadge.classList.toggle("cmd", activeSoftware === "cmd");
    softwareBadge.classList.toggle("linux", activeSoftware === "linux");
    softwareBadge.classList.toggle("ssms", activeSoftware === "ssms");
    softwareBadge.classList.toggle("jira", activeSoftware === "jira");
    softwareBadge.classList.toggle("jenkins", activeSoftware === "jenkins");
    softwareBadge.classList.toggle("intellij", activeSoftware === "intellij");
  }

  function stepsThrough(index, software) {
    const target = normalizeSoftware(software);
    return flat
      .slice(0, index + 1)
      .filter(step => normalizeSoftware(step.software) === target)
      .map(step => step.action);
  }

  function sendCoursePackage(software) {
    const target = normalizeSoftware(software);
    if (!engineReady[target] || !course.package) return;

    let packageForApp = course.package;

    // VS Code uses the same Java Practice source snapshot as IntelliJ so the
    // Explorer/editor look like a real project instead of a tiny demo folder.
    if (target === "vscode" && fullProjectPackage?.apps?.intellij_idea?.files) {
      packageForApp = JSON.parse(JSON.stringify(course.package));
      const vscode = packageForApp.apps.vscode || (packageForApp.apps.vscode = {});
      vscode.workspaceName = fullProjectPackage.apps.intellij_idea.project?.name || "Java Practice";
      vscode.files = {
        ...fullProjectPackage.apps.intellij_idea.files,
        ...(vscode.files || {})
      };

      const preferred = "src/polymorphism/Calculator.java";
      if (vscode.files[preferred]) {
        vscode.initialFile = preferred;
        vscode.openTabs = [
          { path: preferred, pinned: true },
          { path: "src/Threads/TwoThreads/MyThread.java", pinned: true }
        ].filter(tab => vscode.files[tab.path]);
      }
    }

    frames[target].contentWindow.postMessage({
      type: "SIM_PACKAGE",
      package: packageForApp,
      theme: "dark",
      autoType: true
    }, "*");
  }

  function sendCoursePackageToAll() {
    Object.keys(frames).forEach(sendCoursePackage);
  }

  function actionTextFromPath(value) {
    if (!value) return "";
    const clean = String(value).replace(/\\/g, "/");
    return clean.split("/").pop().split(":").pop();
  }

  function highlightPlanForStep(step) {
    if (!step?.action) return null;
    const software = normalizeSoftware(step.software);
    const action = step.action.action;
    const plan = (selectors, extra = {}) => ({ selectors, duration: 1050, ...extra });

    // Blue guidance is only for controls the developer clicks.
    // Editors/terminals use their own native changed-line emphasis.
    if (software === "intellij") {
      if (action === "newProject" || action === "createPackage" || action === "createFile") return plan(["#newBtn"]);
    }
    if (software === "vscode") {
      if (action === "createFile") return plan(["#newFileBtn"]);
    }
    if (software === "pgadmin") {
      if (action === "openQueryTool") return plan(["#newQuery"]);
      if (action === "executeQuery") return plan(["#run"]);
    }
    if (software === "postman") {
      if (action === "setEnvironment") return plan(["#envName"]);
      if (action === "setMethod") return plan(["#methodBox"]);
      if (action === "setHeaders") return plan(["#reqTabs"], { text: "Headers", scope: "#reqTabs" });
      if (action === "sendRequest") return plan(["#sendBtn"]);
      if (action === "selectResponseTab") return plan(["#respTabs"]);
    }
    if (software === "ssms") {
      if (action === "openConnectDialog") return plan(['[data-target="connect"]']);
      if (action === "connectServer") return plan(['[data-target="connectDialogButton"]']);
      if (action === "changeDatabase") return plan(["#dbSelect"]);
      if (action === "newQuery") return plan(['[data-target="newQuery"]']);
      if (action === "executeQuery") return plan(['[data-target="execute"]']);
      if (action === "refreshObjectExplorer") return plan(['[data-target="refreshObjectExplorer"]']);
      if (action === "showActualExecutionPlan") return plan(['[data-resulttab="plan"]']);
      if (action === "showClientStatistics") return plan(['[data-resulttab="stats"]']);
      if (action === "saveQuery") return plan(['[data-target="save"]']);
    }
    if (software === "jenkins") {
      if (action === "typeSearch") return plan(["#search"]);
      if (action === "openJob") return plan(["#main"], { text: step.action.data?.name || "", scope: "#main" });
      if (action === "pressBuildNow") return plan(["#main"], { text: "Build Now", scope: "#main" });
      if (action === "openBuildWithParameters") return plan(["#main"], { text: "Build with Parameters", scope: "#main" });
      if (action === "openConfigureJob") return plan(["#main"], { text: "Configure", scope: "#main" });
      if (action === "validateJenkinsfile") return plan(["#main"], { text: "Jenkinsfile", scope: "#main" });
      if (action === "openTestResults") return plan(["#main"], { text: "Test Result", scope: "#main" });
      if (action === "openArtifacts") return plan(["#main"], { text: "Artifacts", scope: "#main" });
    }
    return null;
  }

  function sendSeekNow(index, target, animateFinal) {
    frames[target].contentWindow.postMessage({
      type: "SIM_SEEK",
      steps: stepsThrough(index, target),
      animateFinal: !!animateFinal,
      autoType: true
    }, "*");
  }

  function highlightCurrentAction(index, target) {
    const plan = highlightPlanForStep(flat[index]);
    frames[target].contentWindow.postMessage({ type: "SIM_HIGHLIGHT_CLEAR" }, "*");
    if (!plan) return;
    setTimeout(() => {
      frames[target].contentWindow.postMessage({
        type: "SIM_HIGHLIGHT",
        plan
      }, "*");
    }, 90);
  }

  function seekSoftware(index, software, animateFinal) {
    const target = normalizeSoftware(software);
    if (!engineReady[target] || !flat.length) return;

    // Never block navigation on visual guidance. The step state is rebuilt
    // immediately, then the relevant control is highlighted independently.
    sendSeekNow(index, target, animateFinal);
    highlightCurrentAction(index, target);
  }

  function explainCurrentStep() {
    if (!flat.length || fullCodeMode) return;
    const step = flat[current];
    const target = normalizeSoftware(step.software);
    if (!engineReady[target]) return;

    const stage = course.stages[step.stageIndex];

    frames[target].contentWindow.postMessage({
      type: "SIM_EXPLAIN",
      title: step.title,
      text: step.why,
      stage: stage.title
    }, "*");
  }

  function scheduleCurrentExplanation(delay = 120) {
    const expected = current;
    setTimeout(() => {
      if (!fullCodeMode && current === expected) explainCurrentStep();
    }, delay);
  }

  function updateUrlForFullCode() {
    const url = new URL(location.href);
    url.searchParams.delete("step");
    url.searchParams.set("view", "full");
    history.replaceState({}, "", url);
  }

  function updateUrlForStep() {
    const url = new URL(location.href);
    url.searchParams.delete("view");
    url.searchParams.set("step", current + 1);
    history.replaceState({}, "", url);
  }

  function setPlaybackVisibility() {
    const hasStages = flat.length > 0 && !fullCodeMode;
    playbackBar.classList.toggle("hidden", !hasStages);
    workspace.classList.toggle("no-playback", !hasStages);
  }

  function renderSidebar() {
    const q = stepSearch.value.trim().toLowerCase();
    const numericQuery = /^\d+\.?$/.test(q)
      ? Number(q.replace(/\D/g, ""))
      : null;

    stageList.innerHTML = "";
    if (!flat.length) return;

    let global = 0;

    (course.stages || []).forEach((stage, stageIndex) => {
      const indices = (stage.steps || []).map((_, i) => global + i);
      global += (stage.steps || []).length;

      const stageTextMatch = !q || stage.title.toLowerCase().includes(q);
      const stepMatches = (stage.steps || []).some((step, i) => {
        const label = appLabels[normalizeSoftware(step.software || "intellij")].toLowerCase();
        return (
          step.title.toLowerCase().includes(q) ||
          label.includes(q) ||
          (numericQuery !== null && indices[i] + 1 === numericQuery)
        );
      });

      if (q && !stageTextMatch && !stepMatches) return;

      const block = document.createElement("section");
      const isCurrent =
        !fullCodeMode &&
        flat[current]?.stageIndex === stageIndex;
      const isOpen = openStages.has(stageIndex) || !!q;

      block.className =
        "stage-block" +
        (isCurrent ? " current" : "") +
        (isOpen ? " open" : "");

      const head = document.createElement("button");
      head.className = "stage-head";
      head.innerHTML =
        "<span>" + stage.title + "</span>" +
        '<span class="stage-count">' + (stage.steps || []).length + " steps</span>" +
        '<span class="stage-chevron">' + (isOpen ? "⌃" : "⌄") + "</span>";

      head.onclick = () => {
        if (openStages.has(stageIndex)) openStages.delete(stageIndex);
        else openStages.add(stageIndex);
        renderSidebar();
      };

      block.appendChild(head);

      const wrap = document.createElement("div");
      wrap.className = "steps-wrap";

      (stage.steps || []).forEach((step, localIndex) => {
        const gi = indices[localIndex];
        const software = normalizeSoftware(step.software || "intellij");
        const softwareLabel = appLabels[software];

        const numberMatch = numericQuery !== null && gi + 1 === numericQuery;
        const textMatch =
          step.title.toLowerCase().includes(q) ||
          stage.title.toLowerCase().includes(q) ||
          softwareLabel.toLowerCase().includes(q);

        if (q && !numberMatch && !textMatch) return;

        const button = document.createElement("button");
        button.className =
          "step-link" +
          (!fullCodeMode && gi === current ? " active" : "") +
          (!fullCodeMode && gi < current ? " done" : "");

        button.innerHTML =
          '<span class="step-number">' + (gi + 1) + ".</span>" +
          '<span class="step-main">' + step.title + "</span>";

        button.onclick = () => goToStep(gi, true);
        wrap.appendChild(button);
      });

      block.appendChild(wrap);
      stageList.appendChild(block);
    });
  }

  function loadFullCode() {
    fullCodeMode = true;
    switchWorkspace("intellij");

    fullCodeBtn.classList.add("active");
    fullCodeBtn.querySelector("span:last-child").textContent = "Full Code Open";

    stageLabel.textContent = "FULL PROJECT";
    stepTitle.textContent = "Java Practice";
    setPlaybackVisibility();
    renderSidebar();
    updateUrlForFullCode();

    if (!engineReady.intellij || !fullProjectPackage) return;

    frames.intellij.contentWindow.postMessage({
      type: "SIM_PACKAGE",
      package: fullProjectPackage,
      theme: "dark",
      autoType: false
    }, "*");

    frames.intellij.contentWindow.postMessage({
      type: "SIM_SEEK",
      steps: [],
      animateFinal: false,
      autoType: false
    }, "*");
  }

  function renderCurrentStep() {
    if (!flat.length) {
      switchWorkspace("intellij");
      stageLabel.textContent = fullCodeMode ? "FULL PROJECT" : "PROJECT PREVIEW";
      stepTitle.textContent = "Java Practice";
      setPlaybackVisibility();
      renderSidebar();
      return;
    }

    const step = flat[current];
    const stage = course.stages[step.stageIndex];
    const software = normalizeSoftware(step.software);

    switchWorkspace(software);
    openStages.add(step.stageIndex);

    stageLabel.textContent = stage.title.toUpperCase();
    stepTitle.textContent = (current + 1) + ". " + step.title;

    stepCounter.textContent = (current + 1) + " / " + flat.length;
    stepProgress.style.width = (((current + 1) / flat.length) * 100) + "%";
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === flat.length - 1;

    setPlaybackVisibility();
    renderSidebar();
    updateUrlForStep();
  }

  function goToStep(index, animateFinal) {
    if (!flat.length) return;

    const wasFullCode = fullCodeMode;
    fullCodeMode = false;

    fullCodeBtn.classList.remove("active");
    fullCodeBtn.querySelector("span:last-child").textContent = "View Full Code";

    current = Math.max(0, Math.min(flat.length - 1, index));
    const software = normalizeSoftware(flat[current].software);

    if (wasFullCode) sendCoursePackageToAll();

    renderCurrentStep();
    seekSoftware(current, software, animateFinal);
    scheduleCurrentExplanation(120);
  }

  window.addEventListener("message", event => {
    let software = null;

    for (const [name, frame] of Object.entries(frames)) {
      if (event.source === frame?.contentWindow) {
        software = name;
        break;
      }
    }

    if (!software) return;

    if (event.data?.type === "SIM_NAVIGATE") {
      if (fullCodeMode || !flat.length) return;
      if (event.data.direction === "next" && current < flat.length - 1) goToStep(current + 1, true);
      if (event.data.direction === "prev" && current > 0) goToStep(current - 1, false);
      return;
    }

    if (event.data?.type !== "ENGINE_READY") return;

    engineReady[software] = true;

    if (fullCodeMode && software === "intellij") {
      loadFullCode();
      return;
    }

    sendCoursePackage(software);

    if (!fullCodeMode && flat.length && normalizeSoftware(flat[current].software) === software) {
      setTimeout(() => {
        seekSoftware(current, software, false);
        renderCurrentStep();
        scheduleCurrentExplanation(120);
      }, 0);
    }
  });

  fullCodeBtn.onclick = loadFullCode;

  prevBtn.onclick = () => goToStep(current - 1, false);
  nextBtn.onclick = () => goToStep(current + 1, true);
  replayBtn.onclick = () => {
    if (!flat.length || fullCodeMode) return;
    seekSoftware(current, flat[current].software, true);
  };

  stepSearch.oninput = renderSidebar;

  toggleSidebar.onclick = () => {
    document.body.classList.toggle("sidebar-hidden");
    toggleSidebar.textContent =
      document.body.classList.contains("sidebar-hidden")
        ? "Show progress"
        : "Hide progress";
  };

  ideFullscreen.onclick = async () => {
    try {
      const frame = frames[activeSoftware];
      if (!document.fullscreenElement) await frame.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {}
  };

  document.addEventListener("keydown", event => {
    if (fullCodeMode || !flat.length) return;

    if (event.key === "ArrowRight" && current < flat.length - 1) {
      goToStep(current + 1, true);
    }

    if (event.key === "ArrowLeft" && current > 0) {
      goToStep(current - 1, false);
    }

    if (
      event.key.toLowerCase() === "r" &&
      !/input|textarea/i.test(document.activeElement?.tagName || "")
    ) {
      seekSoftware(current, flat[current].software, true);
    }
  });

  switchWorkspace(activeSoftware);
  renderSidebar();
  setPlaybackVisibility();

  if (fullCodeMode) {
    fullCodeBtn.classList.add("active");
    fullCodeBtn.querySelector("span:last-child").textContent = "Full Code Open";
    stageLabel.textContent = "FULL PROJECT";
    stepTitle.textContent = "Java Practice";
  } else {
    renderCurrentStep();
  }
})();
