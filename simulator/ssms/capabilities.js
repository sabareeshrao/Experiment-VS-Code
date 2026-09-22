(() => {
  "use strict";

  const sep = () => ({separator:true});
  const submenu = (label, items, shortcut="") => ({label, items, shortcut});
  const item = (label, command, shortcut="", extra={}) => Object.assign({label, command, shortcut}, extra);

  window.SSMS_CAPABILITIES = {
    version: 1,
    software: "sql_server_management_studio",
    philosophy: "SSMS-owned UI capabilities. No cross-software UI primitives.",
    features: [
      "context-menu","nested-submenu","menu-shortcuts","menu-disabled-state","menu-check-state",
      "adaptive-dialog","property-pages","radio-options","checkbox-options","dialog-tree",
      "tool-window","tool-window-pin","object-explorer-tree","query-editor","result-grid",
      "query-tabs","split-tab-groups","intellisense","execution-plan","client-statistics",
      "object-dependencies","template-explorer","solution-explorer","registered-servers",
      "properties-window","standard-reports","connection-color"
    ],
    actions: [
      "openContextMenu","chooseContextMenuPath","closeContextMenu",
      "openAdaptiveDialog","closeAdaptiveDialog","setAdaptiveField","selectAdaptiveOption",
      "showObjectDependencies","showServerProperties","openToolWindow","closeToolWindow","setToolWindowPinned",
      "openTemplateExplorer","openSolutionExplorer","openPropertiesWindow",
      "showLiveQueryStatistics","showStandardReport","setConnectionColor"
    ],
    contextMenus: {
      queryEditor: [
        item("Cut","cut","Ctrl+X"),
        item("Copy","copy","Ctrl+C"),
        item("Paste","paste","Ctrl+V"),
        sep(),
        item("Insert Snippet...","insertSnippet","Ctrl+K, Ctrl+X"),
        submenu("Surround With...",[
          item("BEGIN...END","surround:beginEnd"),
          item("WHILE","surround:while"),
          item("IF...BEGIN...END","surround:if")
        ],"Ctrl+K, Ctrl+S"),
        submenu("Connection",[
          item("Change Connection...","changeConnection"),
          item("Disconnect","disconnectQuery")
        ]),
        item("Open Server in Object Explorer","openServerInExplorer","Alt+F8"),
        sep(),
        item("Execute","execute","F5"),
        item("Display Estimated Execution Plan","estimatedPlan","Ctrl+L"),
        item("IntelliSense Enabled","toggleIntelliSense","Ctrl+B, Ctrl+I",{checkable:true,checked:true}),
        item("Trace Query in SQL Server Profiler","traceQuery","Ctrl+Alt+P"),
        item("Analyze Query in Database Engine Tuning Advisor","tuningAdvisor"),
        item("Design Query in Editor...","designQuery","Ctrl+Shift+Q"),
        sep(),
        item("Include Actual Execution Plan","toggleActualPlan","Ctrl+M",{checkable:true}),
        item("Include Live Query Statistics","toggleLiveStats","",{checkable:true}),
        item("Include Client Statistics","toggleClientStats","Shift+Alt+S",{checkable:true}),
        submenu("Results To",[
          item("Results to Grid","results:grid","Ctrl+D"),
          item("Results to Text","results:text","Ctrl+T"),
          item("Results to File","results:file","Ctrl+Shift+F")
        ]),
        item("Properties Window","propertiesWindow","F4"),
        item("Query Options...","queryOptions")
      ],
      table: [
        item("New Table...","newTable"),
        item("Design","tableDesigner"),
        sep(),
        item("Select Top 1000 Rows","selectTop1000"),
        item("Edit Top 200 Rows","editTop200"),
        submenu("Script Table as",[
          submenu("CREATE To",[
            item("New Query Editor Window","script:create:newQuery"),
            item("File...","script:create:file"),
            item("Clipboard","script:create:clipboard")
          ]),
          submenu("ALTER To",[
            item("New Query Editor Window","script:alter:newQuery"),
            item("File...","script:alter:file"),
            item("Clipboard","script:alter:clipboard")
          ]),
          submenu("DROP To",[
            item("New Query Editor Window","script:drop:newQuery"),
            item("File...","script:drop:file"),
            item("Clipboard","script:drop:clipboard")
          ]),
          submenu("SELECT To",[
            item("New Query Editor Window","script:select:newQuery"),
            item("File...","script:select:file"),
            item("Clipboard","script:select:clipboard")
          ]),
          submenu("INSERT To",[
            item("New Query Editor Window","script:insert:newQuery"),
            item("File...","script:insert:file"),
            item("Clipboard","script:insert:clipboard")
          ])
        ]),
        sep(),
        item("View Dependencies","objectDependencies"),
        item("Rename","renameObject"),
        item("Delete","deleteObject"),
        item("Refresh","refreshObject"),
        item("Properties","objectProperties")
      ],
      view: [
        item("Design","viewDesigner"),
        item("Select Top 1000 Rows","selectTop1000"),
        submenu("Script View as",[
          submenu("CREATE To",[item("New Query Editor Window","script:create:newQuery"),item("File...","script:create:file"),item("Clipboard","script:create:clipboard")]),
          submenu("ALTER To",[item("New Query Editor Window","script:alter:newQuery"),item("File...","script:alter:file"),item("Clipboard","script:alter:clipboard")]),
          submenu("CREATE OR ALTER To",[item("New Query Editor Window","script:create or alter:newQuery"),item("Clipboard","script:create or alter:clipboard")]),
          submenu("DROP To",[item("New Query Editor Window","script:drop:newQuery"),item("Clipboard","script:drop:clipboard")])
        ]),
        item("View Dependencies","objectDependencies"),
        item("Properties","objectProperties")
      ],
      procedure: [
        item("Modify","modifyObject"),
        submenu("Script Stored Procedure as",[
          submenu("CREATE To",[item("New Query Editor Window","script:create:newQuery"),item("Clipboard","script:create:clipboard")]),
          submenu("ALTER To",[item("New Query Editor Window","script:alter:newQuery"),item("Clipboard","script:alter:clipboard")]),
          submenu("DROP and CREATE To",[item("New Query Editor Window","script:drop and create:newQuery")]),
          submenu("EXECUTE To",[item("New Query Editor Window","script:execute:newQuery")])
        ]),
        item("Execute Stored Procedure...","executeProcedure"),
        item("View Dependencies","objectDependencies"),
        item("Properties","objectProperties")
      ],
      function: [
        item("Modify","modifyObject"),
        submenu("Script Function as",[
          submenu("CREATE To",[item("New Query Editor Window","script:create:newQuery"),item("Clipboard","script:create:clipboard")]),
          submenu("ALTER To",[item("New Query Editor Window","script:alter:newQuery"),item("Clipboard","script:alter:clipboard")]),
          submenu("DROP To",[item("New Query Editor Window","script:drop:newQuery")])
        ]),
        item("View Dependencies","objectDependencies"),
        item("Properties","objectProperties")
      ],
      database: [
        item("New Query","newQuery"),
        item("Properties","databaseProperties"),
        submenu("Reports",[
          submenu("Standard Reports",[
            item("Disk Usage","report:diskUsage"),
            item("Disk Usage by Top Tables","report:diskUsageByTable"),
            item("Server Dashboard","report:serverDashboard")
          ])
        ]),
        item("Refresh","refreshObject")
      ],
      server: [
        item("Connect...","connectServer"),
        item("Disconnect","disconnectServer"),
        item("New Query","newQuery"),
        item("Properties","serverProperties"),
        item("Register...","registerServer"),
        item("Activity Monitor","activityMonitor"),
        item("Refresh","refreshObject")
      ],
      resultGrid: [
        item("Copy","copyResults","Ctrl+C"),
        item("Copy with Headers","copyResultsWithHeaders"),
        item("Select All","selectAllResults","Ctrl+A"),
        item("Save Results As...","saveResults")
      ]
    },
    toolWindows: {
      "Template Explorer": {
        sections: [
          {label:"Database",children:["Create Database","Backup Database","Restore Database"]},
          {label:"Table",children:["Create Table","Add Column","Create Index","Create Trigger"]},
          {label:"Stored Procedure",children:["Create Basic Stored Procedure","Create Procedure with Output Parameter"]},
          {label:"View",children:["Create View","Alter View"]},
          {label:"User-defined Function",children:["Create Scalar Function","Create Table-valued Function"]}
        ]
      },
      "Solution Explorer": {
        sections: [{label:"SQL Server Scripts",children:["Connections","Queries"]}]
      },
      "Registered Servers": {
        sections: [
          {label:"Database Engine",children:["Local Server Groups","Development","Staging","Production"]},
          {label:"Analysis Services",children:[]},
          {label:"Reporting Services",children:[]},
          {label:"Integration Services",children:[]}
        ]
      },
      "Properties": {
        sections: [{label:"Selection",children:["Name","Schema","Database","Server"]}]
      }
    }
  };
})();