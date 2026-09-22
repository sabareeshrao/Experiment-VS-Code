window.COURSE = {
  "title": "Java Practice Developer Playback",
  "subtitle": "Lesson-by-lesson reconstruction of the Java teaching repository.",
  "package": {
    "apps": {
      "intellij_idea": {
        "project": {
          "name": "Java Practice",
          "sdk": "Java 21",
          "languageLevel": "21"
        },
        "tree": [],
        "files": {},
        "problems": [],
        "breakpoints": [],
        "runConfigurations": [],
        "maven": {},
        "spring": {},
        "jpa": {},
        "git": {
          "branch": "main",
          "changes": [],
          "history": []
        },
        "database": {},
        "tests": {},
        "terminal": "",
        "console": "",
        "visibleFeatures": []
      },
      "pgadmin": {
        "title": "Java Practice",
        "database": "java_practice",
        "connection": "java_practice/postgres@Local PostgreSQL",
        "initialSelection": "Servers/Local PostgreSQL/Databases/java_practice",
        "tree": [
          {
            "name": "Servers",
            "path": "Servers",
            "type": "folder",
            "open": true,
            "children": [
              {
                "name": "Local PostgreSQL",
                "path": "Servers/Local PostgreSQL",
                "type": "server",
                "open": true,
                "children": [
                  {
                    "name": "Databases",
                    "path": "Servers/Local PostgreSQL/Databases",
                    "type": "folder",
                    "open": true,
                    "children": [
                      {
                        "name": "java_practice",
                        "path": "Servers/Local PostgreSQL/Databases/java_practice",
                        "type": "database",
                        "open": true,
                        "children": [
                          {
                            "name": "Schemas",
                            "path": "Servers/Local PostgreSQL/Databases/java_practice/Schemas",
                            "type": "folder",
                            "open": true,
                            "children": [
                              {
                                "name": "public",
                                "path": "Servers/Local PostgreSQL/Databases/java_practice/Schemas/public",
                                "type": "schema",
                                "open": true,
                                "children": [
                                  {
                                    "name": "Tables",
                                    "path": "Servers/Local PostgreSQL/Databases/java_practice/Schemas/public/Tables",
                                    "type": "folder",
                                    "open": true,
                                    "children": []
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      "vscode": {
        "workspaceName": "Java Practice",
        "year": 2026,
        "aiEnabled": false,
        "initialFile": null,
        "files": {},
        "tree": [],
        "settings": {
          "theme": "dark",
          "fontSize": 13,
          "minimap": true
        },
        "git": {
          "branch": "main",
          "changes": [],
          "staged": [],
          "history": []
        },
        "terminals": [
          {
            "id": "terminal-1",
            "name": "PowerShell",
            "shell": "PowerShell",
            "text": ""
          }
        ],
        "terminal": "PS Java Practice> ",
        "problems": [],
        "debug": {},
        "tests": [],
        "extensions": []
      },
      "postman": {
        "workspaceName": "Java Practice API Workspace",
        "activeEnvironment": "Local",
        "environments": {
          "Local": {
            "baseUrl": "http://localhost:8080"
          }
        },
        "globals": {},
        "collections": [
          {
            "name": "Java Practice API",
            "description": "Requests used to test the Java Practice application during the developer journey.",
            "variables": {},
            "requests": [
              {
                "id": "get-student",
                "name": "Get Student",
                "method": "GET",
                "url": "{{baseUrl}}/api/students/101",
                "params": [],
                "headers": {
                  "Accept": "application/json"
                },
                "auth": {
                  "type": "No Auth",
                  "fields": {}
                },
                "bodyMode": "raw",
                "body": "",
                "tests": "",
                "examples": []
              }
            ],
            "folders": []
          }
        ],
        "initialRequest": "get-student",
        "history": [],
        "console": [],
        "cookies": [],
        "mocks": [],
        "monitors": [],
        "runner": {},
        "websocket": {},
        "grpc": {},
        "documentation": {},
        "liveNetwork": false
      }
    }
  },
  "stages": [
    {
      "title": "1: Student Class Fundamentals",
      "subtitle": "Build Student.java from an empty project and understand fields, getters, and setters.",
      "steps": [
        {
          "title": "Create the Java project",
          "why": "Oka developer empty Java project tho start chestadu. Source files rayadaniki mundu project peru, JDK, mariyu Java language level set avuthayi.",
          "action": {
            "action": "newProject",
            "data": {
              "name": "Java Practice",
              "sdk": "Java 21",
              "languageLevel": "21"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Create the src folder",
          "why": "Java source code ki oka source location kavali. Ee teaching repo lo Student.java direct ga src folder kinda untundi.",
          "action": {
            "action": "createPackage",
            "data": {
              "name": "src",
              "path": "src"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Create Student.java",
          "why": "Munduga source file ni create chestam. Class body empty ga untundi kabatti prati member ni step-by-step ga add cheyyachu.",
          "action": {
            "action": "createFile",
            "data": {
              "path": "src/Student.java",
              "language": "java",
              "content": ""
            }
          },
          "software": "intellij"
        },
        {
          "title": "Declare the Student class",
          "why": "Ee class declaration Student ane kottha type ni define chestundi. Student gurinchi data mariyu methods anni ee braces lopala untayi.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "public class Student {\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add the rollNo field",
          "why": "rollNo student roll number ni store chestundi. Idi whole number kabatti int type use chestunnam.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    int rollNo;\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add the attendance field",
          "why": "isPresent attendance true leka false ani store chestundi. Kabatti boolean type ee data ki correct choice.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "    boolean isPresent;\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add the marks array",
          "why": "Oka student ki multiple marks untayi. float[] use chesthe chala decimal marks ni oka array lo store cheyyachu.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "    float[] marks;\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add the name field",
          "why": "name text value kabatti Java lo String type use chestunnam.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "    String name;\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add getRollNo",
          "why": "Getter current field value ni return chestundi. getRollNo() dwara caller rollNo ni clear ga read cheyyagaladu.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public int getRollNo() {\n        return rollNo;\n    }\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add setRollNo",
          "why": "Setter kottha value ni teesukoni object field lo assign chestundi. this.rollNo ante current Student object lo unna rollNo field ani clear ga chupistundi.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public void setRollNo(int rollNo) {\n        this.rollNo = rollNo;\n    }\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add the presence getter",
          "why": "Boolean properties ki Java lo is... ane method naming common. isPresent() attendance state ni return chestundi.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public boolean isPresent() {\n        return isPresent;\n    }\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add setPresent",
          "why": "setPresent() student attendance boolean value ni update chestundi. Assignment Student class lopale control lo untundi.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public void setPresent(boolean present) {\n        isPresent = present;\n    }\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add getMarks",
          "why": "getMarks() marks array ni return chestundi. Dini dwara caller student marks ni read cheyyagaladu.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public float[] getMarks() {\n        return marks;\n    }\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add setMarks",
          "why": "setMarks() caller ichina marks array ni teesukoni current Student object lo store chestundi.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public void setMarks(float[] marks) {\n        this.marks = marks;\n    }\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add getName",
          "why": "getName() student name ni return chestundi. Field ni direct ga access cheyyakunda method dwara read cheyyachu.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public String getName() {\n        return name;\n    }\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Add setName",
          "why": "setName() oka String value ni teesukoni current Student object yokka name field lo assign chestundi.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public void setName(String name) {\n        this.name = name;\n    }\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Close the Student class",
          "why": "Final closing brace tho Student class complete avuthundi. Ee point lo Student.java repository source structure ni match chestundi.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n}\n"
            }
          },
          "software": "intellij"
        },
        {
          "title": "Review the completed class structure",
          "why": "Structure view lo class motham scan cheyyakunda four fields, getters, setters anni oka sari choodachu. Developer ki class shape fast ga ardham avuthundi.",
          "action": {
            "action": "showFileStructure",
            "data": {}
          },
          "software": "intellij"
        }
      ]
    },
    {
      "title": "2: Database Software Handoff",
      "subtitle": "Test a realistic IntelliJ → pgAdmin → IntelliJ workflow while keeping one continuous project timeline.",
      "steps": [
        {
          "title": "Review Student fields before database work",
          "why": "Database table design cheyyadaniki mundu developer Java model ni chustadu. App lo unna fields ki database columns correct ga correspond avvalani idi help chestundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Open pgAdmin",
          "why": "Database work vere application lo jaruguthundi. Project timeline marchakunda center workspace IntelliJ nundi pgAdmin ki switch avuthundi.",
          "software": "pgadmin",
          "action": {
            "action": "setStatus",
            "data": {
              "text": "pgAdmin opened for Java Practice"
            }
          }
        },
        {
          "title": "Select the java_practice database",
          "why": "SQL correct PostgreSQL database meeda run avvali. Anduke developer Object Explorer lo java_practice database ni select chestadu.",
          "software": "pgadmin",
          "action": {
            "action": "selectTree",
            "data": {
              "path": "Servers/Local PostgreSQL/Databases/java_practice"
            }
          }
        },
        {
          "title": "Open the Query Tool",
          "why": "Selected database meeda SQL rayadaniki mariyu execute cheyyadaniki pgAdmin Query Tool ni open chestam.",
          "software": "pgadmin",
          "action": {
            "action": "openQueryTool",
            "data": {
              "title": "Query Tool"
            }
          }
        },
        {
          "title": "Create the student table SQL",
          "why": "student table lo Java Student class core fields ni mirror chestunnam: roll number, attendance, marks, mariyu name. SQL ni developer type chestunnattu simulator step-by-step ga chupistundi.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "sql": "CREATE TABLE student (\n    roll_no INTEGER,\n    is_present BOOLEAN,\n    marks REAL[],\n    name VARCHAR(100)\n);"
            }
          }
        },
        {
          "title": "Execute CREATE TABLE",
          "why": "CREATE TABLE execute chesthe schema change PostgreSQL ki pampabaduthundi. Success message vachindante database command ni accept chesindi ani ardham.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "message": "Query returned successfully in 48 msec.",
              "statusText": "CREATE TABLE completed",
              "duration": "0.048 s"
            }
          }
        },
        {
          "title": "Return to Student.java",
          "why": "Ippudu developer malli IntelliJ ki vastadu. pgAdmin ki vellina mundu unna Java project state ade vidham ga reconstruct avuthundi. Ila oka lesson lo multiple applications continuous ga pani cheyyagalavani prove avuthundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        }
      ]
    },
    {
      "title": "3: API Testing Software Handoff",
      "subtitle": "Test a realistic IntelliJ → Postman → IntelliJ workflow while preserving one continuous project timeline.",
      "steps": [
        {
          "title": "Review Student model before API testing",
          "why": "API response ni test cheyyadaniki mundu developer Student model structure ni IntelliJ lo quick ga review chestadu. Expected JSON fields enti ani mundhe clear ga untundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Open the Get Student request in Postman",
          "why": "Backend endpoint ni manual ga verify cheyyadaniki developer Postman ki switch ayi already prepared Get Student request ni open chestadu.",
          "software": "postman",
          "action": {
            "action": "openRequest",
            "data": {
              "id": "get-student"
            }
          }
        },
        {
          "title": "Select the Local environment",
          "why": "Local environment select chesthe baseUrl laanti environment variables local Spring Boot server values ni use chestayi. Environment marchina request structure same ga untundi.",
          "software": "postman",
          "action": {
            "action": "setEnvironment",
            "data": {
              "name": "Local"
            }
          }
        },
        {
          "title": "Confirm the GET method",
          "why": "Student record ni read cheyyali kabatti HTTP GET method use chestunnam. GET normally server nundi resource ni retrieve cheyyadaniki use avuthundi.",
          "software": "postman",
          "action": {
            "action": "setMethod",
            "data": {
              "method": "GET"
            }
          }
        },
        {
          "title": "Type the Student API URL",
          "why": "Developer request URL lo baseUrl environment variable ni use chesi student endpoint ni target chestadu. Ila localhost value hard-code cheyyakunda environments madhya easy ga switch avvachu.",
          "software": "postman",
          "action": {
            "action": "typeUrl",
            "data": {
              "url": "{{baseUrl}}/api/students/101",
              "boundary": true
            }
          }
        },
        {
          "title": "Set the Accept JSON header",
          "why": "Accept application/json header tho client JSON response expect chestundi ani backend ki clear ga cheptham.",
          "software": "postman",
          "action": {
            "action": "setHeaders",
            "data": {
              "headers": {
                "Accept": "application/json"
              }
            }
          }
        },
        {
          "title": "Send the request and receive 200 OK",
          "why": "Send click chesina taruvatha simulator deterministic API response ni chupistundi. 200 OK ante request successful ga process ayindi ani ardham.",
          "software": "postman",
          "action": {
            "action": "sendRequest",
            "data": {
              "boundary": true,
              "status": 200,
              "statusText": "OK",
              "time": 43,
              "size": "118 B",
              "headers": {
                "Content-Type": "application/json"
              },
              "body": {
                "rollNo": 101,
                "present": true,
                "marks": [
                  86.5,
                  91,
                  88.5
                ],
                "name": "Ravi"
              }
            }
          }
        },
        {
          "title": "Inspect the JSON response",
          "why": "Pretty response view lo returned JSON ni developer model expectations tho compare chestadu. Fields and values correct ga unnaya ani fast ga verify cheyyachu.",
          "software": "postman",
          "action": {
            "action": "selectResponseTab",
            "data": {
              "tab": "pretty"
            }
          }
        },
        {
          "title": "Return to Student.java after API verification",
          "why": "API check complete ayyaka developer malli IntelliJ ki vastadu. Postman ki switch ayina sare Java project state continuous ga preserve avuthundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        }
      ]
    },
    {
      "title": "4: VS Code Workspace Setup",
      "subtitle": "VS Code lo project workspace ni open chesi basic notes file create chestam.",
      "steps": [
        {
          "title": "Open Java Practice in VS Code",
          "why": "Ippudu project ni VS Code lo open chestunnam. Left lesson journey same ga untundi, center workspace matram VS Code ga maruthundi.",
          "software": "vscode",
          "action": {
            "action": "newProject",
            "data": {
              "name": "Java Practice"
            }
          }
        },
        {
          "title": "Create journey-notes.md",
          "why": "VS Code Explorer mariyu editor correct ga work chestunnaya ani test cheyyadaniki notes file create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "journey-notes.md",
              "content": "# Java Practice Journey\n"
            }
          }
        }
      ]
    },
    {
      "title": "5: VS Code README Work",
      "subtitle": "Project documentation ni VS Code lo maintain cheyyadam practice chestam.",
      "steps": [
        {
          "title": "Create README.md",
          "why": "Project gurinchi quick documentation kosam README.md create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "README.md",
              "content": "# Java Practice\n\nDeveloper journey project.\n"
            }
          }
        },
        {
          "title": "Add setup section",
          "why": "Existing README file ki setup section add cheyyadam editor typing flow ni test chestundi.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "README.md",
              "code": "\n## Setup\nUse Java 21 for the exercises.\n"
            }
          }
        }
      ]
    },
    {
      "title": "6: VS Code Notes Folder",
      "subtitle": "Folder-style project organization ni simulate chestam.",
      "steps": [
        {
          "title": "Create notes/day-01.md",
          "why": "Daily office work ni separate notes files lo maintain cheyyachu. Ikkada first day note create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "notes/day-01.md",
              "content": "# Day 01\n\nReviewed Student model.\n"
            }
          }
        },
        {
          "title": "Add Day 01 task",
          "why": "Same file lo additional task add chesi incremental editing ni test chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "notes/day-01.md",
              "code": "- Verified project structure.\n"
            }
          }
        }
      ]
    },
    {
      "title": "7: VS Code JSON Configuration",
      "subtitle": "JSON config files edit cheyyadam VS Code lo common workflow.",
      "steps": [
        {
          "title": "Create settings.json",
          "why": "Project-level configuration ni JSON file lo store chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": ".vscode/settings.json",
              "content": "{\n  \"editor.fontSize\": 14\n}\n"
            }
          }
        },
        {
          "title": "Add format setting",
          "why": "Existing JSON config ki additional setting add cheyyadam practice chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": ".vscode/settings.json",
              "code": "\n"
            }
          }
        }
      ]
    },
    {
      "title": "8: VS Code Launch Configuration",
      "subtitle": "Run/debug configuration files ni project lo maintain cheyyadam test chestam.",
      "steps": [
        {
          "title": "Create launch.json",
          "why": "Debug configuration ki launch.json file create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": ".vscode/launch.json",
              "content": "{\n  \"version\": \"0.2.0\",\n  \"configurations\": []\n}\n"
            }
          }
        },
        {
          "title": "Review launch.json",
          "why": "Created debug config ni editor lo open chesi verify chestunnam.",
          "software": "vscode",
          "action": {
            "action": "openFile",
            "data": {
              "path": ".vscode/launch.json"
            }
          }
        }
      ]
    },
    {
      "title": "9: VS Code Task Configuration",
      "subtitle": "Build commands kosam tasks.json maintain cheyyadam simulate chestam.",
      "steps": [
        {
          "title": "Create tasks.json",
          "why": "VS Code task runner kosam tasks.json create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": ".vscode/tasks.json",
              "content": "{\n  \"version\": \"2.0.0\",\n  \"tasks\": []\n}\n"
            }
          }
        },
        {
          "title": "Open tasks.json",
          "why": "Task configuration ni editor lo open chesi inspect chestunnam.",
          "software": "vscode",
          "action": {
            "action": "openFile",
            "data": {
              "path": ".vscode/tasks.json"
            }
          }
        }
      ]
    },
    {
      "title": "10: VS Code Terminal Basics",
      "subtitle": "Integrated terminal ni lesson flow lo use chestam.",
      "steps": [
        {
          "title": "Check Java version",
          "why": "Developer environment correct Java version use chesthundha ani terminal lo verify chestunnam.",
          "software": "vscode",
          "action": {
            "action": "terminalCommand",
            "data": {
              "command": "java -version",
              "output": "openjdk version \"21\""
            }
          }
        },
        {
          "title": "List project files",
          "why": "Project root lo files enti ani terminal dwara quick ga check chestunnam.",
          "software": "vscode",
          "action": {
            "action": "terminalCommand",
            "data": {
              "command": "dir",
              "output": "README.md  journey-notes.md  notes  .vscode"
            }
          }
        }
      ]
    },
    {
      "title": "11: VS Code Git Check",
      "subtitle": "VS Code terminal nundi Git state ni check cheyyadam simulate chestam.",
      "steps": [
        {
          "title": "Check Git status",
          "why": "Current working tree lo changes unnaya ani git status tho verify chestunnam.",
          "software": "vscode",
          "action": {
            "action": "terminalCommand",
            "data": {
              "command": "git status",
              "output": "On branch main\nChanges not staged for commit"
            }
          }
        },
        {
          "title": "Check current branch",
          "why": "Developer e branch meeda work chestunnado confirm cheyyadaniki branch command run chestunnam.",
          "software": "vscode",
          "action": {
            "action": "terminalCommand",
            "data": {
              "command": "git branch --show-current",
              "output": "main"
            }
          }
        }
      ]
    },
    {
      "title": "12: VS Code Markdown Editing",
      "subtitle": "Documentation editing flow ni konchem extend chestam.",
      "steps": [
        {
          "title": "Create architecture.md",
          "why": "Project architecture notes kosam separate markdown file create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "docs/architecture.md",
              "content": "# Architecture\n\nJava Practice project notes.\n"
            }
          }
        },
        {
          "title": "Add simulator section",
          "why": "Architecture note lo simulator integration gurinchi section add chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "docs/architecture.md",
              "code": "\n## Simulators\nIntelliJ, VS Code, pgAdmin and Postman are part of the journey.\n"
            }
          }
        }
      ]
    },
    {
      "title": "13: VS Code API Notes",
      "subtitle": "API-related notes ni VS Code lo maintain cheyyadam simulate chestam.",
      "steps": [
        {
          "title": "Create api-notes.md",
          "why": "Postman testing mundu developer API endpoints notes ready chesukovachu.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "docs/api-notes.md",
              "content": "# API Notes\n\nGET /students\n"
            }
          }
        },
        {
          "title": "Add response note",
          "why": "Expected response gurinchi quick note add chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "docs/api-notes.md",
              "code": "Expected response: 200 OK\n"
            }
          }
        }
      ]
    },
    {
      "title": "14: VS Code Database Notes",
      "subtitle": "Database handoff ki related documentation ni edit chestam.",
      "steps": [
        {
          "title": "Create database.md",
          "why": "PostgreSQL schema gurinchi project note create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "docs/database.md",
              "content": "# Database\n\nDatabase: java_practice\n"
            }
          }
        },
        {
          "title": "Add student table note",
          "why": "student table fields ni note lo record chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "docs/database.md",
              "code": "Table: student\nColumns: roll_no, is_present, marks, name\n"
            }
          }
        }
      ]
    },
    {
      "title": "15: VS Code Environment File",
      "subtitle": "Environment configuration pattern ni simulate chestam.",
      "steps": [
        {
          "title": "Create example env file",
          "why": "Secrets lekunda required environment variable names ni example file lo document chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": ".env.example",
              "content": "DB_HOST=localhost\nDB_PORT=5432\n"
            }
          }
        },
        {
          "title": "Add database name",
          "why": "Example environment file ki database name add chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": ".env.example",
              "code": "DB_NAME=java_practice\n"
            }
          }
        }
      ]
    },
    {
      "title": "16: VS Code Ignore Rules",
      "subtitle": "Repository cleanliness kosam ignore file maintain chestam.",
      "steps": [
        {
          "title": "Create .gitignore",
          "why": "Build output mariyu editor-specific files ni Git nundi exclude cheyyadaniki .gitignore create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": ".gitignore",
              "content": "out/\n.idea/\n"
            }
          }
        },
        {
          "title": "Add VS Code local rule",
          "why": "Local-only VS Code files ni ignore rule lo add cheyyadam simulate chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": ".gitignore",
              "code": ".vscode/local.code-workspace\n"
            }
          }
        }
      ]
    },
    {
      "title": "17: VS Code Workspace File",
      "subtitle": "Reusable VS Code workspace config ni create chestam.",
      "steps": [
        {
          "title": "Create workspace file",
          "why": "VS Code workspace ni reusable ga open cheyyadaniki code-workspace file create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "Java-Practice.code-workspace",
              "content": "{\n  \"folders\": [{ \"path\": \".\" }]\n}\n"
            }
          }
        },
        {
          "title": "Open workspace file",
          "why": "Created workspace config ni editor lo verify chestunnam.",
          "software": "vscode",
          "action": {
            "action": "openFile",
            "data": {
              "path": "Java-Practice.code-workspace"
            }
          }
        }
      ]
    },
    {
      "title": "18: VS Code Scratch File",
      "subtitle": "Quick developer scratch work ni simulate chestam.",
      "steps": [
        {
          "title": "Create scratch.txt",
          "why": "Temporary notes/testing kosam scratch file create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "scratch.txt",
              "content": "Student class review\n"
            }
          }
        },
        {
          "title": "Add next task",
          "why": "Next development task ni scratch file lo jot down chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "scratch.txt",
              "code": "Next: verify database mapping\n"
            }
          }
        }
      ]
    },
    {
      "title": "19: VS Code Build Notes",
      "subtitle": "Build workflow documentation ni add chestam.",
      "steps": [
        {
          "title": "Create build.md",
          "why": "Build commands ni project docs lo record chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "docs/build.md",
              "content": "# Build\n\nCompile the Java sources.\n"
            }
          }
        },
        {
          "title": "Run javac version",
          "why": "Local compiler availability ni terminal lo verify chestunnam.",
          "software": "vscode",
          "action": {
            "action": "terminalCommand",
            "data": {
              "command": "javac -version",
              "output": "javac 21"
            }
          }
        }
      ]
    },
    {
      "title": "20: VS Code Testing Notes",
      "subtitle": "Testing workflow documentation ni simulate chestam.",
      "steps": [
        {
          "title": "Create testing.md",
          "why": "Manual mariyu automated test notes kosam file create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "docs/testing.md",
              "content": "# Testing\n\nVerify Student getters and setters.\n"
            }
          }
        },
        {
          "title": "Add database test note",
          "why": "Database integration test kosam extra checklist item add chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "docs/testing.md",
              "code": "Verify student table creation in PostgreSQL.\n"
            }
          }
        }
      ]
    },
    {
      "title": "21: VS Code Deployment Notes",
      "subtitle": "Deployment preparation documentation ni build chestam.",
      "steps": [
        {
          "title": "Create deployment.md",
          "why": "Deployment checklist kosam documentation file create chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "docs/deployment.md",
              "content": "# Deployment\n\n1. Build project\n2. Verify configuration\n"
            }
          }
        },
        {
          "title": "Add smoke test",
          "why": "Deployment tarvata smoke test cheyyali ani checklist lo add chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "docs/deployment.md",
              "code": "3. Run smoke test\n"
            }
          }
        }
      ]
    },
    {
      "title": "22: VS Code Daily Log",
      "subtitle": "Office-day style developer log ni maintain chestam.",
      "steps": [
        {
          "title": "Create day-02.md",
          "why": "Second office day work ni separate log file lo record chestunnam.",
          "software": "vscode",
          "action": {
            "action": "createFile",
            "data": {
              "path": "notes/day-02.md",
              "content": "# Day 02\n\nWorked across IntelliJ, pgAdmin and VS Code.\n"
            }
          }
        },
        {
          "title": "Add handoff note",
          "why": "Multiple software handoff successful ani daily log lo add chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "notes/day-02.md",
              "code": "Software switching verified.\n"
            }
          }
        }
      ]
    },
    {
      "title": "23: VS Code Final Integration Review",
      "subtitle": "20-stage VS Code integration ni final ga verify chestam.",
      "steps": [
        {
          "title": "Open journey-notes.md",
          "why": "First VS Code file ni malli open chesi cumulative state preserve ayyindha ani check chestunnam.",
          "software": "vscode",
          "action": {
            "action": "openFile",
            "data": {
              "path": "journey-notes.md"
            }
          }
        },
        {
          "title": "Run final terminal check",
          "why": "VS Code simulator terminal kuda final stage varaku work chesthundha ani verify chestunnam.",
          "software": "vscode",
          "action": {
            "action": "terminalCommand",
            "data": {
              "command": "echo VS Code integration complete",
              "output": "VS Code integration complete"
            }
          }
        }
      ]
    }
  ]
};
