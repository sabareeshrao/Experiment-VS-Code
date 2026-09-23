window.REDIS_CAPABILITIES = {
  version: 1,
  targetFidelity: 90,
  app: "redis",
  product: "Redis Insight",
  basedOn: "Redis Insight 3.x refreshed top-navigation UI",
  features: [
    "database-switcher","browser","key-search","key-type-filter","key-details",
    "string-crud","hash-crud","list-crud","set-crud","sorted-set-crud","json-crud",
    "stream-view","vector-set-view","array-view","bulk-actions","tree-view",
    "workbench","command-editor","command-autocomplete","raw-results","guides",
    "search-workspace","index-list","query-library","explain","profile",
    "analysis","recommendations","memory-analysis","slow-log","profiler",
    "pubsub","cli","settings","connection-dialog","database-environment-tag"
  ],
  actions: [
    "setView","selectKey","searchKeys","filterKeyType","createKey","deleteKey","editKey",
    "setKeyValue","setHashField","pushListItem","addSetMember","addSortedSetMember",
    "runWorkbench","setWorkbenchQuery","openCli","runCliCommand","clearCli",
    "openSearchIndex","runSearchQuery","showExplain","showProfile",
    "openAnalysisTab","loadSlowLog","startProfiler","stopProfiler",
    "subscribeChannel","publishMessage","openSettings","openDatabaseDialog",
    "showDialog","showToast"
  ],
  integration: {
    status: "integrated",
    note: "Integrated into the central player, AI capability index and validation contract.",
    appId: "redis",
    futureMessageProtocol: ["SIM_PACKAGE","SIM_SEEK","SIM_EXPLAIN","ENGINE_READY"]
  }
};