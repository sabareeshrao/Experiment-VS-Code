"use strict";

function q(value){return String(value??"").replace(/\\/g,"\\\\").replace(/"/g,'\\"')}
function target(selectors,extra={}){
  return {kind:"target",selectors:(Array.isArray(selectors)?selectors:[selectors]).filter(Boolean),...extra};
}
function code(selector=".codeLine.focus,.line.focus,.lineFocus,.sqlLessonLine.active,.sim-emphasis"){
  return {kind:"code",selector};
}

function powerBiHighlight(step){
  const a=step.action?.action,d=step.action?.data||{};
  const visual=d.id||d.source||d.target;
  if(a==="openReport")return target(["#reportName","#statusMessage"]);
  if(a==="selectPage")return target([".pageTab.active","#statusMessage"]);
  if(["openGetData","openNavigator","openRecentSources","openDataSourceSettings","openManageRelationships","showVisualTable","openSelectionPane","openBookmarksPane","openPerformanceAnalyzer","exportReport","shareReport"].includes(a))return target(["#modalTitle","#statusMessage"]);
  if(a==="selectConnector")return target([".connector.selected","#modalTitle"]);
  if(a==="connectDataSource")return target([".modeCard.active","#modalTitle"]);
  if(a==="previewNavigatorItem")return target([".navItem","#modalTitle"],{text:d.name||d.item||"",scope:"#modalBody"});
  if(a==="cancelNavigator")return target(["#reportName","#reportViewBtn"]);
  if(a==="openReportView")return target(["#reportViewBtn","#reportName"]);
  if(a==="selectVisual")return target([`[data-visual-id="${q(d.id)}"]`,"#statusMessage"]);
  if(a==="openOnObjectBuild")return target(["#onObjectMenu"]);
  if(a==="openFormatPane")return target(['[data-pbi-highlight="format-pane"]',"#statusMessage"]);
  if(a==="openAnalyticsPane")return target(['[data-pbi-highlight="analytics-pane"]',"#statusMessage"]);
  if(a==="setVisualType")return target([`[data-vtype="${q(d.type)}"].active`,`[data-visual-id="${q(d.id)}"]`,"#statusMessage"]);
  if(a==="addFieldToWell")return target([`[data-well="${q(d.well)}"]`,`[data-visual-id="${q(d.id)}"]`,"#statusMessage"]);
  if(["setConditionalFormatting","setVisualTooltip","addSlicerSelection","setInteraction","drillDown","drillUp","addTrendLine"].includes(a))return target([`[data-visual-id="${q(visual)}"]`,"#statusMessage"]);
  if(a==="setReportFilter")return target(["#filtersPane","#statusMessage"],{text:"Filters on all pages",scope:"#filtersPane"});
  if(["addBookmark","applyBookmark"].includes(a))return target(["#statusMessage"]);
  if(a==="openDataView")return target(["#dataViewBtn","#statusMessage"]);
  if(["sortDataColumn","filterDataColumn","setDataCategory","setSummarization"].includes(a))return target([`#dataGrid [data-field="${q(d.column)}"]`,"#statusMessage"]);
  if(a==="selectDataTable")return target(["#statusMessage","#dataToolbar"]);
  if(a==="openModelView")return target(["#modelViewBtn","#statusMessage"]);
  if(a==="createHierarchy"||a==="markDateTable"||a==="setTableStorageMode")return target(["#statusMessage","#modelCanvas"]);
  if(a==="hideField")return target([`.modelField[data-field="${q(d.field)}"]`,"#statusMessage"]);
  if(a==="createMeasure")return target(["#dataPane","#statusMessage"],{text:d.name||"Measure",scope:"#dataPane"});
  if(a==="formatMeasure")return target(["#statusMessage","#dataPane"]);
  if(a==="openDaxQueryView")return target(["#daxViewBtn"]);
  if(a==="newDaxQuery")return target(["#newDaxBtn",".codeTab.active"]);
  if(a==="typeDaxQuery")return target(["#daxEditor"]);
  if(a==="runDaxQuery")return target(["#daxResults","#runDaxBtn"]);
  if(a==="openTmdlView")return target(["#tmdlViewBtn"]);
  if(a==="scriptTmdlObject")return target(["#tmdlEditor","#scriptTmdlBtn"]);
  if(a==="previewTmdl")return target(["#tmdlPreview","#previewTmdlBtn"]);
  if(a==="applyTmdl")return target(["#applyTmdlBtn","#statusMessage"]);
  if(a==="openPowerQuery")return target(["#pqStatus",".pqQuery.active"]);
  if(a==="selectQuery")return target([`[data-query-id="${q(d.query||d.name)}"]`,"#pqStatus"]);
  if(["toggleColumnQuality","toggleColumnDistribution","toggleColumnProfile","profileColumn"].includes(a))return target(["#pqProfilingStrip","#pqStatus"]);
  if(["addConditionalColumn","groupBy","removeColumn","chooseColumns","renameColumn","reorderColumn","changeDataType","detectDataType","replaceValues","replaceErrors","removeErrors","removeBlankRows","removeTopRows","removeBottomRows","keepTopRows","keepBottomRows","removeDuplicates","keepDuplicates","filterRows","sortRows","splitColumn","mergeColumns","trimColumn","cleanColumn","transformCase","fillDown","fillUp","promoteHeaders","demoteHeaders","transposeTable","reverseRows","addCustomColumn","addIndexColumn","duplicateColumn","extractText","parseDate","pivotColumn","unpivotColumns","mergeQueries","appendQueries"].includes(a))return target(["#appliedSteps .step.active","#pqGrid","#pqStatus"]);
  if(a==="closeAndApply")return target(["#statusMessage","#dataPane"]);
  if(["startPerformanceRecording","refreshVisuals","stopPerformanceRecording","copyPerformanceQuery"].includes(a))return target(["#statusMessage","#toast"]);
  if(["openMobileLayout","setMobileVisualPosition"].includes(a))return target(["#modalTitle","#statusMessage"]);
  if(["publishReport","selectWorkspace"].includes(a))return target(["#modalTitle","#statusMessage"]);
  if(a==="completePublish")return target(["#toast","#statusMessage"]);
  if(a==="openPowerBIService")return target(["#serviceHero","#statusMessage"]);
  return target(["#statusMessage","#reportName","#reportViewBtn"]);
}

function highlightForStep(step){
  const sw=step.software||"intellij",a=step.action?.action||"",d=step.action?.data||{};

  if(sw==="powerbi")return powerBiHighlight(step);

  if(sw==="intellij"){
    if(["typeCode","setCode","replaceCode","formatCode","optimizeImports"].includes(a))return code();
    if(a==="typeTerminal")return target([".terminalCommandFocus","#terminalInput","#terminal"]);
    if(a==="openFile")return target([".tab.active",".codeLine.focus"]);
    if(a==="showExternalLibraries")return target(['[data-external-libraries="1"]']);
    if(["runJavaMain","runConfiguration","runJUnit"].includes(a))return target(["#runBtn","#bottomPanel"]);
    if(["openIntegratedTerminal","openTerminal"].includes(a))return target(["#terminalBtn","#terminal"]);
    if(a==="splitEditor")return target(["#editorSplitTitle","#editorSplitWrap"]);
    if(a==="openMavenToolWindow")return target(["#rightTabs","#right"]);
    if(["showFileStructure","showSpringBootDashboard","showSpringBeans"].includes(a))return target(["#rightTabs","#right"]);
    if(["newProject","createPackage","createFile","showProjectStructure"].includes(a))return target([".treeRoot","#newBtn","#project"]);
    return target([".codeLine.focus",".tab.active","#status","#runBtn","#project"]);
  }

  if(sw==="vscode"){
    if(a==="typeCode")return code(".line.focus,.codeLine.focus,.sim-emphasis");
    if(a==="terminalCommand")return target([".terminalCommandFocus",".terminalLine:last-child","#terminal"]);
    if(a==="splitEditor")return target(["#editorSplitPane",".tab.active"]);
    if(a==="createFile")return target(["#newFileBtn",".tab.active"]);
    return target([".tab.active","#editor",".activity"]);
  }

  if(sw==="pgadmin"){
    if(["typeSql","typeAndExecuteSql","showSqlConcept"].includes(a))return target([".sqlLessonLine.active",".sim-emphasis","#sqlEditor","#queryEditor"]);
    if(a==="executeQuery")return target(["#run",'[data-result-tab="data"]',".resultTab.active"]);
    if(a==="showExplain")return target(['[data-result-tab="explain"]',"#run"]);
    return target(["#newQuery","#run",".resultTab.active"]);
  }

  if(sw==="postman"){
    if(a==="setEnvironment")return target(["#envName"]);
    if(a==="setMethod")return target(["#methodBox"]);
    if(a==="typeUrl")return target(["input[type=url]","input[type=text]"],{text:d.url||d.value||""});
    if(a==="setHeaders")return target(["#reqTabs"],{text:"Headers",scope:"#reqTabs"});
    if(a==="sendRequest")return target(["#sendBtn"]);
    if(a==="selectResponseTab")return target(["#respTabs"]);
    return target(["#sendBtn","#reqTabs"]);
  }

  if(sw==="cmd"||sw==="powershell"||sw==="linux"){
    return target([".terminalCommandFocus","#commandInput","#termInput","input[type=text]",".terminalLine:last-child"]);
  }

  if(sw==="ssms"){
    if(a==="typeSql")return target([".sqlLessonLine.active",".sim-emphasis","#sqlEditor"]);
    const map={openConnectDialog:'[data-target="connect"]',connectServer:'[data-target="connectDialogButton"]',changeDatabase:"#dbSelect",newQuery:'[data-target="newQuery"]',executeQuery:'[data-target="execute"]',refreshObjectExplorer:'[data-target="refreshObjectExplorer"]',showActualExecutionPlan:'[data-resulttab="plan"]',showClientStatistics:'[data-resulttab="stats"]',saveQuery:'[data-target="save"]'};
    return target([map[a],".tab.active","#status"].filter(Boolean));
  }

  if(sw==="jira"){
    const text=d.key||d.issue||d.status||d.name||d.value||"";
    return target(["#main",".issue",".board"],text?{text}: {});
  }

  if(sw==="jenkins"){
    const text=d.name||d.job||d.status||"";
    return target(["#main","#search"],text?{text,scope:"#main"}:{});
  }

  if(sw==="git")return target(["#mainView","#detailsBody","#pushBtn","#pullBtn","#fetchBtn"]);
  if(sw==="github")return target(["#content"]);
  if(sw==="github_actions")return target(["#content"]);

  if(sw==="mysqlworkbench"){
    if(a==="typeSql")return target([".sqlLessonLine.active",".sim-emphasis","#sqlEditor","#queryEditor"]);
    if(["executeQuery","executeCurrent","executeAll","executeSelection"].includes(a))return target(["#qExecCurrent"]);
    if(a==="showHome")return target(["#homeOverlay"]);
    if(["openConnectionDialog","openConnectionParameters","openConnectionSsl","openConnectionAdvanced"].includes(a))return target(["#btnManageConnections"]);
    if(a==="connect")return target(["#connectionPill"]);
    if(a==="openSQLTab")return target(["#btnNewSql"]);
    if(["schemaRefresh","refreshSchemas"].includes(a))return target(["#btnRefresh"]);
    return target(["#workbenchSurfaceTitle","#connectionPill","#qExecCurrent"]);
  }

  if(sw==="redis"){
    const map={setView:`[data-view="${q(d.view||"browser")}"]`,selectKey:`[data-key="${q(d.key||d.name)}"]`,searchKeys:"#keySearch",filterKeyType:"#typeFilter",createKey:"#addKeyBtn",deleteKey:"#deleteKeyBtn",editKey:"#editKeyBtn",setKeyValue:"#editKeyBtn",setHashField:"#editKeyBtn",pushListItem:"#editKeyBtn",addSetMember:"#editKeyBtn",addSortedSetMember:"#editKeyBtn",setWorkbenchQuery:"#wbEditor",runWorkbench:"#runWb",openCli:"#cliToggle",runCliCommand:"#cliInput",clearCli:"#clearCli",openSearchIndex:'[data-view="search"]',runSearchQuery:"#runSearch",showExplain:"#explainSearch",showProfile:"#profileSearch",startProfiler:"#profilerBtn",stopProfiler:"#profilerBtn",subscribeChannel:"#subscribeBtn",publishMessage:"#publishBtn",openSettings:"#settingsBtn",openDatabaseDialog:"#dbSwitcher"};
    return target([map[a],"#keyList","#cliInput"].filter(Boolean));
  }

  if(sw==="kubernetes"){
    const map={selectCluster:"#clusterSelect",selectNamespace:"#namespaceSelect",openOverview:'[data-nav="overview"]',openLogs:'[data-tab="Logs"]',openExec:'[data-tab="Exec"]',openTerminal:"#terminalToggle",runKubectl:"#termInput",openYaml:'[data-tab="YAML"]',editYaml:"#yamlView",applyYaml:"#yamlView",openMapView:'[data-nav="map"]',openProjects:'[data-nav="projects"]',openProject:'[data-nav="projects"]',openMetrics:'[data-nav="metrics"]',openEvents:'[data-nav="events"]',filterEvents:"#eventFilter",openSettings:'[data-nav="settings"]',searchResources:"#globalSearch",toggleTheme:"#themeToggle",openCommandPalette:"#modalShade .modalHead"};
    if(a==="openResourceList")return target([`[data-nav="${q(d.kind||"pods")}"]`,".pageHead h1"]);
    if(a==="selectResource")return target([`[data-row="${q(d.name)}"]`,".pageHead h1"]);
    if(a==="openResourceTab")return target([`[data-tab="${q(d.tab||"Overview")}"]`,".pageHead h1"]);
    return target([map[a],".pageHead h1","#termInput"].filter(Boolean));
  }

  if(sw==="spring_initializer"){
    const map={setBootVersion:"#bootVersion",setGroup:"#group",setArtifact:"#artifact",openDependencies:"#addDependencyBtn",searchDependencies:"#addDependencyBtn",addDependency:"#addDependencyBtn",generateProject:"#generateBtn"};
    return target([map[a],"#generateBtn","#addDependencyBtn"].filter(Boolean));
  }

  if(sw==="maven_central"){
    const map={searchDependency:"#searchBtn",setSearch:"#searchBtn",openArtifact:"#artifactDetail",selectVersion:"#versions",showMavenSnippet:"#snippetCard",copyMavenSnippet:"#copySnippetBtn"};
    return target([map[a],"#searchBtn"].filter(Boolean));
  }

  if(sw==="eclipse"){
    if(["openProject","createPackage","createJavaFile"].includes(a))return target(["#newBtn","#projectTree"]);
    if(a==="openFile")return target(["#projectTree",".tab.active"]);
    if(a==="runApplication")return target(["#runBtn"]);
    if(a==="showConsole"||a==="showBytecode")return target(["#consoleTab"]);
    if(a==="showProblems"||a==="showDialog")return target(["#problemsTab"]);
    return target(["#projectTree","#runBtn"]);
  }

  return target(["button.active","[aria-selected='true']", ".selected","button"]);
}

module.exports={highlightForStep};

if(require.main===module){
  const fs=require("node:fs");
  const path=require("node:path");
  const root=path.resolve(__dirname,"..");
  const sourceRoot=path.join(root,"lesson-json");
  const manifest=JSON.parse(fs.readFileSync(path.join(sourceRoot,"course.json"),"utf8"));
  let count=0;
  const stages=[];
  for(const refEntry of manifest.chapters||[]){
    const file=path.resolve(sourceRoot,refEntry.path);
    if(!file.startsWith(sourceRoot+path.sep))throw new Error("Chapter path escapes lesson-json: "+refEntry.path);
    const chapter=JSON.parse(fs.readFileSync(file,"utf8"));
    for(const step of chapter.steps||[]){
      step.highlight=highlightForStep(step);
      if(!["target","code","none"].includes(step.highlight?.kind))throw new Error("Unresolved highlight for "+chapter.title+" / "+step.title);
      count++;
    }
    fs.writeFileSync(file,JSON.stringify(chapter,null,2)+"\n");
    const {schema_version,id,...stage}=chapter;
    stages.push(stage);
  }
  const course={title:manifest.title,subtitle:manifest.subtitle,books:manifest.books||[],package:manifest.package||{apps:{}},stages};
  fs.writeFileSync(path.join(root,"lessons.js"),"window.COURSE = "+JSON.stringify(course,null,2)+";\n");
  console.log("Applied explicit highlight contracts to "+count+" lesson steps and rebuilt lessons.js");
}
