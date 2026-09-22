(() => {
  "use strict";

  const course = window.COURSE || { stages: [] };
  const $ = id => document.getElementById(id);

  const frame = $("ideFrame");
  const stageList = $("stageList");
  const stepTitle = $("stepTitle");
  const stageLabel = $("stageLabel");
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
      flat.push({ ...step, stageIndex, localIndex, globalIndex: flat.length });
    });
  });

  const requestedStep = Number(new URL(location.href).searchParams.get("step"));
  let current = flat.length
    ? Math.max(0, Math.min(flat.length - 1, Number.isFinite(requestedStep) && requestedStep > 0 ? requestedStep - 1 : 0))
    : 0;

  let engineReady = false;
  let fullCodeMode = new URL(location.href).searchParams.get("view") === "full";
  let openStages = new Set(flat.length ? [flat[current].stageIndex] : []);

  const fullProjectPackage =
    typeof window.buildFullProjectPackage === "function"
      ? window.buildFullProjectPackage()
      : null;

  function engineStepsThrough(index) {
    return flat.slice(0, index + 1).map(step => step.action);
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
    const numericQuery = /^\d+\.?$/.test(q) ? Number(q.replace(/\D/g, "")) : null;

    stageList.innerHTML = "";
    if (!flat.length) return;

    let global = 0;
    (course.stages || []).forEach((stage, stageIndex) => {
      const indices = (stage.steps || []).map((_, i) => global + i);
      global += (stage.steps || []).length;

      const stageTextMatch = !q || stage.title.toLowerCase().includes(q);
      const stepMatches = (stage.steps || []).some((step, i) =>
        step.title.toLowerCase().includes(q) ||
        (numericQuery !== null && indices[i] + 1 === numericQuery)
      );

      if (q && !stageTextMatch && !stepMatches) return;

      const block = document.createElement("section");
      const isCurrent = !fullCodeMode && flat[current]?.stageIndex === stageIndex;
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
        const numberMatch = numericQuery !== null && gi + 1 === numericQuery;
        const textMatch =
          step.title.toLowerCase().includes(q) ||
          stage.title.toLowerCase().includes(q);

        if (q && !numberMatch && !textMatch) return;

        const button = document.createElement("button");
        button.className =
          "step-link" +
          (!fullCodeMode && gi === current ? " active" : "") +
          (!fullCodeMode && gi < current ? " done" : "");
        button.innerHTML =
          '<span class="step-number">' + (gi + 1) + ".</span>" + step.title;
        button.onclick = () => goToStep(gi, false);
        wrap.appendChild(button);
      });

      block.appendChild(wrap);
      stageList.appendChild(block);
    });
  }

  function loadFullCode() {
    fullCodeMode = true;
    fullCodeBtn.classList.add("active");
    fullCodeBtn.querySelector("span:last-child").textContent = "Full Code Open";
    stageLabel.textContent = "FULL PROJECT";
    stepTitle.textContent = "Java Practice";
    setPlaybackVisibility();
    renderSidebar();
    updateUrlForFullCode();

    if (!engineReady || !fullProjectPackage) return;

    frame.contentWindow.postMessage({
      type: "SIM_PACKAGE",
      package: fullProjectPackage,
      theme: "dark",
      autoType: false
    }, "*");

    frame.contentWindow.postMessage({
      type: "SIM_SEEK",
      steps: [],
      animateFinal: false,
      autoType: false
    }, "*");
  }

  function sendStagePackage() {
    if (!course.package || !engineReady) return;
    frame.contentWindow.postMessage({
      type: "SIM_PACKAGE",
      package: course.package,
      theme: "dark",
      autoType: true
    }, "*");
  }

  function seek(index, animateFinal) {
    if (!engineReady || !flat.length) return;
    frame.contentWindow.postMessage({
      type: "SIM_SEEK",
      steps: engineStepsThrough(index),
      animateFinal: !!animateFinal,
      autoType: true
    }, "*");
  }

  function renderCurrentStep() {
    if (!flat.length) {
      stageLabel.textContent = fullCodeMode ? "FULL PROJECT" : "PROJECT PREVIEW";
      stepTitle.textContent = "Java Practice";
      setPlaybackVisibility();
      renderSidebar();
      return;
    }

    const step = flat[current];
    const stage = course.stages[step.stageIndex];

    openStages.add(step.stageIndex);
    stageLabel.textContent = stage.title.toUpperCase();
    stepTitle.textContent = (current + 1) + ". " + step.title;

    if (engineReady) {
      frame.contentWindow.postMessage({
        type: "SIM_EXPLAIN",
        title: step.title,
        text: step.why,
        step: current + 1,
        stage: stage.title
      }, "*");
    }

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

    if (wasFullCode) sendStagePackage();
    renderCurrentStep();
    seek(current, animateFinal);
  }

  window.addEventListener("message", event => {
    if (event.source !== frame.contentWindow) return;

    if (event.data?.type === "ENGINE_READY") {
      engineReady = true;

      if (fullCodeMode) {
        loadFullCode();
      } else if (flat.length) {
        sendStagePackage();
        setTimeout(() => {
          seek(current, false);
          renderCurrentStep();
        }, 0);
      }
    }
  });

  fullCodeBtn.onclick = loadFullCode;

  prevBtn.onclick = () => goToStep(current - 1, false);
  nextBtn.onclick = () => goToStep(current + 1, true);
  replayBtn.onclick = () => seek(current, true);

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
      seek(current, true);
    }
  });

  renderSidebar();
  setPlaybackVisibility();

  if (fullCodeMode) {
    fullCodeBtn.classList.add("active");
    fullCodeBtn.querySelector("span:last-child").textContent = "Full Code Open";
    stageLabel.textContent = "FULL PROJECT";
  } else {
    renderCurrentStep();
  }
})();
