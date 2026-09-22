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
    ssms: $("ssmsFrame")
  };

  const appIds = {
    intellij: "intellij_idea",
    vscode: "vscode",
    pgadmin: "pgadmin",
    postman: "postman",
    cmd: "cmd",
    linux: "linux",
    ssms: "sql_server_management_studio"
  };

  const appLabels = {
    intellij: "IntelliJ IDEA",
    vscode: "VS Code",
    pgadmin: "pgAdmin 4",
    postman: "Postman",
    cmd: "Command Prompt",
    linux: "Linux",
    ssms: "SQL Server Management Studio"
  };

  const engineReady = {
    intellij: false,
    vscode: false,
    pgadmin: false,
    postman: false,
    cmd: false,
    linux: false,
    ssms: false
  };

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

  let pointerSequence = 0;
  const pendingPointer = new Map();

  function pointerTextFromPath(value) {
    if (!value) return "";
    const clean = String(value).replace(/\\/g, "/");
    return clean.split("/").pop().split(":").pop();
  }

  function pointerPlanForStep(step) {
    if (!step?.action) return null;
    const software = normalizeSoftware(step.software);
    const action = step.action.action;
    const d = step.action.data || {};
    const click = (selectors, extra = {}) => ({ selectors, gesture: "click", duration: 500, ...extra });
    const typing = (selectors, extra = {}) => ({ selectors, gesture: "typing", duration: 480, hideAfter: 0, ...extra });

    if (software === "intellij") {
      if (action === "newProject") return click(["#newBtn", "#projectTitle"]);
      if (action === "createPackage" || action === "createFile") return click(["#newBtn", "#tree"]);
      if (action === "openFile") return click(["#tree"], { text: pointerTextFromPath(d.file || d.path), scope: "#tree" });
      if (action === "typeCode") return typing(["#editorWrap", "#code"]);
      if (action === "showFileStructure") return click(["#rightPanel", "#editorPane"]);
    }

    if (software === "vscode") {
      if (action === "openFile") return click(["#tree"], { text: pointerTextFromPath(d.file || d.path), scope: "#tree" });
      if (action === "createFile") return click(["#newFileBtn", "#tree"]);
      if (action === "typeCode") return typing(["#codeViewport", "#codeTable"]);
      if (action === "terminalCommand" || action === "runTerminal") return typing(["#terminal"]);
    }

    if (software === "pgadmin") {
      if (action === "setStatus") return click(["#status"]);
      if (action === "selectTree") return click(["#tree"], { text: pointerTextFromPath(d.path), scope: "#tree" });
      if (action === "openQueryTool") return click(["#newQuery"]);
      if (action === "typeSql") return typing(["#sqlwrap", "#sql"]);
      if (action === "executeQuery") return click(["#run"]);
    }

    if (software === "postman") {
      if (action === "openRequest") return click(["#collections"]);
      if (action === "setEnvironment") return click(["#envName"]);
      if (action === "setMethod") return click(["#methodBox"]);
      if (action === "typeUrl") return typing(["#urlBox"]);
      if (action === "setHeaders") return click(["#reqTabs"], { text: "Headers", scope: "#reqTabs" });
      if (action === "sendRequest") return click(["#sendBtn"]);
      if (action === "selectResponseTab") return click(["#respTabs"]);
    }

    if (software === "cmd") {
      if (action === "setCwd") return click(["#cwdStatus", "#terminal"]);
      if (action === "executeCommand" || action === "typeCommand") return typing(["#terminal", "#terminalWrap"]);
    }

    if (software === "linux") {
      if (action === "setCwd") return click(["#cwdStatus", "#terminalWin"]);
      if (action === "executeCommand") return typing(["#terminal", "#terminalWin"]);
      if (action === "stopProcess") return click(["#terminalWin"]);
    }

    if (software === "ssms") {
      if (action === "openConnectDialog") return click(['[data-target="connect"]', "#toolbar"]);
      if (action === "setConnectionField") {
        if (d.field === "authentication") return click(["#modal select", "#modal"]);
        return typing(["#modal input", "#modal"]);
      }
      if (action === "connectServer") return click(["#modal button", "#modal"], { text: "Connect", scope: "#modal" });
      if (action === "expandNode") return click(["#objectTree"], { text: pointerTextFromPath(d.id), scope: "#objectTree" });
      if (action === "changeDatabase") return click(["#dbSelect"]);
      if (action === "newQuery") return click(['[data-target="newQuery"]', "#toolbar"]);
      if (action === "typeSql") return typing(["#editorArea", "#queryGroups"]);
      if (action === "executeQuery") return click(['[data-target="execute"]', "#toolbar"]);
      if (action === "refreshObjectExplorer") return click(['[data-target="refreshObjectExplorer"]', "#objectTree"]);
      if (action === "showActualExecutionPlan") return click(['[data-resulttab="plan"]', "#resultsPane"]);
      if (action === "showClientStatistics") return click(['[data-resulttab="stats"]', "#resultsPane"]);
      if (action === "saveQuery") return click(['[data-target="save"]', "#toolbar"]);
      if (action === "openActivityMonitor") return click(["#objectTree"], { text: "Activity Monitor", scope: "#objectTree" });
      if (["createIndex","showObjectExplorerDetails","backupDatabase","createAgentJob","createAgentSchedule","runAgentJob","showAgentJobHistory"].includes(action)) {
        return click(["#objectTree", "#resultsPane"]);
      }
    }

    return click(["button:not([disabled])", "input", "select", "main", "body"], { anchor: "center" });
  }

  function sendSeekNow(index, target, animateFinal) {
    frames[target].contentWindow.postMessage({
      type: "SIM_SEEK",
      steps: stepsThrough(index, target),
      animateFinal: !!animateFinal,
      autoType: true
    }, "*");
  }

  function seekSoftware(index, software, animateFinal, pointerPlayback = false) {
    const target = normalizeSoftware(software);
    if (!engineReady[target] || !flat.length) return;

    if (!pointerPlayback) {
      sendSeekNow(index, target, animateFinal);
      return;
    }

    const step = flat[index];
    const plan = pointerPlanForStep(step);
    if (!plan) {
      sendSeekNow(index, target, animateFinal);
      return;
    }

    // Rebuild only through the previous step first. This guarantees the
    // pointer target exists before the visible final action is performed.
    frames[target].contentWindow.postMessage({ type: "SIM_POINTER_HIDE" }, "*");
    frames[target].contentWindow.postMessage({
      type: "SIM_SEEK",
      steps: stepsThrough(index - 1, target),
      animateFinal: false,
      autoType: false
    }, "*");

    const requestId = "pointer-" + (++pointerSequence);
    const fallback = setTimeout(() => {
      const pending = pendingPointer.get(target);
      if (!pending || pending.id !== requestId) return;
      pendingPointer.delete(target);
      sendSeekNow(index, target, animateFinal);
    }, 1600);

    pendingPointer.set(target, { id: requestId, index, animateFinal, fallback });

    setTimeout(() => {
      frames[target].contentWindow.postMessage({
        type: "SIM_POINTER",
        id: requestId,
        plan
      }, "*");
    }, 70);
  }

  function explainCurrentStep() {
    if (!flat.length || fullCodeMode) return;
    const step = flat[current];
    const target = normalizeSoftware(step.software);

    if (!engineReady[target]) return;

    frames[target].contentWindow.postMessage({
      type: "SIM_EXPLAIN",
      title: step.title,
      text: step.why,
      step: current + 1,
      stage: course.stages[step.stageIndex].title,
      language: "Telugu (Romanized)"
    }, "*");
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

        button.onclick = () => goToStep(gi, false);
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
    explainCurrentStep();
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
    seekSoftware(current, software, animateFinal, true);
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

    if (event.data?.type === "SIM_POINTER_DONE") {
      const pending = pendingPointer.get(software);
      if (!pending || pending.id !== event.data.id) return;
      clearTimeout(pending.fallback);
      pendingPointer.delete(software);
      sendSeekNow(pending.index, software, pending.animateFinal);
      return;
    }

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
      }, 0);
    }
  });

  fullCodeBtn.onclick = loadFullCode;

  prevBtn.onclick = () => goToStep(current - 1, false);
  nextBtn.onclick = () => goToStep(current + 1, true);
  replayBtn.onclick = () => {
    if (!flat.length || fullCodeMode) return;
    seekSoftware(current, flat[current].software, true, true);
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
