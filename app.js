(() => {
  "use strict";
  const course = window.COURSE;
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
  const pinBtn = $("pinBtn");
  const pinCount = $("pinCount");

  const flat = [];
  course.stages.forEach((stage, stageIndex) => stage.steps.forEach((step, localIndex) => {
    flat.push({...step, stageIndex, localIndex, globalIndex: flat.length});
  }));

  let current = Math.max(0, Math.min(flat.length - 1, (Number(new URL(location.href).searchParams.get("step")) || 1) - 1));
  let engineReady = false;
  let openStages = new Set([flat[current].stageIndex]);
  let pins = new Set(JSON.parse(localStorage.getItem("devPlaybackPins") || "[]"));

  function engineStepsThrough(index) {
    return flat.slice(0, index + 1).map(s => s.action);
  }

  function sendPackage() {
    frame.contentWindow.postMessage({type:"SIM_PACKAGE", package:course.package, theme:"dark", autoType:true}, "*");
  }

  function seek(index, animateFinal) {
    if (!engineReady) return;
    frame.contentWindow.postMessage({type:"SIM_SEEK", steps:engineStepsThrough(index), animateFinal:!!animateFinal, autoType:true}, "*");
  }

  function savePins() {
    localStorage.setItem("devPlaybackPins", JSON.stringify([...pins]));
    pinCount.textContent = pins.size;
  }

  function renderSidebar() {
    const q = stepSearch.value.trim().toLowerCase();
    stageList.innerHTML = "";
    let global = 0;
    course.stages.forEach((stage, stageIndex) => {
      const indices = stage.steps.map((_,i)=>global+i);
      global += stage.steps.length;
      const matches = !q || stage.title.toLowerCase().includes(q) || stage.steps.some(s => s.title.toLowerCase().includes(q));
      if (!matches) return;

      const block = document.createElement("section");
      const isCurrent = flat[current].stageIndex === stageIndex;
      const isOpen = openStages.has(stageIndex) || !!q;
      block.className = "stage-block" + (isCurrent ? " current" : "") + (isOpen ? " open" : "");

      const head = document.createElement("button");
      head.className = "stage-head";
      head.innerHTML = '<span>'+stage.title+'</span><span class="stage-count">'+stage.steps.length+' steps</span><span class="stage-chevron">'+(isOpen?'⌃':'⌄')+'</span>';
      head.onclick = () => { if (openStages.has(stageIndex)) openStages.delete(stageIndex); else openStages.add(stageIndex); renderSidebar(); };
      block.appendChild(head);

      const wrap = document.createElement("div");
      wrap.className = "steps-wrap";
      stage.steps.forEach((step, localIndex) => {
        const gi = indices[localIndex];
        if (q && !step.title.toLowerCase().includes(q) && !stage.title.toLowerCase().includes(q)) return;
        const b = document.createElement("button");
        b.className = "step-link" + (gi === current ? " active" : "") + (gi < current ? " done" : "");
        b.innerHTML = '<span class="step-number">'+(gi+1)+'.</span>'+step.title;
        b.onclick = () => go(gi, false);
        wrap.appendChild(b);
      });
      block.appendChild(wrap);
      stageList.appendChild(block);
    });
  }

  function renderCurrent() {
    const step = flat[current];
    const stage = course.stages[step.stageIndex];
    openStages.add(step.stageIndex);
    stageLabel.textContent = stage.title.toUpperCase();
    stepTitle.textContent = (current + 1) + ". " + step.title;
    if (engineReady) {
      frame.contentWindow.postMessage({
        type:"SIM_EXPLAIN",
        title:step.title,
        text:step.why,
        step:current + 1,
        stage:stage.title
      }, "*");
    }
    stepCounter.textContent = (current + 1) + " / " + flat.length;
    stepProgress.style.width = (((current + 1) / flat.length) * 100) + "%";
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === flat.length - 1;
    pinBtn.classList.toggle("active", pins.has(current));
    pinCount.textContent = pins.size;
    renderSidebar();
    const url = new URL(location.href); url.searchParams.set("step", current + 1); history.replaceState({}, "", url);
  }

  function go(index, animateFinal) {
    current = Math.max(0, Math.min(flat.length - 1, index));
    renderCurrent();
    seek(current, animateFinal);
  }

  window.addEventListener("message", e => {
    if (e.source !== frame.contentWindow) return;
    if (e.data?.type === "ENGINE_READY") {
      engineReady = true;
      sendPackage();
      setTimeout(() => {
        seek(current, false);
        const step = flat[current];
        frame.contentWindow.postMessage({
          type:"SIM_EXPLAIN",
          title:step.title,
          text:step.why,
          step:current + 1,
          stage:course.stages[step.stageIndex].title
        }, "*");
      }, 0);
    }
  });

  prevBtn.onclick = () => go(current - 1, false);
  nextBtn.onclick = () => go(current + 1, true);
  replayBtn.onclick = () => seek(current, true);
  stepSearch.oninput = renderSidebar;
  toggleSidebar.onclick = () => {
    document.body.classList.toggle("sidebar-hidden");
    toggleSidebar.textContent = document.body.classList.contains("sidebar-hidden") ? "Show progress" : "Hide progress";
  };
  ideFullscreen.onclick = async () => {
    try { if (!document.fullscreenElement) await frame.requestFullscreen(); else await document.exitFullscreen(); } catch (_) {}
  };
  pinBtn.onclick = () => { if (pins.has(current)) pins.delete(current); else pins.add(current); savePins(); renderCurrent(); };
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" && current < flat.length - 1) go(current + 1, true);
    if (e.key === "ArrowLeft" && current > 0) go(current - 1, false);
    if (e.key.toLowerCase() === "r" && !/input|textarea/i.test(document.activeElement?.tagName || "")) seek(current, true);
  });

  savePins();
  renderCurrent();
})();
