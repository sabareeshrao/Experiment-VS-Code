(() => {
  "use strict";

  const course = window.COURSE || { stages: [] };
  const SIM_TARGET_ORIGIN = location.origin === "null" ? "*" : location.origin;
  const $ = id => document.getElementById(id);

  const frames = {
    intellij: $("ideFrame"),
    eclipse: $("eclipseFrame"),
    vscode: $("vscodeFrame"),
    pgadmin: $("pgadminFrame"),
    postman: $("postmanFrame"),
    cmd: $("cmdFrame"),
    powershell: $("powershellFrame"),
    linux: $("linuxFrame"),
    ssms: $("ssmsFrame"),
    jira: $("jiraFrame"),
    jenkins: $("jenkinsFrame"),
    powerbi: $("powerbiFrame"),
    git: $("gitFrame"),
    github: $("githubFrame"),
    github_actions: $("githubActionsFrame"),
    mysqlworkbench: $("mysqlWorkbenchFrame"),
    redis: $("redisFrame"),
    spring_initializer: $("springInitializerFrame"),
    maven_central: $("mavenCentralFrame"),
    kubernetes: $("kubernetesFrame")
  };

  const appIds = {
    intellij: "intellij_idea",
    eclipse: "eclipse",
    vscode: "vscode",
    pgadmin: "pgadmin",
    postman: "postman",
    cmd: "cmd",
    powershell: "powershell",
    linux: "linux",
    ssms: "sql_server_management_studio",
    jira: "jira",
    jenkins: "jenkins",
    powerbi: "power_bi",
    git: "git",
    github: "github",
    github_actions: "github_actions",
    mysqlworkbench: "mysql_workbench",
    redis: "redis",
    spring_initializer: "spring_initializer",
    maven_central: "maven_central",
    kubernetes: "kubernetes"
  };

  const appLabels = {
    intellij: "IntelliJ IDEA",
    eclipse: "Eclipse IDE",
    vscode: "VS Code",
    pgadmin: "pgAdmin 4",
    postman: "Postman",
    cmd: "Command Prompt",
    powershell: "Windows PowerShell",
    linux: "Linux",
    ssms: "SQL Server Management Studio",
    jira: "Jira",
    jenkins: "Jenkins",
    powerbi: "Power BI Desktop",
    git: "Git",
    github: "GitHub",
    github_actions: "GitHub Actions",
    mysqlworkbench: "MySQL Workbench",
    redis: "Redis Insight",
    spring_initializer: "Spring Initializr",
    maven_central: "Maven Central",
    kubernetes: "Kubernetes / Headlamp"
  };

  const engineReady = {
    intellij: false,
    eclipse: false,
    vscode: false,
    pgadmin: false,
    postman: false,
    cmd: false,
    powershell: false,
    linux: false,
    ssms: false,
    jira: false,
    jenkins: false,
    powerbi: false,
    git: false,
    github: false,
    github_actions: false,
    mysqlworkbench: false,
    redis: false,
    spring_initializer: false,
    maven_central: false,
    kubernetes: false
  };

  const SIM_BOOT_TOKEN =
    window.__PLAYBACK_BOOT_TOKEN__ ||
    (Date.now().toString(36) + Math.random().toString(36).slice(2, 7));

  function ensureFrameLoaded(name) {
    const target = normalizeSoftware(name);
    const frame = frames[target];
    if (!frame) return false;
    if (frame.dataset.simLoaded === "1" || frame.dataset.simLoading === "1") return true;

    const raw = frame.dataset.src || frame.getAttribute("src");
    if (!raw) return false;

    engineReady[target] = false;
    frame.dataset.simLoading = "1";

    const url = new URL(raw, location.href);
    url.searchParams.set("boot", SIM_BOOT_TOKEN);
    frame.src = url.href;
    return true;
  }


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
        script.async = false;
        script.src = new URL(src, location.href).href;
        script.dataset[flag] = "1";
        doc.body.appendChild(script);
      };

      // Universal rules for every current and future simulator.
      ensureScript(
        "/simulator/shared/explanation-controls.js?v=26",
        "simulator/shared/explanation-controls.js?v=26",
        "globalExplanationRuntime"
      );
      ensureScript(
        "/simulator/shared/highlighter.js",
        "simulator/shared/highlighter.js?v=9",
        "globalHighlightRuntime"
      );
      ensureScript(
        "/simulator/shared/boot-protocol.js",
        "simulator/shared/boot-protocol.js?v=1",
        "globalBootProtocol"
      );
      ensureScript(
        "/simulator/shared/layout-resize.js",
        "simulator/shared/layout-resize.js?v=6",
        "globalUiPersistence"
      );
    } catch (_) {}
  }

  // Every simulator iframe, including software added later, automatically gets
  // universal explanation dragging, UI persistence and focus-follow scrolling.
  // A simulator may finish loading before this parent script installs its message
  // listener, so frame-load probing also recovers a missed ENGINE_READY handshake.
  function hydrateReadyFrame(name) {
    if (!frames[name]?.contentWindow) return;

    // Loading the baseline before seeking is essential: SIM_SEEK replays lesson
    // actions from that baseline. This helper is deliberately safe to call after
    // either ENGINE_READY or an iframe load-complete fallback.
    engineReady[name] = true;
    sendCoursePackage(name);

    if (fullCodeMode && name === "intellij") {
      loadFullCode();
      return;
    }

    if (
      !fullCodeMode &&
      flat.length &&
      normalizeSoftware(flat[current].software) === name
    ) {
      setTimeout(() => {
        // Do not depend on a second readiness handshake here. The document has
        // already finished loading, so replay the cumulative state immediately.
        sendSeekNow(current, name, false);
        if (name !== "kubernetes") highlightCurrentAction(current, name);
        if (name !== "kubernetes") scheduleCurrentExplanation(140);
        if (name === "mysqlworkbench") {
          setTimeout(() => {
            if (!fullCodeMode && flat.length && normalizeSoftware(flat[current]?.software) === name) {
              highlightCurrentAction(current, name);
              scheduleCurrentExplanation(20);
            }
          }, 320);
        }
      }, 0);
    }
  }

  function recoverFrameHandshake(name, frame) {
    if (!frame || frame.dataset.simLoaded !== "1") return;
    const attempt = () => {
      try {
        ensureGlobalSimulatorRuntime(frame);
        const child = frame.contentWindow;
        const doc = frame.contentDocument;
        if (!child) return false;

        // New/adaptive engines expose SimEngine. Legacy engines may only emit a
        // one-shot ENGINE_READY. If that message races ahead of the parent
        // listener, a fully loaded same-origin iframe is still safe to hydrate.
        if (
          child.SimEngine ||
          doc?.readyState === "complete" ||
          doc?.readyState === "interactive"
        ) {
          if (!engineReady[name]) hydrateReadyFrame(name);
          return true;
        }

        // Engines implementing the optional recovery ping can announce readiness.
        child.postMessage({ type: "SIM_PING" }, SIM_TARGET_ORIGIN);
      } catch (_) {}
      return false;
    };

    attempt();
    [30, 90, 220, 500, 1000, 2200].forEach(delay => setTimeout(() => {
      if (!engineReady[name]) attempt();
    }, delay));
  }

  Object.entries(frames).forEach(([name, frame]) => {
    if (!frame) return;
    frame.addEventListener("load", () => {
      // Lazy iframes begin life as about:blank. Only hydrate the real simulator.
      if (frame.dataset.simLoading !== "1" && frame.dataset.simLoaded !== "1") return;
      try {
        if (frame.contentWindow?.location?.href === "about:blank") return;
      } catch (_) {}
      frame.dataset.simLoading = "0";
      frame.dataset.simLoaded = "1";
      recoverFrameHandshake(name, frame);
    });
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

  const requestedUrl = new URL(location.href);
  const requestedStep = Number(requestedUrl.searchParams.get("step"));
  let current = flat.length
    ? Math.max(0, Math.min(flat.length - 1, Number.isFinite(requestedStep) && requestedStep > 0 ? requestedStep - 1 : 0))
    : 0;

  let fullCodeMode = requestedUrl.searchParams.get("view") === "full";
  let activeSoftware = fullCodeMode ? "intellij" : (flat[current]?.software || "intellij");
  let openStages = new Set(flat.length ? [flat[current].stageIndex] : []);

  const fullProjectPackage =
    typeof window.buildFullProjectPackage === "function"
      ? window.buildFullProjectPackage()
      : null;

  function normalizeSoftware(value) {
    if (value === "eclipse") return "eclipse";
    if (value === "powershell" || value === "power_shell" || value === "pwsh") return "powershell";
    if (value === "pgadmin") return "pgadmin";
    if (value === "vscode") return "vscode";
    if (value === "postman") return "postman";
    if (value === "cmd") return "cmd";
    if (value === "linux") return "linux";
    if (value === "ssms") return "ssms";
    if (value === "jira") return "jira";
    if (value === "jenkins") return "jenkins";
    if (value === "powerbi") return "powerbi";
    if (value === "git") return "git";
    if (value === "github") return "github";
    if (value === "github_actions" || value === "github-actions" || value === "githubactions") return "github_actions";
    if (value === "mysqlworkbench" || value === "mysql_workbench" || value === "mysql-workbench" || value === "mysql") return "mysqlworkbench";
    if (value === "redis" || value === "redisinsight" || value === "redis_insight" || value === "redis-insight") return "redis";
    if (value === "spring_initializer" || value === "spring-initializer" || value === "springinitializr" || value === "initializr") return "spring_initializer";
    if (value === "maven_central" || value === "maven-central" || value === "mavencentral" || value === "maven_repository") return "maven_central";
    if (value === "kubernetes" || value === "k8s" || value === "headlamp" || value === "kubectl") return "kubernetes";
    return "intellij";
  }

  function switchWorkspace(software) {
    activeSoftware = normalizeSoftware(software);
    ensureFrameLoaded(activeSoftware);

    Object.entries(frames).forEach(([name, frame]) => {
      if (!frame) return;
      frame.classList.toggle("active", name === activeSoftware);
      frame.setAttribute("aria-hidden", name === activeSoftware ? "false" : "true");
    });

    softwareBadge.textContent = appLabels[activeSoftware];
    softwareBadge.classList.toggle("eclipse", activeSoftware === "eclipse");
    softwareBadge.classList.toggle("powershell", activeSoftware === "powershell");
    softwareBadge.classList.toggle("pgadmin", activeSoftware === "pgadmin");
    softwareBadge.classList.toggle("vscode", activeSoftware === "vscode");
    softwareBadge.classList.toggle("postman", activeSoftware === "postman");
    softwareBadge.classList.toggle("cmd", activeSoftware === "cmd");
    softwareBadge.classList.toggle("linux", activeSoftware === "linux");
    softwareBadge.classList.toggle("ssms", activeSoftware === "ssms");
    softwareBadge.classList.toggle("jira", activeSoftware === "jira");
    softwareBadge.classList.toggle("jenkins", activeSoftware === "jenkins");
    softwareBadge.classList.toggle("powerbi", activeSoftware === "powerbi");
    softwareBadge.classList.toggle("git", activeSoftware === "git");
    softwareBadge.classList.toggle("github", activeSoftware === "github");
    softwareBadge.classList.toggle("github-actions", activeSoftware === "github_actions");
    softwareBadge.classList.toggle("mysqlworkbench", activeSoftware === "mysqlworkbench");
    softwareBadge.classList.toggle("redis", activeSoftware === "redis");
    softwareBadge.classList.toggle("spring-initializer", activeSoftware === "spring_initializer");
    softwareBadge.classList.toggle("maven-central", activeSoftware === "maven_central");
    softwareBadge.classList.toggle("kubernetes", activeSoftware === "kubernetes");
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
      theme: target === "kubernetes" ? "light" : "dark",
      autoType: true
    }, SIM_TARGET_ORIGIN);
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
    if (software === "eclipse") {
      if (action === "openProject" || action === "createPackage" || action === "createJavaFile") return plan(["#newBtn"]);
      if (action === "openFile") return plan(["#projectTree"]);
      if (action === "runApplication") return plan(["#runBtn"]);
      if (action === "showConsole" || action === "showBytecode") return plan(["#consoleTab"]);
      if (action === "showProblems" || action === "showDialog") return plan(["#problemsTab"]);
    }
    if (software === "powershell") {
      if (action === "runCommand") return plan(["#commandInput"]);
      if (action === "clearTerminal") return plan(["#clearBtn"]);
      if (action === "showExitCode") return plan(["#exitBadge"]);
    }
    if (software === "intellij") {
      if (action === "newProject" || action === "openNewMavenProjectWizard" || action === "createMavenProject" || action === "createPackage" || action === "createFile") return plan(["#newBtn"]);
      if (action === "runJavaMain" || action === "runConfiguration") return plan(["#runBtn"]);
      if (action === "restartApplication" || action === "restartSpringBootApp") return plan(["#restartBtn"]);
      if (action === "clearRunConsole") return plan(["#clearConsoleBtn"]);
      if (action === "openIntegratedTerminal" || action === "openTerminal") return plan(["#terminalBtn"]);
      if (action === "showExternalLibraries") return plan(['[data-external-libraries="1"]']);
    }
    if (software === "vscode") {
      if (action === "createFile") return plan(["#newFileBtn"]);
    }
    if (software === "pgadmin") {
      if (action === "openQueryTool") return plan(["#newQuery"]);
      if (action === "executeQuery") return plan(["#run"]);
      if (action === "refreshTree") return plan(["#pgRefresh"]);
      if (action === "showResultTab") return plan([`[data-result-tab="${step.action.data?.tab || "data"}"]`]);
      if (action === "showExplain") return plan(['[data-result-tab="explain"]']);
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
    if (software === "powerbi") {
      if (action === "openGetData") return plan(['[data-target="getData"]']);
      if (action === "openPowerQuery") return plan(["#powerQuery"]);
      if (action === "openModelView") return plan(["#modelViewBtn"]);
      if (action === "openDaxQueryView") return plan(["#daxViewBtn"]);
      if (action === "runDaxQuery") return plan(["#runDaxBtn"]);
      if (action === "openTmdlView") return plan(["#tmdlViewBtn"]);
      if (action === "scriptTmdlObject") return plan(["#scriptTmdlBtn"]);
      if (action === "openReportView") return plan(["#reportViewBtn"]);
      if (action === "selectPage") return plan([`[data-page-id="${step.action.data?.id || step.action.data?.page || ""}"]`, ".pageTab"]);
      if (action === "selectVisual") return plan([`[data-visual-id="${step.action.data?.id || ""}"]`, "#reportCanvas"]);
      if (action === "openOnObjectBuild") return plan(["#onObjectMenu"]);
      if (action === "openFormatPane" || action === "openAnalyticsPane") return plan(["#visualizationsPane"]);
      if (action === "openSelectionPane" || action === "openBookmarksPane" || action === "openManageRelationships") return plan(["#modalShade .modal"]);
      if (action === "openPerformanceAnalyzer") return plan(["#visualizationsPane", ".sidePanes"]);
    }
    if (software === "git") {
      if (action === "stageFile" || action === "unstageFile") return plan(["#mainView"]);
      if (action === "commit" || action === "setCommitMessage") return plan(["#detailsBody"]);
      if (action === "push") return plan(["#pushBtn"]);
      if (action === "pull") return plan(["#pullBtn"]);
      if (action === "fetch") return plan(["#fetchBtn"]);
    }
    if (software === "github") {
      if (action === "openFile") return plan(["#content"]);
      if (action === "createIssue" || action === "openIssue") return plan(["#content"]);
      if (action === "createPullRequest" || action === "openPullRequest") return plan(["#content"]);
      if (action === "showClone") return plan(["#content"]);
    }
    if (software === "github_actions") {
      if (action === "openNewWorkflow" || action === "openWorkflowFile") return plan(["#content"]);
      if (action === "triggerRun" || action === "openRun") return plan(["#content"]);
      if (action === "openSecrets" || action === "openCaches" || action === "openRunners") return plan(["#content"]);
    }
    if (software === "redis") {
      if (action === "setView") return plan([`[data-view="${step.action.data?.view || "browser"}"]`]);
      if (action === "selectKey") return plan([`[data-key="${String(step.action.data?.key || step.action.data?.name || "").replace(/"/g, '\\"')}"]`, "#keyList"]);
      if (action === "searchKeys") return plan(["#keySearch"]);
      if (action === "filterKeyType") return plan(["#typeFilter"]);
      if (action === "createKey") return plan(["#addKeyBtn"]);
      if (action === "deleteKey") return plan(["#deleteKeyBtn"]);
      if (action === "editKey" || action === "setKeyValue" || action === "setHashField" || action === "pushListItem" || action === "addSetMember" || action === "addSortedSetMember") return plan(["#editKeyBtn"]);
      if (action === "setWorkbenchQuery") return plan(["#wbEditor"]);
      if (action === "runWorkbench") return plan(["#runWb"]);
      if (action === "openCli") return plan(["#cliToggle"]);
      if (action === "runCliCommand") return plan(["#cliInput"]);
      if (action === "clearCli") return plan(["#clearCli"]);
      if (action === "openSearchIndex") return plan(['[data-view="search"]']);
      if (action === "runSearchQuery") return plan(["#runSearch"]);
      if (action === "showExplain") return plan(["#explainSearch"]);
      if (action === "showProfile") return plan(["#profileSearch"]);
      if (action === "openAnalysisTab") return plan([`[data-atab="${step.action.data?.tab || "memory"}"]`, '[data-view="analysis"]']);
      if (action === "startProfiler" || action === "stopProfiler") return plan(["#profilerBtn"]);
      if (action === "subscribeChannel") return plan(["#subscribeBtn"]);
      if (action === "publishMessage") return plan(["#publishBtn"]);
      if (action === "openSettings") return plan(["#settingsBtn"]);
      if (action === "openDatabaseDialog") return plan(["#dbSwitcher"]);
    }
    if (software === "kubernetes") {
      if (action === "selectCluster") return plan(["#clusterSelect"]);
      if (action === "selectNamespace") return plan(["#namespaceSelect"]);
      if (action === "openOverview") return plan(['[data-nav="overview"]']);
      if (action === "openResourceList") return plan([`[data-nav="${step.action.data?.kind || "pods"}"]`]);
      if (action === "selectResource") return plan([`[data-row="${step.action.data?.name || ""}"]`, ".pageHead h1"]);
      if (action === "openResourceTab") return plan([`[data-tab="${step.action.data?.tab || "Overview"}"]`]);
      if (action === "openLogs") return plan(['[data-tab="Logs"]', ".logToolbar"]);
      if (action === "openExec") return plan(['[data-tab="Exec"]', "#execInput"]);
      if (action === "openTerminal") return plan(["#terminalToggle"]);
      if (action === "runKubectl" || action === "clearTerminal") return plan(["#termInput"]);
      if (action === "openYaml" || action === "editYaml" || action === "applyYaml") return plan(['[data-tab="YAML"]', "#yamlView"]);
      if (action === "scaleDeployment") return plan(["[data-scale]", ".pageHead h1"]);
      if (action === "restartDeployment") return plan(["[data-restart]", ".pageHead h1"]);
      if (action === "openMapView") return plan(['[data-nav="map"]']);
      if (action === "openProjects" || action === "openProject") return plan(['[data-nav="projects"]', ".projectGrid"]);
      if (action === "openMetrics") return plan(['[data-nav="metrics"]']);
      if (action === "openEvents" || action === "filterEvents") return plan(['[data-nav="events"]', "#eventFilter"]);
      if (action === "openSettings" || action === "openPlugins") return plan(['[data-nav="settings"]']);
      if (action === "searchResources") return plan(["#globalSearch"]);
      if (action === "toggleTheme") return plan(["#themeToggle"]);
      if (action === "openCommandPalette") return plan(["#modalShade .modalHead"]);
    }
    if (software === "mysqlworkbench") {
      if (action === "showHome") return plan(["#homeOverlay"]);
      if (action === "openConnectionDialog" || action === "openConnectionParameters" || action === "openConnectionSsl" || action === "openConnectionAdvanced") return plan(["#btnManageConnections"]);
      if (action === "connect") return plan(["#connectionPill"]);
      if (action === "openSQLTab") return plan(["#btnNewSql"]);
      if (action === "executeQuery" || action === "executeCurrent" || action === "executeAll" || action === "executeSelection") return plan(["#qExecCurrent"]);
      if (action === "schemaRefresh" || action === "refreshSchemas") return plan(["#btnRefresh"]);
      if (action === "showResult" || action === "showTableData") return plan(['[data-bottom="results"]']);
      if (action === "openTableEditor" || action === "openTableEditorTab") return plan(["#workbenchSurfaceTitle"]);
      if (action === "openServerStatus" || action === "openClientConnections" || action === "openPerformanceDashboard" || action === "openPerformanceReports" || action === "openUsersPrivileges" || action === "openOptionsFile" || action === "openServiceControl") return plan(["#workbenchSurfaceTitle"]);
      if (action === "openModel" || action === "createEERDiagram" || action === "reverseEngineer" || action === "forwardEngineer" || action === "synchronizeModel" || action === "compareSchemas") return plan(["#workbenchSurfaceTitle"]);
      if (action === "openMigrationWizard" || action === "configureMigrationSource" || action === "configureMigrationTarget" || action === "runMigration") return plan(["#workbenchSurfaceTitle"]);
      if (action === "openPreferences") return plan(["#workbenchSurfaceTitle"]);
    }
    if (software === "spring_initializer") {
      const v = String(step.action.data?.value ?? step.action.data?.projectType ?? step.action.data?.language ?? step.action.data?.version ?? step.action.data?.packaging ?? step.action.data?.format ?? "");
      const q = value => String(value).replace(/\\/g,"\\\\").replace(/"/g,'\\"');
      if (action === "setProjectType") return plan([`#projectType [data-value="${q(v || "Maven")}"]`]);
      if (action === "setLanguage") return plan([`#language [data-value="${q(v || "Java")}"]`]);
      if (action === "setBootVersion") return plan(["#bootVersion"]);
      if (action === "setGroup") return plan(["#group"]);
      if (action === "setArtifact") return plan(["#artifact"]);
      if (action === "setPackaging") return plan([`#packaging [data-value="${q(v || "Jar")}"]`]);
      if (action === "setJavaVersion") return plan([`#javaVersion [data-value="${q(v || "17")}"]`]);
      if (action === "setConfigFormat") return plan([`#configFormat [data-value="${q(v || "Properties")}"]`]);
      if (action === "openDependencies" || action === "searchDependencies" || action === "addDependency") return plan(["#addDependencyBtn"]);
      if (action === "generateProject") return plan(["#generateBtn"]);
    }
    if (software === "maven_central") {
      if (action === "searchDependency" || action === "setSearch") return plan(["#searchBtn"]);
      if (action === "openArtifact") return plan(["#artifactDetail"]);
      if (action === "selectVersion") return plan(["#versions"]);
      if (action === "showMavenSnippet") return plan(["#snippetCard"]);
      if (action === "copyMavenSnippet") return plan(["#copySnippetBtn"]);
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
    }, SIM_TARGET_ORIGIN);
  }

  function highlightCurrentAction(index, target) {
    const plan = highlightPlanForStep(flat[index]);
    frames[target].contentWindow.postMessage({ type: "SIM_HIGHLIGHT_CLEAR" }, SIM_TARGET_ORIGIN);
    if (!plan) return;
    setTimeout(() => {
      frames[target].contentWindow.postMessage({
        type: "SIM_HIGHLIGHT",
        plan
      }, SIM_TARGET_ORIGIN);
    }, 90);
  }

  function seekSoftware(index, software, animateFinal) {
    const target = normalizeSoftware(software);
    ensureFrameLoaded(target);
    if (!engineReady[target] || !flat.length) return;

    // Never block navigation on visual guidance. The step state is rebuilt
    // immediately, then the relevant control is highlighted independently.
    sendSeekNow(index, target, animateFinal);
    if (target !== "mysqlworkbench" && target !== "kubernetes") highlightCurrentAction(index, target);
    if (target === "mysqlworkbench") {
      setTimeout(() => {
        if (!fullCodeMode && flat.length && normalizeSoftware(flat[current]?.software) === target) highlightCurrentAction(index, target);
      }, 260);
    }
  }

  function explainCurrentStep() {
    if (!flat.length || fullCodeMode) return;
    const step = flat[current];
    const stage = course.stages[step.stageIndex];
    const payload = {
      type: "SIM_EXPLAIN",
      title: step.title,
      text: step.why,
      answer: step.answer || "",
      originalActionTranscript: step.originalActionTranscript || "",
      stage: stage.title
    };

    if (window.SIM_EXPLANATION?.show) {
      window.SIM_EXPLANATION.show(payload);
    } else {
      window.postMessage(payload, location.origin === "null" ? "*" : location.origin);
    }
  }

  function scheduleCurrentExplanation() {
    // Kept for old call sites. The parent-level explanation is rendered by
    // renderCurrentStep() and deduplicated by the global explanation runtime.
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
          String(step.lesson || "").toLowerCase().includes(q) ||
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
        '<span class="stage-count">' + (stage.steps || []).length + " " + (stage.stepLabel || course.stepLabel || "steps") + "</span>" +
        '<span class="stage-chevron">' + (isOpen ? "⌃" : "⌄") + "</span>";

      head.onclick = () => {
        if (openStages.has(stageIndex)) openStages.delete(stageIndex);
        else openStages.add(stageIndex);
        renderSidebar();
      };

      block.appendChild(head);

      const wrap = document.createElement("div");
      wrap.className = "steps-wrap";

      let previousLesson = null;
      (stage.steps || []).forEach((step, localIndex) => {
        const gi = indices[localIndex];
        const software = normalizeSoftware(step.software || "intellij");
        const softwareLabel = appLabels[software];

        const numberMatch = numericQuery !== null && gi + 1 === numericQuery;
        const textMatch =
          step.title.toLowerCase().includes(q) ||
          String(step.lesson || "").toLowerCase().includes(q) ||
          stage.title.toLowerCase().includes(q) ||
          softwareLabel.toLowerCase().includes(q);

        if (q && !numberMatch && !textMatch) return;

        const lessonName = String(step.lesson || "").trim();
        if (lessonName && lessonName !== previousLesson) {
          const lessonHeading = document.createElement("div");
          lessonHeading.className = "lesson-heading";
          lessonHeading.textContent = lessonName;
          wrap.appendChild(lessonHeading);
          previousLesson = lessonName;
        }

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
    window.SIM_EXPLANATION?.hide?.();
    ensureFrameLoaded("intellij");
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
    }, SIM_TARGET_ORIGIN);

    frames.intellij.contentWindow.postMessage({
      type: "SIM_SEEK",
      steps: [],
      animateFinal: false,
      autoType: false
    }, SIM_TARGET_ORIGIN);
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
    try { localStorage.setItem("developerJourney.lastStep.v1", String(current + 1)); } catch (_) {}
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
    seekSoftware(current, software, animateFinal);
    if (software !== "mysqlworkbench" && software !== "kubernetes") scheduleCurrentExplanation(120);
    if (software === "mysqlworkbench") scheduleCurrentExplanation(420);
  }

  window.addEventListener("message", event => {
    if (location.origin !== "null" && event.origin !== location.origin) return;
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

    if (event.data?.type === "SIM_SEEK_DONE") {
      if (
        !fullCodeMode &&
        flat.length &&
        (software === "mysqlworkbench" || software === "kubernetes") &&
        normalizeSoftware(flat[current].software) === software
      ) {
        highlightCurrentAction(current, software);
        scheduleCurrentExplanation(20);
      }
      return;
    }

    if (event.data?.type !== "ENGINE_READY") return;

    // Simulators may re-announce readiness to recover a missed startup message.
    // Once this exact iframe document is ready, repeated announcements must not
    // trigger another package reset/replay.
    if (engineReady[software]) return;
    hydrateReadyFrame(software);

    if (!fullCodeMode && flat.length && normalizeSoftware(flat[current].software) === software) {
      renderCurrentStep();
    }
  });

  function handleLessonKeydown(event) {
    if (fullCodeMode || !flat.length || event.defaultPrevented || event.isComposing) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target;
    const editing = target?.isContentEditable || target?.closest?.(
      'input, textarea, select, [role="textbox"], [role="combobox"], [role="slider"], [role="menu"], [role="listbox"]'
    );
    // Plain arrows belong to editable controls; Alt+Arrow always navigates lessons.
    if (editing && !event.altKey) return;
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (delta) {
      event.preventDefault();
      event.stopPropagation();
      if (current + delta >= 0 && current + delta < flat.length) goToStep(current + delta, delta > 0);
    } else if (!event.altKey && event.key.toLowerCase() === "r") {
      event.preventDefault();
      seekSoftware(current, flat[current].software, true);
    }
  }

  function installFrameNavigationBridge(frame) {
    if (!frame) return;
    const attach = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc || doc.__lessonNavBridgeInstalled) return;
        doc.__lessonNavBridgeInstalled = true;
        doc.addEventListener("keydown", handleLessonKeydown);
      } catch (_) {}
    };
    frame.addEventListener("load", attach);
    attach();
  }

  Object.values(frames).forEach(installFrameNavigationBridge);

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

  document.addEventListener("keydown", handleLessonKeydown);

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
