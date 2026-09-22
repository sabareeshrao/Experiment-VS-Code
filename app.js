(() => {
  const lessons = window.LESSONS;
  const byId = id => document.getElementById(id);

  let current = 0;
  let activeFile = "";
  let animationToken = 0;

  const lessonList = byId("lessonList");
  const lessonTitle = byId("lessonTitle");
  const lessonNumber = byId("lessonNumber");
  const progressText = byId("progressText");
  const progressBar = byId("progressBar");
  const fileTree = byId("fileTree");
  const tabs = byId("tabs");
  const breadcrumb = byId("breadcrumb");
  const editor = byId("editor");
  const gutter = byId("gutter");
  const terminal = byId("terminal");
  const explanation = byId("explanation");
  const previousBtn = byId("previousBtn");
  const nextBtn = byId("nextBtn");
  const replayBtn = byId("replayBtn");
  const focusBtn = byId("focusBtn");
  const fullscreenBtn = byId("fullscreenBtn");
  const vscode = byId("vscode");
  const statusFile = byId("statusFile");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function syntaxJava(code) {
    let out = escapeHtml(code);
    out = out.replace(/(".*?")/g, '<span class="str">$1</span>');
    out = out.replace(/\b(package|import|public|private|protected|class|static|final|void|long|new|return|for|if|else)\b/g, '<span class="kw">$1</span>');
    out = out.replace(/\b(String|System|List|Task|TaskService|TaskController|TaskApiApplication)\b/g, '<span class="type">$1</span>');
    return out;
  }

  function renderLessonList() {
    lessonList.innerHTML = "";
    lessons.forEach((lesson, index) => {
      const button = document.createElement("button");
      button.className = "lesson-item" + (index === current ? " active" : "");
      button.innerHTML =
        '<span class="lesson-index">' + (index + 1) + '</span>' +
        '<span><span class="lesson-name">' + lesson.title + '</span>' +
        '<span class="lesson-sub">' + lesson.summary + '</span></span>';
      button.addEventListener("click", () => goToLesson(index, false));
      lessonList.appendChild(button);
    });
  }

  function treeFromPaths(paths) {
    const root = {};
    paths.forEach(path => {
      let node = root;
      const parts = path.split("/");
      parts.forEach((part, index) => {
        if (!node[part]) node[part] = { children: {}, file: index === parts.length - 1 };
        if (index < parts.length - 1) node = node[part].children;
      });
    });
    return root;
  }

  function renderTreeNode(node, depth, parent) {
    const names = Object.keys(node).sort((a, b) => {
      if (node[a].file !== node[b].file) return node[a].file ? 1 : -1;
      return a.localeCompare(b);
    });

    names.forEach(name => {
      const info = node[name];
      const full = parent ? parent + "/" + name : name;
      const row = document.createElement("div");
      row.className = "tree-row " + (info.file ? "file" : "folder") + (full === activeFile ? " active" : "");
      row.style.paddingLeft = (9 + depth * 12) + "px";
      row.innerHTML = '<span class="tree-icon">' + (info.file ? "J" : "▾") + '</span>' + name;

      if (info.file) {
        row.addEventListener("click", () => {
          activeFile = full;
          renderWorkspace(false);
        });
      }

      fileTree.appendChild(row);
      if (!info.file) renderTreeNode(info.children, depth + 1, full);
    });
  }

  function renderFileTree(files) {
    fileTree.innerHTML = "";
    renderTreeNode(treeFromPaths(Object.keys(files)), 0, "");
  }

  function renderTabs() {
    tabs.innerHTML = "";
    if (!activeFile) return;
    const tab = document.createElement("div");
    tab.className = "tab active";
    tab.textContent = activeFile.split("/").pop();
    tabs.appendChild(tab);
    breadcrumb.textContent = activeFile.split("/").join("  ›  ");
  }

  function renderCode(content) {
    const lines = content.split("\n");
    gutter.innerHTML = lines.map((_, i) => "<span>" + (i + 1) + "</span>").join("");
    editor.innerHTML = syntaxJava(content);
    statusFile.textContent = activeFile.endsWith(".java") ? "Java" : "Plain Text";
  }

  async function typeCode(content, token) {
    editor.textContent = "";
    const lines = content.split("\n");
    gutter.innerHTML = lines.map((_, i) => "<span>" + (i + 1) + "</span>").join("");
    let shown = "";

    for (let i = 0; i < content.length; i++) {
      if (token !== animationToken) return;
      shown += content[i];
      editor.innerHTML = syntaxJava(shown);
      editor.scrollTop = editor.scrollHeight;
      if (i % 3 === 0) await new Promise(resolve => setTimeout(resolve, 8));
    }
  }

  function showExplanation(text) {
    explanation.innerHTML = "<strong>💡 CONCEPT EXPLAINED</strong>" + text;
  }

  function renderWorkspace(animate) {
    const lesson = lessons[current];
    if (!lesson.files[activeFile]) activeFile = lesson.activeFile;

    renderFileTree(lesson.files);
    renderTabs();
    terminal.textContent = lesson.terminal;
    showExplanation(lesson.explanation);

    animationToken += 1;
    const token = animationToken;
    const content = lesson.files[activeFile];

    if (animate && activeFile === lesson.activeFile) typeCode(content, token);
    else renderCode(content);
  }

  function updateUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("lesson", String(current + 1));
    window.history.replaceState({}, "", url);
  }

  function goToLesson(index, animate) {
    current = Math.max(0, Math.min(lessons.length - 1, index));
    const lesson = lessons[current];
    activeFile = lesson.activeFile;

    lessonTitle.textContent = "Lesson " + lesson.id + ": " + lesson.title;
    lessonNumber.textContent = lesson.id;
    progressText.textContent = lesson.id + " / " + lessons.length;
    progressBar.style.width = ((lesson.id / lessons.length) * 100) + "%";

    previousBtn.disabled = current === 0;
    nextBtn.disabled = current === lessons.length - 1;

    renderLessonList();
    renderWorkspace(animate);
    updateUrl();
  }

  previousBtn.addEventListener("click", () => goToLesson(current - 1, false));
  nextBtn.addEventListener("click", () => goToLesson(current + 1, true));
  replayBtn.addEventListener("click", () => renderWorkspace(true));

  focusBtn.addEventListener("click", () => {
    document.body.classList.toggle("focus");
    focusBtn.textContent = document.body.classList.contains("focus") ? "Exit focus" : "Focus mode";
  });

  fullscreenBtn.addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await vscode.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      console.warn("Fullscreen request failed", error);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" && current < lessons.length - 1) goToLesson(current + 1, true);
    if (event.key === "ArrowLeft" && current > 0) goToLesson(current - 1, false);
    if (event.key.toLowerCase() === "r") renderWorkspace(true);
    if (event.key === "Escape" && document.body.classList.contains("focus")) {
      document.body.classList.remove("focus");
      focusBtn.textContent = "Focus mode";
    }
  });

  const requested = Number(new URL(window.location.href).searchParams.get("lesson"));
  const initial = Number.isFinite(requested) && requested >= 1 && requested <= lessons.length ? requested - 1 : 0;
  goToLesson(initial, true);
})();
