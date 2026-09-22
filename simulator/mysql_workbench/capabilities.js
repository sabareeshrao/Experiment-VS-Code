(()=>{"use strict";const groups={
shell:["home","connections","models-home","migration-home","menus","main-toolbar","panel-docking","dark-theme"],
sql:["query-tabs","sql-editor","syntax-highlighting","autocomplete","snippets","context-help","execute-current","execute-selection","result-grid","action-output","text-output","history-output","transactions","visual-explain","query-statistics"],
schema:["schema-navigator","object-filter","schema-inspector","table-inspector","object-context-menus","ddl-view"],
editors:["table-editor","columns","indexes","foreign-keys","triggers","partitioning","table-options","views","procedures","functions","events"],
administration:["server-status","client-connections","users-privileges","server-variables","server-logs","startup-shutdown","options-file","data-export","data-import"],
performance:["performance-dashboard","performance-reports","performance-schema","query-profiler","visual-explain"],
modeling:["eer-diagram","model-catalog","model-properties","relationships","reverse-engineer","forward-engineer","synchronize-model","schema-compare"],
migration:["migration-wizard","source-selection","target-selection","schema-retrieval","object-migration","data-migration","migration-report","schema-transfer"],
preferences:["sql-editor-preferences","modeling-preferences","fonts-colors","ssh","general-editors"]
};
const actions=["openPreferences","openConnectionParameters","openConnectionSsl","openConnectionAdvanced","openTableEditor","openTableEditorTab","openOptionsFile","openServiceControl","showTextOutput","showHistoryOutput","openHomeModels","openHomeMigration","openEERPalette","setModelZoom","openModelNavigator"];
window.MYSQL_WORKBENCH_CAPABILITIES={version:1,targetFidelity:92,software:"MySQL Workbench",groups,actions,registerFeature(g,n){groups[g]||(groups[g]=[]);if(!groups[g].includes(n))groups[g].push(n)},registerAction(n){if(!actions.includes(n))actions.push(n)},hasFeature(n){return Object.values(groups).some(x=>x.includes(n))},snapshot(){return JSON.parse(JSON.stringify({version:this.version,targetFidelity:this.targetFidelity,groups,actions}))}}})();