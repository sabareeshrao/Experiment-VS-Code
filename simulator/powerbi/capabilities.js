(()=>{"use strict";const groups={
shell:["home-screen","file-backstage","ribbon-search","dynamic-ribbon","ribbon-collapse","keytips","theme-switching"],
views:["report-view","table-view","model-view","dax-query-view","tmdl-view","power-query-editor"],
panes:["filters-pane","visualizations-pane","data-pane","format-pane","selection-pane","bookmarks-pane","sync-slicers-pane","model-explorer","pane-switcher","multi-pane"],
data:["get-data","credentials","navigator","recent-sources","data-source-settings","power-query-transforms","profiling"],
model:["relationships","model-diagram","model-explorer","properties","hierarchies","storage-modes"],
dax:["measure-editor","dax-query-tabs","dax-intellisense","dax-results-grid","quick-queries","code-lens"],
tmdl:["tmdl-tabs","script-object","drag-script","preview-changes","apply-changes","code-editor"],
report:["on-object-build","on-object-format","visual-gallery","field-wells","visual-context-menu","visual-table","drill","bookmarks","interactions"],
performance:["performance-analyzer","refresh-timing","copy-query"],publish:["publish-dialog","workspace-picker","service-view","export","share"]};
const actions=["openDaxQueryView","newDaxQuery","typeDaxQuery","runDaxQuery","openTmdlView","scriptTmdlObject","typeTmdl","previewTmdl","applyTmdl","openModelExplorer","selectModelObject","togglePane","openPaneSwitcher","openOnObjectBuild","openFormatPane","showVisualTable","openSelectionPane","openBookmarksPane","toggleRibbonCollapsed","showKeytips","searchRibbon","openContextMenu"];
window.PBI_CAPABILITIES={version:2,targetFidelity:92,software:"Power BI Desktop",groups,actions,registerFeature(g,n){groups[g]||(groups[g]=[]);if(!groups[g].includes(n))groups[g].push(n)},registerAction(n){if(!actions.includes(n))actions.push(n)},hasFeature(n){return Object.values(groups).some(x=>x.includes(n))},snapshot(){return JSON.parse(JSON.stringify({version:this.version,targetFidelity:this.targetFidelity,groups,actions}))}}})();