(() => {
"use strict";
const APP_ID="power_bi";
const SUPPORTED_ACTIONS=["openMenu", "pressButton", "highlightTarget", "showNotification", "setView", "showHome", "newBlankReport", "openReport", "saveReport", "saveReportAs", "openFileMenu", "openOptions", "openGetData", "selectConnector", "setConnection", "connectDataSource", "openNavigator", "selectNavigatorItem", "selectAllNavigatorItems", "previewNavigatorItem", "loadNavigatorSelection", "transformNavigatorSelection", "cancelNavigator", "openRecentSources", "enterData", "openDataSourceSettings", "openPowerQuery", "selectQuery", "refreshPreview", "toggleFormulaBar", "openAdvancedEditor", "removeColumn", "chooseColumns", "renameColumn", "reorderColumn", "changeDataType", "detectDataType", "replaceValues", "replaceErrors", "removeErrors", "removeBlankRows", "removeTopRows", "removeBottomRows", "keepTopRows", "keepBottomRows", "removeDuplicates", "keepDuplicates", "filterRows", "sortRows", "splitColumn", "mergeColumns", "trimColumn", "cleanColumn", "transformCase", "fillDown", "fillUp", "promoteHeaders", "demoteHeaders", "transposeTable", "reverseRows", "addCustomColumn", "addConditionalColumn", "addIndexColumn", "duplicateColumn", "extractText", "parseDate", "groupBy", "pivotColumn", "unpivotColumns", "mergeQueries", "appendQueries", "duplicateQuery", "referenceQuery", "renameQuery", "deleteQuery", "selectAppliedStep", "deleteAppliedStep", "moveAppliedStep", "toggleColumnQuality", "toggleColumnDistribution", "toggleColumnProfile", "profileColumn", "closeAndApply", "discardQueryChanges", "openDataView", "selectDataTable", "sortDataColumn", "filterDataColumn", "setColumnFormat", "setSummarization", "setDataCategory", "openModelView", "addRelationship", "editRelationship", "deleteRelationship", "setRelationshipCardinality", "setCrossFilterDirection", "setRelationshipActive", "openManageRelationships", "hideTable", "hideField", "sortByColumn", "markDateTable", "setTableProperty", "setFieldProperty", "createHierarchy", "addHierarchyLevel", "renameHierarchy", "setTableStorageMode", "createMeasure", "editDax", "deleteMeasure", "createCalculatedColumn", "createCalculatedTable", "formatMeasure", "setMeasureDisplayFolder", "validateDax", "openReportView", "addPage", "renamePage", "duplicatePage", "deletePage", "hidePage", "selectPage", "setCanvasZoom", "setCanvasFit", "setPageSize", "setPageBackground", "setWallpaper", "toggleGridlines", "toggleSnapToGrid", "toggleLockObjects", "addVisual", "selectVisual", "deleteVisual", "duplicateVisual", "moveVisual", "resizeVisual", "setVisualType", "addFieldToWell", "removeFieldFromWell", "reorderFieldWell", "setVisualData", "formatVisual", "setConditionalFormatting", "bringForward", "sendBackward", "alignVisuals", "distributeVisuals", "groupVisuals", "ungroupVisuals", "copyVisual", "pasteVisual", "setVisualTooltip", "setFilter", "clearFilter", "setVisualFilter", "setPageFilter", "setReportFilter", "setFilterMode", "addSlicerSelection", "clearSlicer", "syncSlicer", "setInteraction", "drillDown", "drillUp", "expandHierarchy", "nextHierarchyLevel", "setDrillthrough", "drillthrough", "goBack", "addBookmark", "applyBookmark", "openAnalyticsPane", "addTrendLine", "addConstantLine", "addForecast", "findAnomalies", "runKeyInfluencers", "expandDecomposition", "askQnA", "openPerformanceAnalyzer", "startPerformanceRecording", "stopPerformanceRecording", "refreshVisuals", "copyPerformanceQuery", "publishReport", "selectWorkspace", "completePublish", "openPowerBIService", "exportReport", "shareReport", "embedReport", "applyReportTheme", "importTheme", "openMobileLayout", "setMobileVisualPosition", "refreshData", "refreshAll", "configureIncrementalRefresh", "showLearningMap", "selectLearningFeature", "openDaxQueryView", "newDaxQuery", "typeDaxQuery", "runDaxQuery", "openTmdlView", "scriptTmdlObject", "typeTmdl", "previewTmdl", "applyTmdl", "openModelExplorer", "selectModelObject", "togglePane", "openPaneSwitcher", "openOnObjectBuild", "openFormatPane", "showVisualTable", "openSelectionPane", "openBookmarksPane", "toggleRibbonCollapsed", "showKeytips", "searchRibbon", "openContextMenu"];
const FEATURE_CATALOG={"Home & File": ["Power BI Desktop home screen", "Blank report creation", "Recent report list", "Open PBIX file", "Save report", "Save report as", "Auto-recovery awareness", "File menu", "Options and settings entry", "About/version view"], "Data Connections": ["Get Data dialog", "Excel connector", "Text/CSV connector", "JSON connector", "Folder connector", "SQL Server connector", "PostgreSQL connector", "Web connector", "OData connector", "SharePoint Folder connector", "OneLake connector", "Dataflows connector", "Enter Data", "Recent Sources", "Connection credential prompt", "Import storage mode", "DirectQuery storage mode", "Data source settings"], "Navigator & Load": ["Navigator table tree", "Navigator sheet preview", "Multi-select tables", "Select all tables", "Preview selected source", "Load directly", "Transform Data choice", "Cancel Navigator", "Table load status", "Refresh source preview", "Choose worksheet vs table", "Connection path summary"], "Power Query Workspace": ["Open Power Query Editor", "Queries pane", "Data preview grid", "Applied Steps pane", "Formula bar", "Query Settings pane", "Home ribbon", "Transform ribbon", "Add Column ribbon", "View ribbon"], "Power Query Transformations": ["Remove column", "Choose columns", "Rename column", "Reorder columns", "Change data type", "Detect data type", "Replace values", "Replace errors", "Remove errors", "Remove blank rows", "Remove top rows", "Remove bottom rows", "Keep top rows", "Keep bottom rows", "Remove duplicates", "Keep duplicates", "Filter rows", "Sort ascending", "Sort descending", "Split by delimiter", "Split by positions", "Merge columns", "Trim text", "Clean text", "Uppercase text", "Lowercase text", "Capitalize each word", "Fill down", "Fill up", "Promote headers", "Demote headers", "Transpose table", "Reverse rows"], "Advanced Power Query": ["Add custom column", "Add conditional column", "Add index column", "Duplicate column", "Extract text", "Parse date", "Group By", "Pivot column", "Unpivot columns", "Merge queries", "Append queries", "Duplicate query", "Reference query", "Rename query", "Delete query", "Enable load", "Advanced Editor", "Query parameters"], "Data Profiling": ["Column quality", "Column distribution", "Column profile", "Distinct count", "Error count", "Empty count", "Value distribution", "Profile based on top rows", "Profile entire dataset"], "Data View": ["Open Data view", "Select table", "Data grid browsing", "Column sort", "Column filter", "Column statistics", "Column tools ribbon", "Format column", "Default summarization", "Data category"], "Modeling": ["Open Model view", "Model diagram", "Auto-detected relationship", "Create relationship", "Edit relationship", "Delete relationship", "One-to-many cardinality", "One-to-one cardinality", "Many-to-many cardinality", "Single cross-filter direction", "Both cross-filter direction", "Active relationship", "Inactive relationship", "Manage relationships dialog", "Hide table from report view", "Hide column from report view", "Sort by column", "Mark as date table", "Table properties", "Field properties", "Create hierarchy", "Add hierarchy level", "Rename hierarchy", "Storage mode indicator"], "DAX Core": ["Create measure", "Edit measure", "Delete measure", "Calculated column", "Calculated table", "Formula bar", "SUM", "AVERAGE", "MIN", "MAX", "COUNTROWS", "DISTINCTCOUNT", "DIVIDE", "IF", "SWITCH", "RELATED", "RELATEDTABLE", "Measure formatting"], "DAX Advanced": ["CALCULATE", "FILTER", "ALL", "ALLEXCEPT", "ALLSELECTED", "REMOVEFILTERS", "SUMX", "AVERAGEX", "VAR", "RETURN", "SELECTEDVALUE", "HASONEVALUE", "USERELATIONSHIP", "DATEADD", "TOTALYTD", "SAMEPERIODLASTYEAR", "Time intelligence date table", "Measure display folder"], "Report Canvas": ["Open Report view", "Blank canvas", "Add report page", "Rename page", "Duplicate page", "Delete page", "Hide page", "Page tab navigation", "Canvas zoom", "Fit to page", "Fit to width", "Actual size", "Canvas size settings", "Page background", "Wallpaper", "Gridlines", "Snap to grid", "Lock objects"], "Visualizations": ["Clustered bar chart", "Clustered column chart", "Stacked bar chart", "Stacked column chart", "100% stacked bar chart", "100% stacked column chart", "Line chart", "Area chart", "Line and stacked column chart", "Line and clustered column chart", "Ribbon chart", "Waterfall chart", "Funnel chart", "Scatter chart", "Pie chart", "Donut chart", "Treemap", "Map", "Filled map", "Azure Maps", "Gauge", "Card", "Multi-row card", "KPI", "Table", "Matrix", "Slicer", "Decomposition tree", "Key influencers", "Q&A visual", "Smart narrative", "Shape", "Text box"], "Visual Formatting": ["Format pane", "Visual title", "Subtitle", "Background", "Border", "Shadow", "Rounded corners", "Data colors", "Data labels", "Legend", "X-axis formatting", "Y-axis formatting", "Gridlines formatting", "Display units", "Decimal places", "Conditional formatting", "Theme gallery"], "Filters & Interactions": ["Filters pane", "Visual-level filter", "Page-level filter", "Report-level filter", "Basic filtering", "Advanced filtering", "Top N filtering", "Relative date filter", "Relative time filter", "Slicer selection", "Multi-select slicer", "Slicer search", "Sync slicers", "Cross-filtering", "Cross-highlighting", "Edit interactions"], "Drill & Navigation": ["Date hierarchy", "Drill down", "Drill up", "Expand all down one level", "Go to next level", "Drillthrough page", "Drillthrough filter", "Back button", "Bookmark", "Selection pane"], "AI & Analytics": ["Analytics pane", "Trend line", "Constant line", "Forecast", "Find anomalies", "Key influencers analysis", "Decomposition tree drill", "Q&A natural language"], "Optimization": ["Performance Analyzer", "Start recording", "Stop recording", "Refresh visuals timing", "Copy performance query", "Optimize ribbon"], "Publish & Sharing": ["Publish report", "Choose workspace", "Publish progress", "Publish success", "Open in Power BI Service", "Export PDF", "Export PowerPoint", "Analyze in Excel", "Share by email", "Share to Teams"], "Simulation & Accessibility": ["Persistent educational highlight", "Deterministic replay"]};

let packageRef=null, baseline=null, state=null, autoType=true, seekToken=0, allowBoundary=true, activeRibbon="Home", visualPointerSession=null;
let clipboardVisual=null, transientTimer=0;

const $=id=>document.getElementById(id);
const refs={
 titleText:$("titleText"), pbiSearch:$("pbiSearch"), ribbonTabs:$("ribbonTabs"), ribbon:$("ribbon"),
 reportViewBtn:$("reportViewBtn"),dataViewBtn:$("dataViewBtn"),modelViewBtn:$("modelViewBtn"),daxViewBtn:$("daxViewBtn"),tmdlViewBtn:$("tmdlViewBtn"),
 reportView:$("reportView"),dataView:$("dataView"),modelView:$("modelView"),daxView:$("daxView"),tmdlView:$("tmdlView"),serviceView:$("serviceView"),
 reportName:$("reportName"),canvasState:$("canvasState"),reportStage:$("reportStage"),reportCanvas:$("reportCanvas"),emptyCanvas:$("emptyCanvas"),
 dataToolbar:$("dataToolbar"),dataGrid:$("dataGrid"),modelCanvas:$("modelCanvas"),
 paneTabs:$("paneTabs"),filtersPane:$("filtersPane"),visualizationsPane:$("visualizationsPane"),dataPane:$("dataPane"),
 pageTabs:$("pageTabs"),statusMessage:$("statusMessage"),zoomText:$("zoomText"),storageText:$("storageText"),
 powerQuery:$("powerQuery"),pqRibbon:$("pqRibbon"),pqQueries:$("pqQueries"),pqGrid:$("pqGrid"),formulaBar:$("formulaBar"),appliedSteps:$("appliedSteps"),pqStatus:$("pqStatus"),pqFooter:$("pqFooter"),daxEditor:$("daxEditor"),daxResults:$("daxResults"),daxModelExplorer:$("daxModelExplorer"),tmdlEditor:$("tmdlEditor"),tmdlPreview:$("tmdlPreview"),tmdlModelExplorer:$("tmdlModelExplorer"),paneSwitcher:$("paneSwitcher"),onObjectMenu:$("onObjectMenu"),
 modalShade:$("modalShade"),modalTitle:$("modalTitle"),modalBody:$("modalBody"),modalFoot:$("modalFoot"),
 toast:$("toast"),boundary:$("boundary"),serviceHero:$("serviceHero"),mainArea:$("mainArea")
};

function clone(v){return v==null?v:JSON.parse(JSON.stringify(v));}
function arr(v){return Array.isArray(v)?v:[];}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function uid(prefix){return prefix+"_"+Math.random().toString(36).slice(2,9);}
function emptyState(){
 return {
  title:"Untitled - Power BI Desktop",reportName:"Untitled",activeView:"report",theme:"light",
  ribbonTab:"Home",paneTab:"filters",statusText:"Ready",canvasZoom:100,canvasFit:"Fit to page",
  gridlines:false,snapToGrid:false,lockObjects:false,storageMode:"Import",
  connectors:["Excel","Text/CSV","JSON","Folder","SQL Server","PostgreSQL","Web","OData","SharePoint Folder","OneLake","Dataflows","Enter Data"],
  sources:[],navigator:{items:[],selected:[]},tables:[],queries:[],relationships:[],measures:[],calculatedColumns:[],calculatedTables:[],
  pages:[{id:"page1",name:"Page 1",hidden:false,visuals:[],background:"#ffffff",wallpaper:"#d4d4d4",size:{width:960,height:540}}],
  activePageId:"page1",selectedVisualId:null,selectedTable:null,selectedQuery:null,
  filters:{report:[],page:{},visual:{}},bookmarks:[],interactions:[],hierarchies:[],
  performance:{recording:false,events:[]},publish:{workspace:null,status:""},mobile:{enabled:false,visuals:[]},
  powerQueryOpen:false,formulaBar:true,columnQuality:false,columnDistribution:false,columnProfile:false,serviceOpen:false,daxQueries:[{id:"dax1",name:"Query 1",text:"",results:[]}],activeDaxQueryId:"dax1",tmdlScripts:[{id:"tmdl1",name:"TMDL Script 1",text:"",preview:"No pending changes."}],activeTmdlScriptId:"tmdl1",modelExplorerOpen:true,openPanes:["filters","visualizations","data"],ribbonCollapsed:false,keytips:false,
  menus:[],options:{},featureSelection:null
 };
}
function normalize(s){
 const e=emptyState(),o=Object.assign(e,clone(s||{}));
 o.pages=arr(o.pages); if(!o.pages.length)o.pages=e.pages;
 o.tables=arr(o.tables);o.queries=arr(o.queries);o.relationships=arr(o.relationships);o.measures=arr(o.measures);
 o.calculatedColumns=arr(o.calculatedColumns);o.calculatedTables=arr(o.calculatedTables);o.bookmarks=arr(o.bookmarks);o.interactions=arr(o.interactions);o.hierarchies=arr(o.hierarchies);
 o.filters=o.filters||clone(e.filters);o.filters.report=arr(o.filters.report);o.filters.page=o.filters.page||{};o.filters.visual=o.filters.visual||{};
 o.navigator=o.navigator||{items:[],selected:[]};o.navigator.items=arr(o.navigator.items);o.navigator.selected=arr(o.navigator.selected);
 o.performance=o.performance||{recording:false,events:[]};o.performance.events=arr(o.performance.events);
 o.mobile=o.mobile||{enabled:false,visuals:[]};o.publish=o.publish||{workspace:null,status:""};o.daxQueries=arr(o.daxQueries);if(!o.daxQueries.length)o.daxQueries=clone(e.daxQueries);o.tmdlScripts=arr(o.tmdlScripts);if(!o.tmdlScripts.length)o.tmdlScripts=clone(e.tmdlScripts);o.openPanes=arr(o.openPanes);
 return o;
}
function loadPackage(pkg){packageRef=pkg;baseline=normalize(pkg?.apps?.[APP_ID]||{});reset();}
function reset(){
 clearTransient();state=normalize(baseline||{});activeRibbon=state.ribbonTab||"Home";applyTheme(state.theme||"light");renderAll();
}
function applyTheme(theme){document.body.classList.toggle("theme-dark",theme==="dark");document.body.classList.toggle("theme-light",theme!=="dark");if(state)state.theme=theme;}
function currentPage(){return state.pages.find(p=>p.id===state.activePageId)||state.pages[0];}
function currentVisual(){const p=currentPage();return p?.visuals?.find(v=>v.id===state.selectedVisualId)||null;}
function getVisual(id){for(const p of state.pages){const v=arr(p.visuals).find(x=>x.id===id);if(v)return v;}return null;}
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function snapValue(n){return state.snapToGrid?Math.round(n/16)*16:Math.round(n);}
function rectForVisual(v){return {x:v.x??0,y:v.y??0,w:v.w??300,h:v.h??180};}
function rectsOverlap(a,b,pad=8){return a.x < b.x+b.w+pad && a.x+a.w+pad > b.x && a.y < b.y+b.h+pad && a.y+a.h+pad > b.y;}
function overlapArea(a,b){const x=Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x));const y=Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));return x*y;}
function smartVisualPosition(page,w,h,preferredX=24,preferredY=24,excludeId=null){
 const pw=page?.size?.width||960,ph=page?.size?.height||540,others=arr(page?.visuals).filter(v=>v.id!==excludeId);
 const maxX=Math.max(0,pw-w),maxY=Math.max(0,ph-h),px=clamp(preferredX,0,maxX),py=clamp(preferredY,0,maxY);
 const candidate={x:px,y:py,w,h};if(!others.some(v=>rectsOverlap(candidate,rectForVisual(v))))return {x:px,y:py};
 let best={x:px,y:py,score:Infinity};
 for(let y=12;y<=maxY;y+=20){for(let x=12;x<=maxX;x+=20){const r={x,y,w,h};const score=others.reduce((s,v)=>s+overlapArea(r,rectForVisual(v)),0);if(score===0)return {x,y};if(score<best.score)best={x,y,score};}}
 return {x:best.x,y:best.y};
}
function selectVisualElement(el){
 const id=el?.dataset?.visualId;if(!id)return null;state.selectedVisualId=id;
 refs.reportCanvas.querySelectorAll('.visual').forEach(n=>n.classList.toggle('selected',n===el));
 renderSidePanes();return getVisual(id);
}
function applyVisualElementGeometry(el,v){el.style.left=(v.x??0)+'px';el.style.top=(v.y??0)+'px';el.style.width=(v.w??300)+'px';el.style.height=(v.h??180)+'px';}
function beginVisualPointer(e,el){
 if(e.button!==undefined&&e.button!==0)return;
 const v=selectVisualElement(el);if(!v)return;
 const handle=e.target.closest('.resizeHandle');const fromTitle=!!e.target.closest('.visualTitle');
 if(!handle&&!fromTitle)return;
 e.preventDefault();e.stopPropagation();
 if(state.lockObjects){showToast('Objects are locked');return;}
 const scale=(state.canvasZoom||100)/100;
 visualPointerSession={pointerId:e.pointerId,id:v.id,el,handle:handle?.dataset?.handle||null,startX:e.clientX,startY:e.clientY,scale,origin:{x:v.x??0,y:v.y??0,w:v.w??300,h:v.h??180},moved:false};
 el.classList.add(handle?'isResizing':'isDragging');try{el.setPointerCapture(e.pointerId);}catch(_){ }
}
function moveVisualPointer(e){
 const s=visualPointerSession;if(!s||e.pointerId!==s.pointerId)return;const v=getVisual(s.id);if(!v)return;
 const dx=(e.clientX-s.startX)/s.scale,dy=(e.clientY-s.startY)/s.scale;const p=currentPage(),pw=p?.size?.width||960,ph=p?.size?.height||540,minW=90,minH=60;
 let {x,y,w,h}=s.origin;
 if(!s.handle){x=clamp(snapValue(x+dx),0,Math.max(0,pw-w));y=clamp(snapValue(y+dy),0,Math.max(0,ph-h));}
 else{
  const hnd=s.handle;
  if(hnd.includes('e'))w=clamp(snapValue(s.origin.w+dx),minW,Math.max(minW,pw-s.origin.x));
  if(hnd.includes('s'))h=clamp(snapValue(s.origin.h+dy),minH,Math.max(minH,ph-s.origin.y));
  if(hnd.includes('w')){const nx=clamp(snapValue(s.origin.x+dx),0,s.origin.x+s.origin.w-minW);w=s.origin.w+(s.origin.x-nx);x=nx;}
  if(hnd.includes('n')){const ny=clamp(snapValue(s.origin.y+dy),0,s.origin.y+s.origin.h-minH);h=s.origin.h+(s.origin.y-ny);y=ny;}
 }
 v.x=x;v.y=y;v.w=w;v.h=h;s.moved=true;applyVisualElementGeometry(s.el,v);
}
function endVisualPointer(e){
 const s=visualPointerSession;if(!s||e.pointerId!==s.pointerId)return;visualPointerSession=null;
 try{s.el.releasePointerCapture(e.pointerId);}catch(_){ }
 s.el.classList.remove('isDragging','isResizing');
 if(s.moved){state.statusText=s.handle?'Visual resized':'Visual moved';refs.statusMessage.textContent=state.statusText;renderReport();renderSidePanes();}
}
function bindVisualInteractions(){
 refs.reportCanvas.querySelectorAll('.visual').forEach(el=>{
  el.addEventListener('pointerdown',e=>beginVisualPointer(e,el));
  el.addEventListener('pointermove',moveVisualPointer);el.addEventListener('pointerup',endVisualPointer);el.addEventListener('pointercancel',endVisualPointer);
  el.addEventListener('click',e=>{e.stopPropagation();if(visualPointerSession)return;selectVisualElement(el);});
 });
}
function getTable(name){return state.tables.find(t=>t.name===name||t.id===name)||null;}
function getQuery(name){return state.queries.find(q=>q.name===name||q.id===name)||null;}
function getMeasure(name){return state.measures.find(m=>m.name===name||m.id===name)||null;}
function setStatus(text){state.statusText=text||"Ready";refs.statusMessage.textContent=state.statusText;}
function clearTransient(){
 clearTimeout(transientTimer);refs.toast.classList.remove("show");refs.modalShade.classList.remove("show");refs.boundary.classList.remove("show");
}
function showToast(text){refs.toast.textContent=text||"Done";refs.toast.classList.add("show");}
function showModal(title,body,buttons=[{label:"Cancel"},{label:"OK",primary:true}]){
 refs.modalTitle.textContent=title;refs.modalBody.innerHTML=body;refs.modalFoot.innerHTML="";
 buttons.forEach(b=>{const bt=document.createElement("button");bt.className="btn"+(b.primary?" primary":"");bt.textContent=b.label;bt.onclick=()=>refs.modalShade.classList.remove("show");refs.modalFoot.appendChild(bt);});
 refs.modalShade.classList.add("show");
}
function resolveTarget(target){
 if(!target)return null;
 if(typeof target==="string"){
  const map={report:"reportViewBtn",data:"dataViewBtn",model:"modelViewBtn",canvas:"reportCanvas",filters:"filtersPane",visualizations:"visualizationsPane",fields:"dataPane",powerQuery:"powerQuery",queryGrid:"pqGrid",appliedSteps:"appliedSteps",formulaBar:"formulaBar",status:"statusMessage"};
  if(map[target])return $(map[target]);
  const v=getVisual(target);if(v)return refs.reportCanvas.querySelector(`[data-visual-id="${CSS.escape(target)}"]`);
  const el=document.querySelector(`[data-target="${CSS.escape(target)}"]`);if(el)return el;
 }
 if(target.type==="visual")return refs.reportCanvas.querySelector(`[data-visual-id="${CSS.escape(target.id||"")}"]`);
 if(target.type==="field")return document.querySelector(`[data-field="${CSS.escape(target.field||target.name||"")}"]`);
 if(target.type==="page")return document.querySelector(`[data-page-id="${CSS.escape(target.id||"")}"]`);
 if(target.type==="query")return document.querySelector(`[data-query-id="${CSS.escape(target.id||target.name||"")}"]`);
 if(target.type==="learning")return document.querySelector(`[data-feature="${CSS.escape(target.feature||"")}"]`);
 return null;
}
function drawBoundary(target){
 if(!allowBoundary)return;
 requestAnimationFrame(()=>{const el=resolveTarget(target);if(!el)return;const a=el.getBoundingClientRect(),b=refs.mainArea.getBoundingClientRect();refs.boundary.style.left=(a.left-b.left-3)+"px";refs.boundary.style.top=(a.top-b.top-3)+"px";refs.boundary.style.width=(a.width+6)+"px";refs.boundary.style.height=(a.height+6)+"px";refs.boundary.classList.add("show");});
}
function closePowerQueryIfNeeded(action){
 const keep=new Set(["openPowerQuery","selectQuery","refreshPreview","toggleFormulaBar","openAdvancedEditor","removeColumn","chooseColumns","renameColumn","reorderColumn","changeDataType","detectDataType","replaceValues","replaceErrors","removeErrors","removeBlankRows","removeTopRows","removeBottomRows","keepTopRows","keepBottomRows","removeDuplicates","keepDuplicates","filterRows","sortRows","splitColumn","mergeColumns","trimColumn","cleanColumn","transformCase","fillDown","fillUp","promoteHeaders","demoteHeaders","transposeTable","reverseRows","addCustomColumn","addConditionalColumn","addIndexColumn","duplicateColumn","extractText","parseDate","groupBy","pivotColumn","unpivotColumns","mergeQueries","appendQueries","duplicateQuery","referenceQuery","renameQuery","deleteQuery","selectAppliedStep","deleteAppliedStep","moveAppliedStep","toggleColumnQuality","toggleColumnDistribution","toggleColumnProfile","profileColumn","closeAndApply","discardQueryChanges"]);
 if(state.powerQueryOpen&&!keep.has(action))state.powerQueryOpen=false;
}
function renderAll(){
 if(!state)return;refs.titleText.textContent=state.title||`${state.reportName||"Untitled"} - Power BI Desktop`;refs.reportName.textContent=state.reportName||"Untitled";
 refs.zoomText.textContent=(state.canvasZoom||100)+"%";refs.storageText.textContent=(state.storageMode||"Import")+" mode";refs.statusMessage.textContent=state.statusText||"Ready";
 renderRibbon();renderViews();renderPages();renderSidePanes();renderPowerQuery();renderModernEditors();renderModernIcons();
}
const ribbonMeta={
 File:[
  {name:"File",items:[["New","fileNew","file"],["Open report","fileOpen","file"],["Save","fileSave","file"],["Options","fileOptions","settings"]]}
 ],
 Home:[
  {name:"Clipboard",items:[["Paste","paste","paste"],["Format painter","formatPainter","format"]]},
  {name:"Data",items:[["Get data","getData","getData"],["Excel workbook","excel","excel"],["SQL Server","sqlServer","database"],["Enter data","enterData","table"],["Transform data","transformData","transform"],["Refresh","refresh","refresh"]]},
  {name:"Insert",items:[["New visual","newVisual","visual"],["Text box","text","text"],["More visuals","moreVisuals","visual"]]},
  {name:"Calculations",items:[["New measure","measure","measure"],["Quick measure","quickMeasure","measure"]]},
  {name:"Share",items:[["Publish","publish","publish"]]}
 ],
 Insert:[
  {name:"Visuals",items:[["New visual","newVisual","visual"],["Slicer","slicer","filter"],["Table","tableVisual","table"],["Matrix","matrix","table"],["Card","card","card"]]},
  {name:"Elements",items:[["Text box","text","text"],["Buttons","button","button"],["Shape","shape","shape"],["Image","image","image"]]},
  {name:"AI visuals",items:[["Key influencers","keyInfluencers","ai"],["Decomposition tree","decomposition","ai"],["Q&A","qna","ai"]]}
 ],
 Modeling:[
  {name:"Calculations",items:[["New measure","measure","measure"],["Quick measure","quickMeasure","measure"],["New column","column","column"],["New table","table","table"]]},
  {name:"Relationships",items:[["Manage relationships","relationships","relationship"],["Mark as date table","date","calendar"]]},
  {name:"Properties",items:[["Data category","dataCategory","tag"],["Sort by column","sortBy","sort"]]}
 ],
 View:[
  {name:"Themes",items:[["Themes","theme","theme"],["Customize current theme","customTheme","theme"]]},
  {name:"Page view",items:[["Fit to page","pageView","fit"],["Gridlines","grid","grid"],["Snap to grid","snap","grid"]]},
  {name:"Panes",items:[["Selection","selection","pane"],["Bookmarks","bookmarks","bookmark"],["Sync slicers","sync","filter"]]}
 ],
 Optimize:[
  {name:"Performance",items:[["Performance analyzer","performance","performance"],["Pause visuals","pause","pause"],["Refresh visuals","refresh","refresh"]]},
  {name:"Queries",items:[["Optimize ribbon","optimize","spark"],["Query diagnostics","diagnostics","search"]]}
 ],
 Help:[
  {name:"Learning",items:[["Learning","learning","help"],["Examples","examples","help"],["About","about","info"]]}
 ]
};
function renderRibbon(){
 const tabs=Object.keys(ribbonMeta);refs.ribbonTabs.innerHTML=tabs.map(t=>`<button class="ribbonTab ${activeRibbon===t?"active":""}" data-ribbon="${esc(t)}">${esc(t)}</button>`).join("");
 refs.ribbonTabs.querySelectorAll("[data-ribbon]").forEach(b=>b.onclick=()=>{activeRibbon=b.dataset.ribbon;state.ribbonTab=activeRibbon;renderRibbon();});
 refs.ribbon.innerHTML=ribbonMeta[activeRibbon].map(group=>`<div class="ribGroup" data-label="${esc(group.name)}">`+group.items.map(([label,target,icon])=>`<button class="ribBtn" data-target="${esc(target)}"><span class="ribIcon">${window.PBI_ICON?window.PBI_ICON(icon||"visual",22):esc(label.slice(0,2))}</span><span>${esc(label)}</span></button>`).join("")+`</div>`).join("");
 refs.ribbon.classList.toggle("collapsed",!!state.ribbonCollapsed);renderKeytips();
 refs.ribbon.querySelectorAll(".ribBtn").forEach(b=>b.onclick=()=>manualRibbon(b.dataset.target));
}
function manualRibbon(target){
 if(target==="fileNew"){state=normalize(emptyState());renderAll();return}
 if(target==="fileOpen"){showModal("Open report",'<div class="filterCard">Browse this device</div><div class="filterCard">Recent reports</div>');return}
 if(target==="fileSave"){state.statusText="Saved";showToast("Report saved");return}
 if(target==="fileOptions"){showModal("Options and settings",'<div class="filterCard">Options</div><div class="filterCard">Data source settings</div>');return}
 if(target==="getData"){showGetData();return}if(target==="transformData"){state.powerQueryOpen=true;renderPowerQuery();return}
 if(target==="refresh"){setStatus("Data refreshed");showToast("Refresh completed");return}
 if(target==="newVisual"){addVisualState({type:"clusteredColumn",title:"New visual"});renderAll();return}
 if(target==="publish"){showPublish();return}if(target==="learning"){showLearningMap();return}
 if(target==="measure"){showModal("New measure",`<textarea class="codeArea">Measure = SUM(Table[Value])</textarea>`);return}
 if(target==="relationships"){showRelationships();return}
}
function renderViews(){
 const v=state.serviceOpen?"service":state.activeView||"report";
 refs.reportView.classList.toggle("active",v==="report");refs.dataView.classList.toggle("active",v==="data");refs.modelView.classList.toggle("active",v==="model");refs.daxView?.classList.toggle("active",v==="dax");refs.tmdlView?.classList.toggle("active",v==="tmdl");refs.serviceView.classList.toggle("active",v==="service");
 refs.reportViewBtn.classList.toggle("active",v==="report");refs.dataViewBtn.classList.toggle("active",v==="data");refs.modelViewBtn.classList.toggle("active",v==="model");refs.daxViewBtn?.classList.toggle("active",v==="dax");refs.tmdlViewBtn?.classList.toggle("active",v==="tmdl");
 if(v==="report")renderReport();if(v==="data")renderData();if(v==="model")renderModel();if(v==="dax")renderDaxQueryView();if(v==="tmdl")renderTmdlView();if(v==="service")renderService();
}

function renderModernIcons(){document.querySelectorAll("[data-pbi-icon]").forEach(el=>{if(!el.dataset.iconDone&&window.PBI_ICON){el.innerHTML=window.PBI_ICON(el.dataset.pbiIcon,21);el.dataset.iconDone="1"}})}
function explorerHtml(){return '<div class="explorerTitle">Model explorer</div>'+state.tables.map(t=>'<div class="explorerNode">▦ '+esc(t.name)+'</div>'+arr(t.columns).slice(0,8).map(c=>'<div class="explorerNode" style="padding-left:30px">• '+esc(typeof c==="string"?c:c.name)+'</div>').join("")).join("")+(state.measures.length?'<div class="explorerTitle">Measures</div>'+state.measures.map(m=>'<div class="explorerNode">ƒ '+esc(m.name)+'</div>').join(""):"")+'<div class="explorerTitle">Functions</div><div class="explorerNode">ƒ User-defined functions</div>'}
function renderDaxQueryView(){const q=state.daxQueries.find(x=>x.id===state.activeDaxQueryId)||state.daxQueries[0];if(!q)return;refs.daxModelExplorer.innerHTML=explorerHtml();if(document.activeElement!==refs.daxEditor)refs.daxEditor.value=q.text||"";refs.daxResults.innerHTML=q.results?.length?'<table class="dataGrid"><tbody>'+q.results.map(r=>'<tr>'+arr(r).map(v=>'<td>'+esc(v)+'</td>').join("")+'</tr>').join("")+'</tbody></table>':'<span style="color:var(--muted)">Run a DAX query to see results.</span>'}
function renderTmdlView(){const s=state.tmdlScripts.find(x=>x.id===state.activeTmdlScriptId)||state.tmdlScripts[0];if(!s)return;refs.tmdlModelExplorer.innerHTML=explorerHtml();if(document.activeElement!==refs.tmdlEditor)refs.tmdlEditor.value=s.text||"";refs.tmdlPreview.textContent=s.preview||"No pending changes."}
function renderModernEditors(){if(state.activeView==="dax")renderDaxQueryView();if(state.activeView==="tmdl")renderTmdlView()}
function renderKeytips(){document.querySelectorAll(".keytip").forEach(x=>x.remove());if(!state?.keytips)return;[...refs.ribbonTabs.querySelectorAll(".ribbonTab")].forEach((b,i)=>{const k=document.createElement("span");k.className="keytip";k.textContent=String(i+1);const r=b.getBoundingClientRect();k.style.left=(r.left+r.width/2)+"px";k.style.top=(r.bottom-7)+"px";document.body.appendChild(k)})}
function runDaxQueryState(d={}){const q=state.daxQueries.find(x=>x.id===state.activeDaxQueryId)||state.daxQueries[0];if(!q)return;q.results=clone(d.results||[["Student Count",state.tables.find(t=>t.name==="Student")?.rows?.length||0]]);state.statusText="DAX query completed"}
function scriptTmdlState(d={}){const s=state.tmdlScripts.find(x=>x.id===state.activeTmdlScriptId)||state.tmdlScripts[0];if(!s)return;const table=getTable(d.table||state.selectedTable)||state.tables[0],name=table?.name||d.object||"Student";s.text=d.text||("createOrReplace\n\ttable "+name+"\n\t\tmeasure 'Row Count' = COUNTROWS('"+name+"')\n\t\t\tformatString: #,0");s.preview="Preview: modify table "+name+" and add Row Count measure."}

function renderPages(){
 refs.pageTabs.innerHTML=state.pages.map(p=>`<button class="pageTab ${p.id===state.activePageId?"active":""}" data-page-id="${esc(p.id)}">${p.hidden?"◌ ":""}${esc(p.name)}</button>`).join("")+`<button class="pageTab" data-target="addPage">＋</button>`;
 refs.pageTabs.querySelectorAll("[data-page-id]").forEach(b=>b.onclick=()=>{state.activePageId=b.dataset.pageId;state.selectedVisualId=null;renderAll();});
}
function renderReport(){
 const p=currentPage();if(!p)return;refs.canvasState.textContent=state.canvasFit||((state.canvasZoom||100)+"%");
 refs.reportCanvas.style.width=(p.size?.width||960)+"px";refs.reportCanvas.style.height=(p.size?.height||540)+"px";refs.reportCanvas.style.background=p.background||"#fff";
 refs.reportCanvas.classList.toggle("gridOn",!!state.gridlines);
 refs.reportCanvas.style.transform=`scale(${(state.canvasZoom||100)/100})`;
 refs.reportCanvas.innerHTML=`<div class="emptyCanvas" id="emptyCanvasInner" style="${arr(p.visuals).length?"display:none":""}">Add data and visuals to build your report</div>`+arr(p.visuals).map(renderVisualHtml).join("");
 bindVisualInteractions();
 refs.reportCanvas.onclick=e=>{if(e.target!==refs.reportCanvas&& !e.target.classList.contains("emptyCanvas"))return;state.selectedVisualId=null;renderReport();renderSidePanes();};
}
function renderVisualHtml(v){
 const x=v.x??40,y=v.y??40,w=v.w??300,h=v.h??180,title=v.title||prettyType(v.type);
 const selected=v.id===state.selectedVisualId?" selected":"";const handles=["nw","n","ne","e","se","s","sw","w"].map(h=>`<span class="resizeHandle ${h}" data-handle="${h}"></span>`).join("");return `<div class="visual${selected}" data-visual-id="${esc(v.id)}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${v.z||1};${v.format?.background?`background:${esc(v.format.background)};`:""}">
 <div class="visualTitle" title="Drag to move">${esc(title)}</div><div class="visualBody">${visualBody(v)}</div>${handles}</div>`;
}
function prettyType(t){return String(t||"visual").replace(/([A-Z])/g," $1").replace(/^./,m=>m.toUpperCase());}
function visualBody(v){
 const t=v.type||"clusteredColumn",d=v.data||{};
 if(["card","kpi","multiRowCard"].includes(t))return `<div class="cardValue">${esc(d.value??v.value??"—")}</div>`;
 if(t==="table"||t==="matrix"){
  const cols=arr(d.columns);const rows=arr(d.rows);return `<div class="tableVisual"><table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${arr(r).map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
 }
 if(t==="slicer")return `<div class="slicerItems">${arr(d.items).map(x=>`<div class="slicerItem ${x.selected?"on":""}">${esc(x.label??x)}</div>`).join("")}</div>`;
 if(["pie","donut"].includes(t))return `<svg class="chartSvg" viewBox="0 0 200 120"><circle cx="75" cy="60" r="45" fill="#f2c811"/><path d="M75 60 L75 15 A45 45 0 0 1 112 88 Z" fill="#4c8bf5"/><circle cx="75" cy="60" r="${t==="donut"?20:0}" fill="var(--panel)"/></svg>`;
 if(["line","area","forecast"].includes(t))return `<svg class="chartSvg" viewBox="0 0 240 120"><polyline points="10,90 45,70 78,82 112,45 150,55 188,25 228,38" fill="${t==="area"?"rgba(242,200,17,.25)":"none"}" stroke="#d8ac00" stroke-width="3"/><line x1="10" y1="105" x2="230" y2="105" stroke="#999"/></svg>`;
 if(t==="scatter")return `<svg class="chartSvg" viewBox="0 0 240 120">${[[30,80],[70,60],[110,72],[145,40],[190,52],[215,25]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#4c8bf5"/>`).join("")}</svg>`;
 if(t==="gauge")return `<svg class="chartSvg" viewBox="0 0 220 120"><path d="M30 100 A80 80 0 0 1 190 100" fill="none" stroke="#ddd" stroke-width="18"/><path d="M30 100 A80 80 0 0 1 150 36" fill="none" stroke="#f2c811" stroke-width="18"/></svg>`;
 if(t==="funnel")return `<svg class="chartSvg" viewBox="0 0 220 120"><polygon points="20,15 200,15 170,42 50,42" fill="#f2c811"/><polygon points="50,48 170,48 145,75 75,75" fill="#d8ac00"/><polygon points="75,81 145,81 125,108 95,108" fill="#b58f00"/></svg>`;
 if(t==="decomposition")return '<div class="aiVisual"><div class="aiRoot">Average Score <b>88.7</b></div><div class="aiBranch">Department</div><div class="aiLeaves"><span>CS 88</span><span>GIS 89</span><span>Data Science 95</span></div></div>';
 if(t==="keyInfluencers")return '<div class="aiVisual"><b>What influences high scores?</b><div class="influenceRow"><span>Attendance ≥ 95%</span><i style="width:88%"></i></div><div class="influenceRow"><span>Java / Data Viz</span><i style="width:72%"></i></div><div class="influenceRow"><span>On Track status</span><i style="width:58%"></i></div></div>';
 if(t==="qna")return '<div class="qnaVisual"><div class="qnaInput">Ask a question about your data</div><div>Try: average score by course</div></div>';
 if(["map","filledMap"].includes(t))return '<svg class="chartSvg" viewBox="0 0 240 120"><path d="M25 25l55-12 45 18 55-8 35 32-20 45-62 8-44-16-60 9z" fill="#e7eef8" stroke="#8ca4bf"/><circle cx="75" cy="55" r="8" fill="#f2c811"/><circle cx="132" cy="72" r="6" fill="#4c8bf5"/><circle cx="175" cy="48" r="5" fill="#72b7b2"/></svg>';
 if(t==="treemap")return '<div class="treeMap"><span style="flex:4">Java</span><span style="flex:3">GIS</span><span style="flex:2">Data</span><span style="flex:1">Business</span></div>';

 if(["clusteredColumn","stackedColumn","clusteredBar","stackedBar"].includes(t)&&arr(d.values).length){
  const vals=arr(d.values).map(Number),cats=arr(d.categories),max=Math.max(1,...vals);
  return `<svg class="chartSvg" viewBox="0 0 300 160"><line x1="35" y1="125" x2="285" y2="125" stroke="#999"/><line x1="35" y1="15" x2="35" y2="125" stroke="#bbb"/>${vals.map((v,i)=>{const h=Math.round(v/max*92),x=65+i*95;return `<rect x="${x}" y="${125-h}" width="48" height="${h}" rx="2" fill="${i%2?"#5b8ff9":"#f2c811"}"/><text x="${x+24}" y="${119-h}" text-anchor="middle" font-size="10" fill="currentColor">${esc(v)}</text><text x="${x+24}" y="143" text-anchor="middle" font-size="10" fill="currentColor">${esc(cats[i]??"")}</text>`}).join("")}</svg>`;
 }
 return `<svg class="chartSvg" viewBox="0 0 240 120">${[50,85,62,100,74].map((h,i)=>`<rect x="${20+i*42}" y="${110-h}" width="26" height="${h}" rx="2" fill="${i===3?"#4c8bf5":"#f2c811"}"/>`).join("")}<line x1="8" y1="110" x2="232" y2="110" stroke="#999"/></svg>`;
}
function renderData(){
 const t=getTable(state.selectedTable)||state.tables[0];if(!t){refs.dataToolbar.textContent="No data loaded";refs.dataGrid.innerHTML="";return}
 state.selectedTable=t.name;refs.dataToolbar.innerHTML=`<b>${esc(t.name)}</b><span>${arr(t.rows).length} rows</span><span>${arr(t.columns).length} columns</span>`;
 const cols=arr(t.columns).map(c=>typeof c==="string"?{name:c}:c);refs.dataGrid.innerHTML=`<thead><tr>${cols.map(c=>`<th data-field="${esc(c.name)}">${esc(c.name)}<br><span style="color:var(--muted);font-size:9px">${esc(c.type||"")}</span></th>`).join("")}</tr></thead><tbody>${arr(t.rows).map(r=>`<tr>${cols.map(c=>`<td>${esc(Array.isArray(r)?r[cols.indexOf(c)]:r[c.name])}</td>`).join("")}</tr>`).join("")}</tbody>`;
}
function renderModel(){
 refs.modelCanvas.innerHTML=`<div class="modelViewToolbar"><button class="btn">Auto layout</button><button class="btn">Manage relationships</button><span class="grow"></span><span>Model layout</span><span>100%</span></div><div class="modelHint">Drag tables to arrange the model • relationship lines show cardinality</div>`;const positions={};state.tables.forEach((t,i)=>{const x=t.x??(40+(i%4)*270),y=t.y??(40+Math.floor(i/4)*280);positions[t.name]={x,y,w:210,h:40+Math.min(12,arr(t.columns).length)*26};refs.modelCanvas.insertAdjacentHTML("beforeend",`<div class="modelTable" style="left:${x}px;top:${y}px"><h4>${esc(t.name)} ${t.hidden?"◌":""}</h4><div class="modelFields">${arr(t.columns).map(c=>{const cc=typeof c==="string"?{name:c}:c;return `<div class="modelField" data-field="${esc(cc.name)}"><span>${cc.hidden?"◌":"▤"}</span><span>${esc(cc.name)}</span></div>`}).join("")}</div></div>`);});
 state.relationships.forEach(r=>{const a=positions[r.fromTable],b=positions[r.toTable];if(!a||!b)return;const x1=a.x+a.w,y1=a.y+60,x2=b.x,y2=b.y+60,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)*180/Math.PI;refs.modelCanvas.insertAdjacentHTML("beforeend",`<div class="relLine" style="left:${x1}px;top:${y1}px;width:${len}px;transform:rotate(${ang}deg);opacity:${r.active===false?.35:1}"></div><div class="relBadge" style="left:${(x1+x2)/2}px;top:${(y1+y2)/2}px">${esc(r.cardinality||"1:*")}</div>`);});
}
function renderService(){
 refs.serviceHero.innerHTML=`<h2 style="margin-top:0">Power BI Service</h2><p>Published report: <b>${esc(state.reportName)}</b></p><p>Workspace: <b>${esc(state.publish?.workspace||"My workspace")}</b></p><p>Status: ${esc(state.publish?.status||"Ready")}</p><div class="serviceActions"><button class="btn">Share</button><button class="btn">Export</button><button class="btn">Embed</button><button class="btn">Analyze in Excel</button></div>`;
}
function renderSidePanes(){
 const tabs=[["filters","Filters"],["visualizations","Visualizations"],["data","Data"]];refs.paneTabs.innerHTML=tabs.map(([id,label])=>`<button class="paneTab ${state.paneTab===id?"active":""}" data-pane="${id}">${label}</button>`).join("");
 refs.paneTabs.querySelectorAll("[data-pane]").forEach(b=>b.onclick=()=>{state.paneTab=b.dataset.pane;renderSidePanes();});
 refs.filtersPane.classList.toggle("active",state.paneTab==="filters");refs.visualizationsPane.classList.toggle("active",state.paneTab==="visualizations");refs.dataPane.classList.toggle("active",state.paneTab==="data");
 renderFiltersPane();renderVisualPane();renderDataPane();
}
function renderFiltersPane(){
 const p=currentPage(),v=currentVisual();refs.filtersPane.innerHTML=`<div class="paneTitle">Filters</div><div class="filterCard"><b>Filters on this visual</b>${arr(state.filters.visual?.[v?.id]).map(f=>`<div>${esc(f.field)}: ${esc(f.value)}</div>`).join("")||"<div style='color:var(--muted)'>Add data fields here</div>"}</div><div class="filterCard"><b>Filters on this page</b>${arr(state.filters.page?.[p?.id]).map(f=>`<div>${esc(f.field)}: ${esc(f.value)}</div>`).join("")||"<div style='color:var(--muted)'>Add data fields here</div>"}</div><div class="filterCard"><b>Filters on all pages</b>${arr(state.filters.report).map(f=>`<div>${esc(f.field)}: ${esc(f.value)}</div>`).join("")||"<div style='color:var(--muted)'>Add data fields here</div>"}</div>`;
}
const visualTypes=["clusteredBar","clusteredColumn","stackedBar","stackedColumn","line","area","combo","ribbon","waterfall","funnel","scatter","pie","donut","treemap","map","filledMap","gauge","card","kpi","table","matrix","slicer","decomposition","keyInfluencers","qna"];
function visualTypeIcon(t){
 const common='viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"';
 if(/bar/i.test(t))return '<svg '+common+'><path d="M5 6h12v3H5zm0 5h8v3H5zm0 5h15v3H5z" fill="currentColor"/></svg>';
 if(/column|waterfall|funnel/i.test(t))return '<svg '+common+'><path d="M5 17V9h3v8zm5 0V5h3v12zm5 0v-6h3v6z" fill="currentColor"/></svg>';
 if(/line|area|combo|ribbon/i.test(t))return '<svg '+common+'><polyline points="3,17 8,11 12,14 17,6 21,9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="11" r="1.3"/><circle cx="17" cy="6" r="1.3"/></svg>';
 if(/pie|donut|treemap/i.test(t))return '<svg '+common+'><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 12V4a8 8 0 016.5 12.7z" fill="currentColor"/></svg>';
 if(/scatter/i.test(t))return '<svg '+common+'><circle cx="7" cy="16" r="2"/><circle cx="11" cy="10" r="2"/><circle cx="16" cy="13" r="2"/><circle cx="19" cy="6" r="2"/></svg>';
 if(/map/i.test(t))return '<svg '+common+'><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
 if(/gauge/i.test(t))return '<svg '+common+'><path d="M5 17a7 7 0 0114 0M12 17l4-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
 if(/card|kpi/i.test(t))return '<svg '+common+'><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 10h7M7 14h10" stroke="currentColor" stroke-width="1.5"/></svg>';
 if(/table|matrix/i.test(t))return '<svg '+common+'><path d="M4 5h16v14H4zM4 10h16M10 5v14" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
 if(/slicer/i.test(t))return '<svg '+common+'><path d="M4 5h16l-6 7v6l-4 2v-8z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
 if(/decomposition|influencer|qna/i.test(t))return '<svg '+common+'><path d="M12 3l1.4 4.1L18 9l-4.1 1.4L12 15l-1.4-4.1L6 9l4.1-1.9zM18 15l.7 2 2.1.8-2.1.7-.7 2.1-.8-2.1-2-.7 2-.8z" fill="currentColor"/></svg>';
 return window.PBI_ICON?window.PBI_ICON("visual",18):"▥";
}

function renderVisualPane(){
 const v=currentVisual();refs.visualizationsPane.innerHTML=`<div class="paneTitle">Build visual</div><div class="visualGallery">${visualTypes.map(t=>`<button class="visualTypeBtn ${v?.type===t?"active":""}" title="${esc(prettyType(t))}" data-vtype="${t}">${visualTypeIcon(t)}</button>`).join("")}</div><div class="paneTitle">Field wells</div>${["x","y","legend","values","tooltips"].map(w=>`<div class="well"><div class="wellLabel">${w.toUpperCase()}</div>${arr(v?.fields?.[w]).map(f=>`<div class="chip">${esc(f)}</div>`).join("")}</div>`).join("")}<div class="paneTitle">Format visual</div><div class="filterCard">Title • Background • Border • Shadow • Data colors • Labels • Axes • Legend</div>`;
 refs.visualizationsPane.querySelectorAll("[data-vtype]").forEach(b=>b.onclick=()=>{if(v){v.type=b.dataset.vtype;renderAll();}});
}
function renderDataPane(){
 refs.dataPane.innerHTML=`<div class="paneTitleRow"><b>Data</b><span>⋯</span></div><div class="fieldSearch">⌕ Search</div>${state.tables.length?state.tables.map(t=>`<div class="fieldTable"><div class="fieldTableHead"><span><span class="chev">⌄</span> ▦ ${esc(t.name)}</span><span>⋯</span></div>${arr(t.columns).map(c=>{const cc=typeof c==="string"?{name:c}:c;const numeric=/number|int|decimal/i.test(cc.type||"");return `<div class="field" data-field="${esc(cc.name)}"><span class="fieldCheck">□</span><span class="fieldIcon">${numeric?"∑":"ABC"}</span><span>${esc(cc.name)}</span></div>`}).join("")}</div>`).join(""):'<div class="emptyPaneState"><b>No data yet</b><span>Use Get data to connect to a source.</span></div>'}${state.measures.length?`<div class="fieldTable"><div class="fieldTableHead">ƒ Measures</div>${state.measures.map(m=>`<div class="field"><span>□</span><span>ƒ</span><span>${esc(m.name)}</span></div>`).join("")}</div>`:""}`;
}
function renderPowerQuery(){
 refs.powerQuery.classList.toggle("show",!!state.powerQueryOpen);if(!state.powerQueryOpen)return;
 refs.formulaBar.style.display=state.formulaBar===false?"none":"flex";const q=getQuery(state.selectedQuery)||state.queries[0];if(q)state.selectedQuery=q.name;
 refs.pqRibbon.innerHTML=["Close & Apply","New Source","Recent Sources","Enter Data","Manage Parameters","Choose Columns","Remove Columns","Keep Rows","Remove Rows","Split Column","Group By","Merge Queries","Append Queries"].map(x=>`<button class="btn">${x}</button>`).join("");
 refs.pqQueries.innerHTML=state.queries.map(x=>`<div class="pqQuery ${q&&x.name===q.name?"active":""}" data-query-id="${esc(x.name)}">${esc(x.name)}${x.enableLoad===false?" ◌":""}</div>`).join("");
 refs.pqQueries.querySelectorAll("[data-query-id]").forEach(el=>el.onclick=()=>{state.selectedQuery=el.dataset.queryId;renderPowerQuery();});
 if(!q){refs.pqGrid.innerHTML="";refs.appliedSteps.innerHTML="";refs.formulaBar.textContent="fx =";return}
 refs.formulaBar.textContent="fx = "+(q.formula||q.steps?.[q.activeStep??(q.steps?.length-1)]?.formula||"Source");
 const cols=arr(q.columns).map(c=>typeof c==="string"?{name:c}:c);refs.pqGrid.innerHTML=`<thead><tr>${cols.map(c=>`<th data-field="${esc(c.name)}">${esc(c.name)}<div style="font-size:8px;color:var(--muted)">${esc(c.type||"Any")}</div></th>`).join("")}</tr></thead><tbody>${arr(q.rows).map(r=>`<tr>${cols.map((c,i)=>`<td>${esc(Array.isArray(r)?r[i]:r[c.name])}</td>`).join("")}</tr>`).join("")}</tbody>`;
 refs.appliedSteps.innerHTML=arr(q.steps).map((s,i)=>`<div class="step ${i===(q.activeStep??q.steps.length-1)?"active":""}" data-step-index="${i}">${esc(s.name||s.action||"Step")}</div>`).join("");
}
function addStep(q,name,action,data={}){q.steps=arr(q.steps);q.steps.push({name,action,data,formula:data.formula});q.activeStep=q.steps.length-1;}
function transformQuery(action,d){
 const q=getQuery(d.query||state.selectedQuery)||state.queries[0];if(!q)return;state.selectedQuery=q.name;q.columns=arr(q.columns).map(c=>typeof c==="string"?{name:c,type:"Any"}:c);q.rows=arr(q.rows);
 const colIndex=name=>q.columns.findIndex(c=>c.name===name);
 const ci=colIndex(d.column);
 if(action==="removeColumn"&&ci>=0){q.columns.splice(ci,1);q.rows=q.rows.map(r=>Array.isArray(r)?r.filter((_,i)=>i!==ci):Object.fromEntries(Object.entries(r).filter(([k])=>k!==d.column)));}
 else if(action==="chooseColumns"){const keep=arr(d.columns);const idx=q.columns.map((c,i)=>keep.includes(c.name)?i:-1).filter(i=>i>=0);q.columns=q.columns.filter(c=>keep.includes(c.name));q.rows=q.rows.map(r=>Array.isArray(r)?idx.map(i=>r[i]):Object.fromEntries(keep.map(k=>[k,r[k]])));}
 else if(action==="renameColumn"&&ci>=0){const old=q.columns[ci].name;q.columns[ci].name=d.newName;q.rows=q.rows.map(r=>Array.isArray(r)?r:Object.fromEntries(Object.entries(r).map(([k,v])=>[k===old?d.newName:k,v])));}
 else if(action==="reorderColumn"&&ci>=0){const [c]=q.columns.splice(ci,1);q.columns.splice(Math.max(0,Math.min(d.index??0,q.columns.length)),0,c);}
 else if(action==="changeDataType"&&ci>=0)q.columns[ci].type=d.type||"Text";
 else if(action==="detectDataType")q.columns.forEach(c=>{if(!c.type||c.type==="Any")c.type="Text"});
 else if(action==="replaceValues"&&ci>=0)q.rows=q.rows.map(r=>{const rr=Array.isArray(r)?r.slice():{...r};if(Array.isArray(rr)){if(rr[ci]===d.find)rr[ci]=d.replace}else if(rr[d.column]===d.find)rr[d.column]=d.replace;return rr});
 else if(action==="replaceErrors"&&ci>=0)q.rows=q.rows.map(r=>{const rr=Array.isArray(r)?r.slice():{...r};const v=Array.isArray(rr)?rr[ci]:rr[d.column];if(v==="#ERROR"||v instanceof Error){if(Array.isArray(rr))rr[ci]=d.value;else rr[d.column]=d.value}return rr});
 else if(action==="removeErrors"&&ci>=0)q.rows=q.rows.filter(r=>{const v=Array.isArray(r)?r[ci]:r[d.column];return v!=="#ERROR"});
 else if(action==="removeBlankRows")q.rows=q.rows.filter(r=>arr(Array.isArray(r)?r:Object.values(r)).some(v=>v!==""&&v!=null));
 else if(action==="removeTopRows")q.rows=q.rows.slice(Math.max(0,d.count||1));
 else if(action==="removeBottomRows")q.rows=q.rows.slice(0,Math.max(0,q.rows.length-(d.count||1)));
 else if(action==="keepTopRows")q.rows=q.rows.slice(0,d.count||1);
 else if(action==="keepBottomRows")q.rows=q.rows.slice(-(d.count||1));
 else if(action==="removeDuplicates"){const seen=new Set();q.rows=q.rows.filter(r=>{const k=JSON.stringify(r);if(seen.has(k))return false;seen.add(k);return true});}
 else if(action==="keepDuplicates"){const count={};q.rows.forEach(r=>count[JSON.stringify(r)]=(count[JSON.stringify(r)]||0)+1);q.rows=q.rows.filter(r=>count[JSON.stringify(r)]>1);}
 else if(action==="filterRows"&&ci>=0)q.rows=q.rows.filter(r=>{const v=Array.isArray(r)?r[ci]:r[d.column];if(d.operator==="contains")return String(v).includes(d.value);if(d.operator==="notEquals")return v!==d.value;if(d.operator==="gt")return Number(v)>Number(d.value);if(d.operator==="lt")return Number(v)<Number(d.value);return v===d.value});
 else if(action==="sortRows"&&ci>=0)q.rows.sort((a,b)=>{const av=Array.isArray(a)?a[ci]:a[d.column],bv=Array.isArray(b)?b[ci]:b[d.column];return (av>bv?1:av<bv?-1:0)*(d.direction==="desc"?-1:1)});
 else if(action==="splitColumn"&&ci>=0){const n1=d.newColumns?.[0]||d.column+".1",n2=d.newColumns?.[1]||d.column+".2";q.columns.splice(ci,1,{name:n1,type:"Text"},{name:n2,type:"Text"});q.rows=q.rows.map(r=>{const rr=Array.isArray(r)?r.slice():Object.values(r);const parts=String(rr[ci]??"").split(d.delimiter||" ");rr.splice(ci,1,parts[0]||"",parts.slice(1).join(d.delimiter||" "));return rr});}
 else if(action==="mergeColumns"){const names=arr(d.columns),idxs=names.map(colIndex).filter(i=>i>=0).sort((a,b)=>a-b);if(idxs.length){const first=idxs[0],newName=d.newName||"Merged";q.rows=q.rows.map(r=>{const rr=Array.isArray(r)?r.slice():Object.values(r);const val=idxs.map(i=>rr[i]).join(d.separator||" ");for(let j=idxs.length-1;j>=0;j--)rr.splice(idxs[j],1);rr.splice(first,0,val);return rr});q.columns=q.columns.filter((_,i)=>!idxs.includes(i));q.columns.splice(first,0,{name:newName,type:"Text"});}}
 else if(["trimColumn","cleanColumn","transformCase","fillDown","fillUp","extractText","parseDate"].includes(action)&&ci>=0){let last=null;q.rows=q.rows.map((r,ri)=>{const rr=Array.isArray(r)?r.slice():{...r};let v=Array.isArray(rr)?rr[ci]:rr[d.column];if(action==="trimColumn")v=String(v??"").trim();if(action==="cleanColumn")v=String(v??"").replace(/[\x00-\x1F]/g,"");if(action==="transformCase"){const mode=d.mode||"upper";v=mode==="lower"?String(v).toLowerCase():mode==="proper"?String(v).replace(/\b\w/g,m=>m.toUpperCase()):String(v).toUpperCase();}if(action==="fillDown"){if(v==null||v==="")v=last;else last=v}if(action==="fillUp"&&(v==null||v==="")){for(let j=ri+1;j<q.rows.length;j++){const n=Array.isArray(q.rows[j])?q.rows[j][ci]:q.rows[j][d.column];if(n!=null&&n!==""){v=n;break}}}if(action==="extractText")v=String(v??"").slice(d.start||0,d.length?((d.start||0)+d.length):undefined);if(action==="parseDate")v=String(v??"");if(Array.isArray(rr))rr[ci]=v;else rr[d.column]=v;return rr});}
 else if(action==="promoteHeaders"&&q.rows.length){const first=Array.isArray(q.rows[0])?q.rows[0]:Object.values(q.rows[0]);q.columns=first.map((x,i)=>({name:String(x||`Column${i+1}`),type:q.columns[i]?.type||"Any"}));q.rows=q.rows.slice(1);}
 else if(action==="demoteHeaders"){q.rows.unshift(q.columns.map(c=>c.name));q.columns=q.columns.map((_,i)=>({name:`Column${i+1}`,type:"Any"}));}
 else if(action==="transposeTable"){const matrix=[q.columns.map(c=>c.name),...q.rows.map(r=>Array.isArray(r)?r:Object.values(r))];const tr=matrix[0].map((_,i)=>matrix.map(row=>row[i]));q.columns=tr.shift().map((_,i)=>({name:`Column${i+1}`,type:"Any"}));q.rows=tr;}
 else if(action==="reverseRows")q.rows.reverse();
 else if(action==="addCustomColumn"||action==="addConditionalColumn"||action==="addIndexColumn"||action==="duplicateColumn"){const name=d.newName||d.name||(action==="addIndexColumn"?"Index":"Custom");q.columns.push({name,type:d.type||"Any"});q.rows=q.rows.map((r,i)=>{const rr=Array.isArray(r)?r.slice():Object.values(r);let v=d.value??"";if(action==="addIndexColumn")v=(d.start||0)+i*(d.increment||1);if(action==="duplicateColumn"&&ci>=0)v=rr[ci];if(action==="addConditionalColumn"&&ci>=0)v=(rr[ci]===d.equals?d.then:d.else);rr.push(v);return rr});}
 else if(action==="groupBy"&&ci>=0){const groups=new Map();q.rows.forEach(r=>{const v=Array.isArray(r)?r[ci]:r[d.column];groups.set(v,(groups.get(v)||0)+1)});q.columns=[{name:d.column,type:q.columns[ci].type},{name:d.newColumn||"Count",type:"Whole Number"}];q.rows=[...groups.entries()];}
 else if(action==="pivotColumn"||action==="unpivotColumns"){q.formula=action==="pivotColumn"?"Table.Pivot(...)":"Table.Unpivot(...)";}
 addStep(q,d.stepName||prettyType(action),action,d);state.statusText=prettyType(action)+" applied";
}
function addVisualState(d){
 const p=currentPage();if(!p)return null;p.visuals=arr(p.visuals);const w=d.w??300,h=d.h??180,pos=(d.x!==undefined||d.y!==undefined)?{x:d.x??50,y:d.y??50}:smartVisualPosition(p,w,h,50,50);const v={id:d.id||uid("vis"),type:d.type||"clusteredColumn",title:d.title||prettyType(d.type||"clusteredColumn"),x:pos.x,y:pos.y,w,h,z:d.z||p.visuals.length+1,fields:clone(d.fields||{}),data:clone(d.data||{}),format:clone(d.format||{}),tooltip:d.tooltip||null,drillLevel:0};p.visuals.push(v);state.selectedVisualId=v.id;return v;
}
function showGetData(){
  const selected=state.selectedConnector||"";
  const cats=["All","File","Database","Microsoft Fabric","Power Platform","Azure","Online Services","Other"];
  const icons={Excel:"excel","Text/CSV":"file",JSON:"file",Folder:"folder","SQL Server":"database",PostgreSQL:"database",Web:"globe",OData:"globe","SharePoint Folder":"folder",OneLake:"cloud",Dataflows:"cloud","Enter Data":"table"};
  showModal("Get data",`<div class="getDataShell"><aside class="getDataCats"><div class="getDataSearch">⌕ Search data sources</div>${cats.map((x,i)=>`<div class="getDataCat ${i===0?"active":""}">${esc(x)}</div>`).join("")}</aside><section class="getDataMain"><div class="getDataHead"><b>Common data sources</b><span>Connect to data used by your report</span></div><div class="connectorGrid">${state.connectors.map(c=>`<div class="connector ${c===selected?"selected":""}"><span class="connectorIcon">${window.PBI_ICON?window.PBI_ICON(icons[c]||"database",24):"▦"}</span><span><b>${esc(c)}</b><small>${c==="SQL Server"?"Microsoft SQL Server database":c==="Excel"?"Excel workbook":c==="Web"?"Web data source":"Data source"}</small></span></div>`).join("")}</div></section></div>`,[{label:"Cancel"},{label:"Connect",primary:true}]);
 }
function showNavigator(){
  const selected=state.navigator.selected||[];
  const preview=state.navigator.preview||state.navigator.items?.[0]?.name||state.navigator.items?.[0]||"";
  const sample=preview==="Course"?[["id","course_name"],[101,"Java"],[102,"Database"]]:[["id","name","course_id","score"],[1,"Asha",101,92],[2,"Ravi",102,84],[3,"Maya",101,96]];
  showModal("Navigator",`<div class="navigatorShell"><aside class="navigatorLeft"><div class="navSource">▦ ${esc(state.sources.at(-1)?.name||"JavaPracticeDb")}</div><label class="navSelectAll"><input type="checkbox"> Select multiple items</label>${state.navigator.items.map(x=>{const n=x.name||x;return `<div class="navItem ${n===preview?"selected":""}"><input type="checkbox" ${selected.includes(n)?"checked":""}><span>▦</span><span>${esc(n)}</span></div>`}).join("")}</aside><section class="navigatorPreview"><div class="previewTitle"><b>${esc(preview||"Preview")}</b><span>Table preview</span></div><table class="previewGrid"><thead><tr>${sample[0].map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${sample.slice(1).map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></section></div>`,[{label:"Cancel"},{label:"Transform Data"},{label:"Load",primary:true}]);
 }
function showRelationships(){showModal("Manage relationships",`<div>${state.relationships.map(r=>`<div class="filterCard">${esc(r.fromTable)}[${esc(r.fromColumn)}] → ${esc(r.toTable)}[${esc(r.toColumn)}] • ${esc(r.cardinality||"1:*")}</div>`).join("")||"No relationships"}</div>`);}
function showPublish(){showModal("Publish to Power BI",`<p>Choose a destination workspace.</p><div class="filterCard">My workspace</div><div class="filterCard">Analytics Workspace</div>`);}
function showLearningMap(){const total=Object.values(FEATURE_CATALOG).flat().length;showModal(`Power BI Learning Map — ${total} features`,`<div class="learningMap">${Object.entries(FEATURE_CATALOG).map(([cat,list])=>`<div class="learnCat"><div class="learnHead">${esc(cat)} <span style="float:right">${list.length}</span></div>${list.map(f=>`<div class="learnItem" data-feature="${esc(f)}">${esc(f)}</div>`).join("")}</div>`).join("")}</div>`,[{label:"Close",primary:true}]);}
function addOrReplaceFilter(scope,d){
 const f={field:d.field||"Field",value:d.value,operator:d.operator||"equals",mode:d.mode||"basic"},p=currentPage(),v=currentVisual();
 if(scope==="report"){state.filters.report=state.filters.report.filter(x=>x.field!==f.field);state.filters.report.push(f);}
 if(scope==="page"){state.filters.page[p.id]=arr(state.filters.page[p.id]).filter(x=>x.field!==f.field);state.filters.page[p.id].push(f);}
 if(scope==="visual"&&v){state.filters.visual[v.id]=arr(state.filters.visual[v.id]).filter(x=>x.field!==f.field);state.filters.visual[v.id].push(f);}
}
function prepareReplayStep(step){
 clearTransient();closePowerQueryIfNeeded(step.action);
 if(step.action!=="publishReport"&&step.action!=="selectWorkspace"&&step.action!=="completePublish"){state.publish.dialog=false;}
}
async function maybeType(target,text,animate,token){
 if(!target)return;if(!(animate&&autoType)){target.value=text;target.dispatchEvent(new Event("input",{bubbles:true}));return}
 target.value="";const chars=[...String(text)];const delay=Math.min(18,Math.max(1,900/Math.max(1,chars.length)));for(const c of chars){if(token!==seekToken)return;target.value+=c;target.dispatchEvent(new Event("input",{bubbles:true}));await new Promise(r=>setTimeout(r,delay));}
}
async function applyStep(step,animate,token){
 if(token!==seekToken||(step.app&&step.app!==APP_ID))return;const a=step.action,d=step.data||{};prepareReplayStep(step);
 if(a==="showHome"){state.activeView="report";state.serviceOpen=false;state.statusText="Home";}
 else if(a==="newBlankReport"){state=normalize(Object.assign(emptyState(),{reportName:d.name||"Untitled",title:(d.name||"Untitled")+" - Power BI Desktop",theme:state.theme}));}
 else if(a==="openReport"){state.reportName=d.report||d.name||state.reportName;state.title=state.reportName+" - Power BI Desktop";state.activeView="report";state.serviceOpen=false;}
 else if(a==="saveReport"||a==="saveReportAs"){if(d.name)state.reportName=d.name;if(d.fileName)state.reportName=d.fileName.replace(/\.pbix$/i,"");state.title=state.reportName+" - Power BI Desktop";state.statusText="Saved";}
 else if(a==="openFileMenu")showModal("File",`<div class="filterCard">New</div><div class="filterCard">Open report</div><div class="filterCard">Save</div><div class="filterCard">Save As</div><div class="filterCard">Options and settings</div>`);
 else if(a==="openOptions")showModal("Options",`<div class="filterCard">Global</div><div class="filterCard">Current File</div><div class="filterCard">Preview features</div>`);
 else if(a==="openGetData")showGetData();
 else if(a==="selectConnector"){state.selectedConnector=d.connector;showGetData();}
 else if(a==="setConnection")state.connection=clone(d);
 else if(a==="connectDataSource"){state.sources.push(clone(d.source||{name:d.name||state.selectedConnector||"Source",connector:state.selectedConnector}));state.navigator.items=clone(d.items||state.navigator.items);state.statusText="Connected";showModal("SQL Server database",`<div class="connectionForm"><label>Server</label><div class="inputLike">localhost</div><label>Database (optional)</label><div class="inputLike">${esc(d.source?.name||"JavaPracticeDb")}</div><label>Data Connectivity mode</label><div class="modeCards"><div class="modeCard active"><b>Import</b><span>Copy data into the Power BI model</span></div><div class="modeCard"><b>DirectQuery</b><span>Query the source when visuals run</span></div></div></div>`,[{label:"Cancel"},{label:"OK",primary:true}]);}
 else if(a==="openNavigator")showNavigator();
 else if(a==="selectNavigatorItem"){const name=d.name||d.item;if(!state.navigator.selected.includes(name))state.navigator.selected.push(name);}
 else if(a==="selectAllNavigatorItems")state.navigator.selected=state.navigator.items.map(x=>x.name||x);
 else if(a==="previewNavigatorItem"){state.navigator.preview=d.name||d.item;showNavigator();}
 else if(a==="loadNavigatorSelection"){if(d.tables)state.tables.push(...clone(d.tables));if(d.queries)state.queries.push(...clone(d.queries));refs.modalShade.classList.remove("show");state.statusText="Data loaded";}
 else if(a==="transformNavigatorSelection"){if(d.queries)state.queries.push(...clone(d.queries));state.selectedQuery=d.queries?.[0]?.name||state.queries[0]?.name||null;state.powerQueryOpen=true;refs.modalShade.classList.remove("show");state.statusText="Power Query Editor";}
 else if(a==="cancelNavigator")refs.modalShade.classList.remove("show");
 else if(a==="openRecentSources")showModal("Recent Sources",`<div>${state.sources.map(s=>`<div class="filterCard">${esc(s.name||s.connector)}</div>`).join("")||"No recent sources"}</div>`);
 else if(a==="enterData"){const t=clone(d.table||{name:d.name||"Table1",columns:d.columns||[],rows:d.rows||[]});state.tables.push(t);state.queries.push({id:t.id||t.name,name:t.name,columns:clone(t.columns),rows:clone(t.rows),steps:[{name:"Source",action:"source"}]});state.selectedTable=t.name;}
 else if(a==="openDataSourceSettings")showModal("Data source settings",`<div>${state.sources.map(s=>`<div class="filterCard">${esc(s.name||s.connector)}</div>`).join("")||"No data sources"}</div>`);
 else if(a==="openPowerQuery"){state.powerQueryOpen=true;state.selectedQuery=d.query||state.selectedQuery||state.queries[0]?.name;}
 else if(a==="selectQuery")state.selectedQuery=d.query||d.name;
 else if(a==="refreshPreview"){state.statusText="Preview refreshed";const q=getQuery(d.query||state.selectedQuery);if(q&&d.rows)q.rows=clone(d.rows);}
 else if(a==="toggleFormulaBar")state.formulaBar=d.value!==undefined?!!d.value:!state.formulaBar;
 else if(a==="openAdvancedEditor"){const q=getQuery(d.query||state.selectedQuery);showModal("Advanced Editor",`<textarea class="codeArea" id="advancedEditorBox">${esc(d.m||q?.m||"let\n    Source = ...\nin\n    Source")}</textarea>`,[{label:"Cancel"},{label:"Done",primary:true}]);if(d.m&&animate&&autoType)await maybeType($("advancedEditorBox"),d.m,true,token);}
 else if(["removeColumn","chooseColumns","renameColumn","reorderColumn","changeDataType","detectDataType","replaceValues","replaceErrors","removeErrors","removeBlankRows","removeTopRows","removeBottomRows","keepTopRows","keepBottomRows","removeDuplicates","keepDuplicates","filterRows","sortRows","splitColumn","mergeColumns","trimColumn","cleanColumn","transformCase","fillDown","fillUp","promoteHeaders","demoteHeaders","transposeTable","reverseRows","addCustomColumn","addConditionalColumn","addIndexColumn","duplicateColumn","extractText","parseDate","groupBy","pivotColumn","unpivotColumns"].includes(a))transformQuery(a,d);
 else if(["mergeQueries","appendQueries"].includes(a)){const q=getQuery(d.query||state.selectedQuery),other=getQuery(d.other);if(q&&other){if(a==="appendQueries")q.rows=[...arr(q.rows),...clone(arr(other.rows))];else q.columns=[...arr(q.columns),...arr(other.columns).filter(c=>!arr(q.columns).some(x=>(x.name||x)===(c.name||c)))];addStep(q,prettyType(a),a,d);}}
 else if(a==="duplicateQuery"||a==="referenceQuery"){const q=getQuery(d.query||state.selectedQuery);if(q){const nq=clone(q);nq.name=d.newName||q.name+(a==="duplicateQuery"?" Copy":" Reference");nq.id=nq.name;state.queries.push(nq);state.selectedQuery=nq.name;}}
 else if(a==="renameQuery"){const q=getQuery(d.query||state.selectedQuery);if(q){q.name=d.newName;state.selectedQuery=d.newName;}}
 else if(a==="deleteQuery"){state.queries=state.queries.filter(q=>q.name!==(d.query||state.selectedQuery));state.selectedQuery=state.queries[0]?.name||null;}
 else if(a==="selectAppliedStep"){const q=getQuery(d.query||state.selectedQuery);if(q)q.activeStep=d.index??0;}
 else if(a==="deleteAppliedStep"){const q=getQuery(d.query||state.selectedQuery);if(q){q.steps.splice(d.index??q.steps.length-1,1);q.activeStep=Math.max(0,q.steps.length-1);}}
 else if(a==="moveAppliedStep"){const q=getQuery(d.query||state.selectedQuery);if(q){const from=d.from??q.steps.length-1,to=Math.max(0,Math.min(d.to??0,q.steps.length-1));const [s]=q.steps.splice(from,1);if(s)q.steps.splice(to,0,s);q.activeStep=to;}}
 else if(a==="toggleColumnQuality")state.columnQuality=d.value!==undefined?!!d.value:!state.columnQuality;
 else if(a==="toggleColumnDistribution")state.columnDistribution=d.value!==undefined?!!d.value:!state.columnDistribution;
 else if(a==="toggleColumnProfile")state.columnProfile=d.value!==undefined?!!d.value:!state.columnProfile;
 else if(a==="profileColumn"){state.profile={column:d.column,distinct:d.distinct,unique:d.unique,empty:d.empty,error:d.error};state.statusText="Column profile ready";}
 else if(a==="closeAndApply"){state.powerQueryOpen=false;if(d.tables)state.tables=clone(d.tables);else state.queries.forEach(q=>{let t=getTable(q.name);if(t){t.columns=clone(q.columns);t.rows=clone(q.rows);}else state.tables.push({name:q.name,columns:clone(q.columns),rows:clone(q.rows)});});state.activeView="report";state.selectedTable=state.tables[0]?.name||null;state.paneTab="data";state.statusText="Changes applied • "+state.tables.length+" tables loaded";showToast("Changes applied to the model");}
 else if(a==="discardQueryChanges"){state.powerQueryOpen=false;state.queries=clone(baseline?.queries||[]);}
 else if(a==="openDataView"){state.activeView="data";state.serviceOpen=false;state.selectedTable=d.table||state.selectedTable||state.tables[0]?.name;}
 else if(a==="selectDataTable")state.selectedTable=d.table||d.name;
 else if(a==="sortDataColumn"){const t=getTable(d.table||state.selectedTable);if(t){const cols=arr(t.columns).map(c=>typeof c==="string"?c:c.name),i=cols.indexOf(d.column);t.rows.sort((a,b)=>{const av=Array.isArray(a)?a[i]:a[d.column],bv=Array.isArray(b)?b[i]:b[d.column];return(av>bv?1:av<bv?-1:0)*(d.direction==="desc"?-1:1)});}}
 else if(a==="filterDataColumn")state.dataFilter=clone(d);
 else if(["setColumnFormat","setSummarization","setDataCategory"].includes(a)){const t=getTable(d.table||state.selectedTable);if(t){const c=arr(t.columns).find(x=>(typeof x==="string"?x:x.name)===d.column);if(c&&typeof c==="object")c[a==="setColumnFormat"?"format":a==="setSummarization"?"summarization":"dataCategory"]=d.value;}}
 else if(a==="openModelView"){state.activeView="model";state.serviceOpen=false;}
 else if(a==="addRelationship")state.relationships.push(clone(d.relationship||d));
 else if(["editRelationship","setRelationshipCardinality","setCrossFilterDirection","setRelationshipActive"].includes(a)){const r=state.relationships.find(x=>x.id===d.id||(`${x.fromTable}.${x.fromColumn}>${x.toTable}.${x.toColumn}`===d.id));if(r){if(a==="editRelationship")Object.assign(r,clone(d.values||d.relationship||{}));if(a==="setRelationshipCardinality")r.cardinality=d.value;if(a==="setCrossFilterDirection")r.crossFilter=d.value;if(a==="setRelationshipActive")r.active=!!d.value;}}
 else if(a==="deleteRelationship")state.relationships=state.relationships.filter(r=>r.id!==d.id);
 else if(a==="openManageRelationships")showRelationships();
 else if(a==="hideTable"){const t=getTable(d.table);if(t)t.hidden=d.value!==false;}
 else if(a==="hideField"){const t=getTable(d.table);if(t){const c=t.columns.find(x=>(x.name||x)===d.field);if(c&&typeof c==="object")c.hidden=d.value!==false;}}
 else if(a==="sortByColumn"){const t=getTable(d.table);if(t)t.sortBy=t.sortBy||{},t.sortBy[d.column]=d.by;}
 else if(a==="markDateTable"){const t=getTable(d.table);if(t)t.dateTable=!!(d.value??true);}
 else if(a==="setTableProperty"){const t=getTable(d.table);if(t)t.properties=Object.assign(t.properties||{},{[d.property]:d.value});}
 else if(a==="setFieldProperty"){const t=getTable(d.table);if(t){const c=t.columns.find(x=>(x.name||x)===d.field);if(c&&typeof c==="object")c[d.property]=d.value;}}
 else if(a==="createHierarchy")state.hierarchies.push({id:d.id||uid("hier"),name:d.name,table:d.table,levels:arr(d.levels)});
 else if(a==="addHierarchyLevel"){const h=state.hierarchies.find(x=>x.id===d.id||x.name===d.hierarchy);if(h)h.levels.push(d.field);}
 else if(a==="renameHierarchy"){const h=state.hierarchies.find(x=>x.id===d.id||x.name===d.hierarchy);if(h)h.name=d.newName;}
 else if(a==="setTableStorageMode"){const t=getTable(d.table);if(t)t.storageMode=d.mode;state.storageMode=d.mode||state.storageMode;}
 else if(a==="createMeasure"){const m={id:d.id||uid("m"),name:d.name||"Measure",table:d.table||"Measures",dax:d.dax||"",format:d.format||"",folder:d.folder||""};state.measures.push(m);state.selectedMeasure=m.name;if(d.dax&&animate&&autoType){showModal("New measure",`<textarea class="codeArea" id="daxBox"></textarea>`);await maybeType($("daxBox"),d.dax,true,token);}}
 else if(a==="editDax"){const m=getMeasure(d.name||d.measure);if(m)m.dax=d.dax||"";if(d.dax&&animate&&autoType){showModal("Formula bar",`<textarea class="codeArea" id="daxBox"></textarea>`);await maybeType($("daxBox"),d.dax,true,token);}}
 else if(a==="deleteMeasure")state.measures=state.measures.filter(m=>m.name!==(d.name||d.measure));
 else if(a==="createCalculatedColumn")state.calculatedColumns.push(clone({id:d.id||uid("cc"),...d}));
 else if(a==="createCalculatedTable"){state.calculatedTables.push(clone({id:d.id||uid("ct"),...d}));if(d.table)state.tables.push(clone(d.table));}
 else if(a==="formatMeasure"){const m=getMeasure(d.name||d.measure);if(m)m.format=d.format;}
 else if(a==="setMeasureDisplayFolder"){const m=getMeasure(d.name||d.measure);if(m)m.folder=d.folder;}
 else if(a==="validateDax"){state.daxValidation={dax:d.dax,valid:d.valid!==false,message:d.message||"Expression is valid"};state.statusText=state.daxValidation.message;}
 else if(a==="openReportView"){state.activeView="report";state.serviceOpen=false;}
 else if(a==="addPage"){const p={id:d.id||uid("page"),name:d.name||`Page ${state.pages.length+1}`,hidden:false,visuals:[],background:"#fff",wallpaper:"#d4d4d4",size:{width:960,height:540}};state.pages.push(p);state.activePageId=p.id;}
 else if(a==="renamePage"){const p=state.pages.find(x=>x.id===(d.id||state.activePageId));if(p)p.name=d.name;}
 else if(a==="duplicatePage"){const p=state.pages.find(x=>x.id===(d.id||state.activePageId));if(p){const n=clone(p);n.id=d.newId||uid("page");n.name=d.name||p.name+" Copy";n.visuals=n.visuals.map(v=>Object.assign(v,{id:uid("vis")}));state.pages.push(n);state.activePageId=n.id;}}
 else if(a==="deletePage"){const id=d.id||state.activePageId;state.pages=state.pages.filter(p=>p.id!==id);if(!state.pages.length)state.pages.push(emptyState().pages[0]);state.activePageId=state.pages[0].id;}
 else if(a==="hidePage"){const p=state.pages.find(x=>x.id===(d.id||state.activePageId));if(p)p.hidden=d.value!==false;}
 else if(a==="selectPage"){state.activePageId=d.id;state.selectedVisualId=null;}
 else if(a==="setCanvasZoom")state.canvasZoom=d.value||d.zoom||100;
 else if(a==="setCanvasFit")state.canvasFit=d.value||"Fit to page";
 else if(a==="setPageSize"){const p=currentPage();if(p)p.size={width:d.width||960,height:d.height||540};}
 else if(a==="setPageBackground"){const p=currentPage();if(p)p.background=d.value||d.color;}
 else if(a==="setWallpaper"){const p=currentPage();if(p)p.wallpaper=d.value||d.color;}
 else if(a==="toggleGridlines")state.gridlines=d.value!==undefined?!!d.value:!state.gridlines;
 else if(a==="toggleSnapToGrid")state.snapToGrid=d.value!==undefined?!!d.value:!state.snapToGrid;
 else if(a==="toggleLockObjects")state.lockObjects=d.value!==undefined?!!d.value:!state.lockObjects;
 else if(a==="addVisual")addVisualState(d);
 else if(a==="selectVisual")state.selectedVisualId=d.id;
 else if(a==="deleteVisual"){const p=currentPage(),id=d.id||state.selectedVisualId;p.visuals=p.visuals.filter(v=>v.id!==id);state.selectedVisualId=null;}
 else if(a==="duplicateVisual"||a==="copyVisual"||a==="pasteVisual"){const p=currentPage();if(a==="copyVisual")clipboardVisual=clone(getVisual(d.id||state.selectedVisualId));else if(a==="pasteVisual"&&clipboardVisual){const n=clone(clipboardVisual);n.id=d.id||uid("vis");const pos=smartVisualPosition(p,n.w||300,n.h||180,(n.x||0)+24,(n.y||0)+24);n.x=pos.x;n.y=pos.y;n.z=Math.max(1,...p.visuals.map(v=>v.z||1))+1;p.visuals.push(n);state.selectedVisualId=n.id;}else{const v=getVisual(d.id||state.selectedVisualId);if(v){const n=clone(v);n.id=d.newId||uid("vis");const pos=smartVisualPosition(p,n.w||300,n.h||180,(n.x||0)+24,(n.y||0)+24);n.x=pos.x;n.y=pos.y;n.z=Math.max(1,...p.visuals.map(v=>v.z||1))+1;p.visuals.push(n);state.selectedVisualId=n.id;}}}
 else if(a==="moveVisual"){const v=getVisual(d.id||state.selectedVisualId),p=currentPage();if(v&&p){const w=v.w||300,h=v.h||180,pw=p.size?.width||960,ph=p.size?.height||540;v.x=clamp(d.x??v.x??0,0,Math.max(0,pw-w));v.y=clamp(d.y??v.y??0,0,Math.max(0,ph-h));}}
 else if(a==="resizeVisual"){const v=getVisual(d.id||state.selectedVisualId),p=currentPage();if(v&&p){const pw=p.size?.width||960,ph=p.size?.height||540;v.w=clamp(d.w??d.width??v.w,90,Math.max(90,pw-(v.x||0)));v.h=clamp(d.h??d.height??v.h,60,Math.max(60,ph-(v.y||0)));}}
 else if(a==="setVisualType"){const v=getVisual(d.id||state.selectedVisualId);if(v)v.type=d.type;}
 else if(a==="addFieldToWell"){const v=getVisual(d.id||state.selectedVisualId);if(v){v.fields=v.fields||{};v.fields[d.well]=arr(v.fields[d.well]);if(!v.fields[d.well].includes(d.field))v.fields[d.well].push(d.field);}}
 else if(a==="removeFieldFromWell"){const v=getVisual(d.id||state.selectedVisualId);if(v&&v.fields?.[d.well])v.fields[d.well]=v.fields[d.well].filter(x=>x!==d.field);}
 else if(a==="reorderFieldWell"){const v=getVisual(d.id||state.selectedVisualId);if(v&&v.fields?.[d.well]){const ar=v.fields[d.well],from=d.from??0,to=d.to??0,[x]=ar.splice(from,1);if(x!==undefined)ar.splice(to,0,x);}}
 else if(a==="setVisualData"){const v=getVisual(d.id||state.selectedVisualId);if(v)v.data=clone(d.data||{});}
 else if(a==="formatVisual"||a==="setConditionalFormatting"){const v=getVisual(d.id||state.selectedVisualId);if(v){v.format=Object.assign(v.format||{},clone(d.properties||d.format||{}));if(a==="setConditionalFormatting")v.conditionalFormatting=clone(d);}}
 else if(["bringForward","sendBackward"].includes(a)){const v=getVisual(d.id||state.selectedVisualId);if(v)v.z=(v.z||1)+(a==="bringForward"?1:-1);}
 else if(a==="alignVisuals"||a==="distributeVisuals"||a==="groupVisuals"||a==="ungroupVisuals")state.lastLayoutAction={action:a,ids:arr(d.ids)};
 else if(a==="setVisualTooltip"){const v=getVisual(d.id||state.selectedVisualId);if(v)v.tooltip=d.tooltip;}
 else if(a==="setFilter")addOrReplaceFilter(d.scope||"visual",d);
 else if(a==="clearFilter"){if(d.scope==="report")state.filters.report=[];else if(d.scope==="page")state.filters.page[currentPage().id]=[];else if(currentVisual())state.filters.visual[currentVisual().id]=[];}
 else if(a==="setVisualFilter")addOrReplaceFilter("visual",d);
 else if(a==="setPageFilter")addOrReplaceFilter("page",d);
 else if(a==="setReportFilter")addOrReplaceFilter("report",d);
 else if(a==="setFilterMode")state.filterMode=d.mode;
 else if(a==="addSlicerSelection"){const v=getVisual(d.id||state.selectedVisualId);if(v){v.data=v.data||{};v.data.items=arr(v.data.items);v.data.items.forEach(x=>{if((x.label??x)===d.value&&typeof x==="object")x.selected=true});state.crossFilter={field:d.field,value:d.value};}}
 else if(a==="clearSlicer"){const v=getVisual(d.id||state.selectedVisualId);if(v)arr(v.data?.items).forEach(x=>{if(typeof x==="object")x.selected=false});state.crossFilter=null;}
 else if(a==="syncSlicer")state.syncSlicers=Object.assign(state.syncSlicers||{},{[d.id||state.selectedVisualId]:arr(d.pages)});
 else if(a==="setInteraction"){state.interactions=state.interactions.filter(x=>!(x.source===d.source&&x.target===d.target));state.interactions.push(clone(d));}
 else if(["drillDown","drillUp","expandHierarchy","nextHierarchyLevel"].includes(a)){const v=getVisual(d.id||state.selectedVisualId);if(v)v.drillLevel=Math.max(0,(v.drillLevel||0)+(a==="drillUp"?-1:1));}
 else if(a==="setDrillthrough")state.drillthrough=clone(d);
 else if(a==="drillthrough"){state.navigationStack=arr(state.navigationStack);state.navigationStack.push(state.activePageId);state.activePageId=d.pageId;state.drillthroughFilter=clone(d.filter||{});}
 else if(a==="goBack"){const s=arr(state.navigationStack);if(s.length)state.activePageId=s.pop();}
 else if(a==="addBookmark")state.bookmarks.push({id:d.id||uid("bm"),name:d.name||"Bookmark",snapshot:clone({activePageId:state.activePageId,filters:state.filters,selectedVisualId:state.selectedVisualId})});
 else if(a==="applyBookmark"){const b=state.bookmarks.find(x=>x.id===d.id||x.name===d.name);if(b)Object.assign(state,clone(b.snapshot));}
 else if(a==="openAnalyticsPane"){state.paneTab="visualizations";state.analyticsOpen=true;}
 else if(["addTrendLine","addConstantLine","addForecast","findAnomalies","runKeyInfluencers","expandDecomposition","askQnA"].includes(a)){const v=getVisual(d.id||state.selectedVisualId);if(v){v.analytics=v.analytics||[];v.analytics.push({type:a,...clone(d)});if(a==="askQnA"){v.type="qna";v.data={value:d.answer||"Q&A result"};}}}
 else if(a==="openPerformanceAnalyzer")showModal("Performance Analyzer",`<p>Measure how long each visual takes to render.</p><div>${state.performance.events.map(e=>`<div class="filterCard">${esc(e.name)} — ${esc(e.duration)} ms</div>`).join("")}</div>`);
 else if(a==="startPerformanceRecording"){state.performance.recording=true;state.performance.events=[];state.statusText="Performance recording";}
 else if(a==="stopPerformanceRecording"){state.performance.recording=false;state.statusText="Performance recording stopped";}
 else if(a==="refreshVisuals"){if(state.performance.recording)currentPage().visuals.forEach((v,i)=>state.performance.events.push({name:v.title||prettyType(v.type),duration:d.durationBase?d.durationBase+i*7:40+i*9}));state.statusText="Visuals refreshed";}
 else if(a==="copyPerformanceQuery"){state.performance.copied=d.query||"DAX query copied";showToast("Performance query copied");}
 else if(a==="publishReport"){state.publish.status="Choose workspace";showPublish();}
 else if(a==="selectWorkspace"){state.publish.workspace=d.workspace||"My workspace";state.publish.status="Ready to publish";}
 else if(a==="completePublish"){state.publish.status="Published";refs.modalShade.classList.remove("show");showToast("Published successfully");}
 else if(a==="openPowerBIService"){state.serviceOpen=true;state.activeView="service";}
 else if(a==="exportReport")showModal("Export",`<p>Export ${esc(state.reportName)} as <b>${esc(d.format||"PDF")}</b>.</p>`);
 else if(a==="shareReport")showModal("Share report",`<p>Share via ${esc(d.channel||"email")}.</p>`);
 else if(a==="embedReport")showModal("Embed report",`<p>${esc(d.destination||"SharePoint Online")}</p>`);
 else if(a==="applyReportTheme"||a==="importTheme"){state.reportTheme=clone(d.theme||d);showToast("Report theme applied");}
 else if(a==="openMobileLayout"){state.mobile.enabled=true;state.statusText="Mobile layout";}
 else if(a==="setMobileVisualPosition"){state.mobile.visuals=state.mobile.visuals.filter(x=>x.id!==d.id);state.mobile.visuals.push(clone(d));}
 else if(a==="refreshData"||a==="refreshAll"){if(d.tables)state.tables=clone(d.tables);state.statusText="Refresh completed";showToast("Refresh completed");}
 else if(a==="configureIncrementalRefresh")state.incrementalRefresh=clone(d);
 else if(a==="openDaxQueryView"){state.activeView="dax";state.serviceOpen=false;state.statusText="DAX query view";}
 else if(a==="newDaxQuery"){const q={id:d.id||uid("dax"),name:d.name||"Query "+(state.daxQueries.length+1),text:d.text||"",results:[]};state.daxQueries.push(q);state.activeDaxQueryId=q.id;state.activeView="dax";}
 else if(a==="typeDaxQuery"){const q=state.daxQueries.find(x=>x.id===state.activeDaxQueryId)||state.daxQueries[0];if(q){q.text=d.text||d.dax||"";state.activeView="dax";renderModernEditors();if(animate&&autoType&&refs.daxEditor)await maybeType(refs.daxEditor,q.text,true,token);}}
 else if(a==="runDaxQuery"){state.activeView="dax";runDaxQueryState(d);}
 else if(a==="openTmdlView"){state.activeView="tmdl";state.serviceOpen=false;state.statusText="TMDL view";}
 else if(a==="scriptTmdlObject"){state.activeView="tmdl";scriptTmdlState(d);state.statusText="TMDL script generated";}
 else if(a==="typeTmdl"){const s=state.tmdlScripts.find(x=>x.id===state.activeTmdlScriptId)||state.tmdlScripts[0];if(s){s.text=d.text||"";state.activeView="tmdl";renderModernEditors();if(animate&&autoType&&refs.tmdlEditor)await maybeType(refs.tmdlEditor,s.text,true,token);}}
 else if(a==="previewTmdl"){const s=state.tmdlScripts.find(x=>x.id===state.activeTmdlScriptId)||state.tmdlScripts[0];if(s)s.preview=d.text||"Preview ready. No validation errors.";state.activeView="tmdl";}
 else if(a==="applyTmdl"){state.statusText="TMDL changes applied";showToast("TMDL changes applied");}
 else if(a==="openModelExplorer"){state.modelExplorerOpen=true;state.statusText="Model explorer opened";}
 else if(a==="selectModelObject"){state.selectedTable=d.table||d.name||state.selectedTable;}
 else if(a==="togglePane"){const n=d.pane||d.name;if(n){state.openPanes=arr(state.openPanes);state.openPanes.includes(n)?state.openPanes=state.openPanes.filter(x=>x!==n):state.openPanes.push(n);}}
 else if(a==="openPaneSwitcher"){state.paneSwitcherOpen=true;}
 else if(a==="openOnObjectBuild"){state.activeView="report";const v=getVisual(d.id||state.selectedVisualId);if(v){state.selectedVisualId=v.id;setTimeout(()=>refs.onObjectMenu?.classList.add("show"),0);}}
 else if(a==="openFormatPane"){state.paneTab="visualizations";state.formatPane=true;}
 else if(a==="showVisualTable"){showModal("Visual table","<p>Underlying data for the selected visual.</p><div class=\"filterCard\">Visual table • Data point table</div>");}
 else if(a==="openSelectionPane"){showModal("Selection",currentPage().visuals.map(v=>'<div class="filterCard">'+esc(v.title||prettyType(v.type))+'</div>').join("")||"No visuals");}
 else if(a==="openBookmarksPane"){showModal("Bookmarks",state.bookmarks.map(b=>'<div class="filterCard">'+esc(b.name)+'</div>').join("")||"No bookmarks");}
 else if(a==="toggleRibbonCollapsed"){state.ribbonCollapsed=d.value!==undefined?!!d.value:!state.ribbonCollapsed;}
 else if(a==="showKeytips"){state.keytips=d.value!==undefined?!!d.value:true;}
 else if(a==="searchRibbon"){state.ribbonSearch=d.query||"";if(refs.pbiSearch)refs.pbiSearch.value=state.ribbonSearch;state.statusText="Search: "+state.ribbonSearch;}
 else if(a==="openContextMenu"){showModal(d.title||"Power BI",arr(d.items||["Copy","Show as a table","Spotlight","Get insights","Delete"]).map(x=>'<div class="filterCard">'+esc(x)+'</div>').join(""));}
 else if(a==="setView"){if(["report","data","model","dax","tmdl"].includes(d.view)){state.activeView=d.view;state.serviceOpen=false;}else if(d.view==="service"){state.serviceOpen=true;state.activeView="service";}}
 else if(a==="openMenu")showModal(d.title||"Menu",arr(d.items).map(x=>`<div class="filterCard">${esc(x)}</div>`).join(""));
 else if(a==="pressButton"){state.statusText=(d.status||"Button")+" activated";if(d.target)drawBoundary(d.target);}
 else if(a==="highlightTarget")drawBoundary(d.target);
 else if(a==="showNotification")showToast(d.text||"Notification");
 else if(a==="showLearningMap")showLearningMap();
 else if(a==="selectLearningFeature"){state.featureSelection=d.feature;showLearningMap();setTimeout(()=>drawBoundary({type:"learning",feature:d.feature}),0);}
 else {state.statusText="Unsupported action: "+a;}
 renderAll();if(d.boundary&&d.target)drawBoundary(d.target);
}
async function seek(steps,animateFinal){
 const token=++seekToken;clearTransient();state=normalize(baseline||{});applyTheme(state.theme||"light");
 for(let i=0;i<steps.length;i++){if(steps[i].app&&steps[i].app!==APP_ID)continue;allowBoundary=i===steps.length-1;await applyStep(steps[i],animateFinal&&i===steps.length-1,token);if(token!==seekToken)return;}
 allowBoundary=true;renderAll();
}
refs.reportViewBtn.onclick=()=>{state.activeView="report";state.serviceOpen=false;renderAll();};
refs.dataViewBtn.onclick=()=>{state.activeView="data";state.serviceOpen=false;renderAll();};
refs.modelViewBtn.onclick=()=>{state.activeView="model";state.serviceOpen=false;renderAll();};
refs.daxViewBtn.onclick=()=>{state.activeView="dax";state.serviceOpen=false;renderAll();};
refs.tmdlViewBtn.onclick=()=>{state.activeView="tmdl";state.serviceOpen=false;renderAll();};
refs.daxEditor?.addEventListener("input",()=>{const q=state.daxQueries.find(x=>x.id===state.activeDaxQueryId)||state.daxQueries[0];if(q)q.text=refs.daxEditor.value});
refs.tmdlEditor?.addEventListener("input",()=>{const s=state.tmdlScripts.find(x=>x.id===state.activeTmdlScriptId)||state.tmdlScripts[0];if(s)s.text=refs.tmdlEditor.value});
$("runDaxBtn")?.addEventListener("click",()=>{runDaxQueryState();renderAll()});$("newDaxBtn")?.addEventListener("click",()=>{const q={id:uid("dax"),name:"Query "+(state.daxQueries.length+1),text:"",results:[]};state.daxQueries.push(q);state.activeDaxQueryId=q.id;renderAll()});
$("scriptTmdlBtn")?.addEventListener("click",()=>{scriptTmdlState({table:state.selectedTable});renderAll()});$("previewTmdlBtn")?.addEventListener("click",()=>{const s=state.tmdlScripts.find(x=>x.id===state.activeTmdlScriptId)||state.tmdlScripts[0];if(s)s.preview="Preview ready. No validation errors.";renderAll()});$("applyTmdlBtn")?.addEventListener("click",()=>showToast("TMDL changes applied"));
refs.pbiSearch?.addEventListener("input",e=>{state.ribbonSearch=e.target.value;state.statusText=e.target.value?"Search: "+e.target.value:"Ready";refs.statusMessage.textContent=state.statusText});
refs.paneSwitcher?.addEventListener("click",e=>{const b=e.target.closest("[data-pane-switch]");if(!b)return;const p=b.dataset.paneSwitch;if(["filters","visualizations","data"].includes(p)){state.paneTab=p;renderSidePanes()}else if(p==="format"){state.paneTab="visualizations";renderSidePanes()}else if(p==="selection"){showModal("Selection",currentPage().visuals.map(v=>'<div class="filterCard">'+esc(v.title||prettyType(v.type))+'</div>').join("")||"No visuals")}else if(p==="bookmarks"){showModal("Bookmarks",state.bookmarks.map(b=>'<div class="filterCard">'+esc(b.name)+'</div>').join("")||"No bookmarks")}else if(p==="add"){showModal("Customize the pane switcher",'<div class="filterCard">Build a visual</div><div class="filterCard">Format</div><div class="filterCard">Selection</div><div class="filterCard">Bookmarks</div><div class="filterCard">Sync slicers</div>')}});
refs.modalShade.addEventListener("click",e=>{if(e.target===refs.modalShade)refs.modalShade.classList.remove("show");});
document.addEventListener("pointerdown",e=>{if(!e.target.closest(".boundary"))refs.boundary.classList.remove("show");},true);

window.addEventListener("message",e=>{
 const m=e.data||{};
 if(m.type==="SIM_PACKAGE"){autoType=m.autoType!==false;loadPackage(m.package);}
 if(m.type==="SIM_SEEK"){autoType=m.autoType!==false;seek(Array.isArray(m.steps)?m.steps:[],!!m.animateFinal);}
 if(m.type==="SIM_SETTING"){if(m.key==="autoType")autoType=!!m.value;if(m.key==="theme")applyTheme(m.value);renderAll();}
});
state=emptyState();applyTheme("light");renderAll();
parent.postMessage({type:"ENGINE_READY",app:APP_ID,actions:SUPPORTED_ACTIONS,educationalFeatures:420,capabilities:window.PBI_CAPABILITIES?.snapshot?.()||null}, "*");
})();