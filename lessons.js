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
        "initialFile": "src/studentService.js",
        "files": {
          "src/studentService.js": {
            "content": "import { apiClient } from \"./apiClient.js\";\n\nconst API_URL = \"/api/students\";\nconst DEFAULT_LIMIT = 10;\n\nexport class StudentService {\n    constructor(client = apiClient) {\n        this.client = client;\n        this.cache = new Map();\n    }\n\n    async getStudents(limit = DEFAULT_LIMIT) {\n        const response = await this.client.get(`${API_URL}?limit=${limit}`);\n\n        if (!response.ok) {\n            throw new Error(`Unable to load students: ${response.status}`);\n        }\n\n        const students = await response.json();\n        this.cacheStudents(students);\n        return students;\n    }\n\n    async getStudentById(id) {\n        if (this.cache.has(id)) {\n            return this.cache.get(id);\n        }\n\n        const response = await this.client.get(`${API_URL}/${id}`);\n\n        if (!response.ok) {\n            return null;\n        }\n\n        const student = await response.json();\n        this.cache.set(student.rollNo, student);\n        return student;\n    }\n\n    cacheStudents(students) {\n        students.forEach((student) => {\n            this.cache.set(student.rollNo, student);\n        });\n    }\n\n    getPresentStudents(students) {\n        return students.filter((student) => student.isPresent === true);\n    }\n\n    getAverageMark(student) {\n        if (!student.marks || student.marks.length === 0) {\n            return 0;\n        }\n\n        const total = student.marks.reduce((sum, mark) => sum + mark, 0);\n        return Math.round((total / student.marks.length) * 100) / 100;\n    }\n\n    formatStudent(student) {\n        const average = this.getAverageMark(student);\n        return `${student.rollNo} - ${student.name} - Average: ${average}`;\n    }\n}\n\nexport const studentService = new StudentService();\n"
          },
          "src/apiClient.js": {
            "content": "export const apiClient = {\n    get(url) {\n        return fetch(url, {\n            method: \"GET\",\n            headers: {\n                Accept: \"application/json\"\n            }\n        });\n    }\n};\n"
          }
        },
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
        "extensions": [],
        "openTabs": [
          {
            "path": "src/studentService.js",
            "pinned": true
          },
          {
            "path": "src/apiClient.js",
            "pinned": true
          }
        ]
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
      },
      "cmd": {
        "title": "Command Prompt - Java Practice",
        "cwd": "C:\\Users\\developer\\JavaPractice",
        "env": {
          "JAVA_HOME": "C:\\Program Files\\Java\\jdk-21",
          "MAVEN_HOME": "C:\\apache-maven-3.9.9",
          "PATH": "C:\\Windows\\System32;C:\\Program Files\\Java\\jdk-21\\bin;C:\\apache-maven-3.9.9\\bin;C:\\Program Files\\Git\\cmd"
        },
        "directories": [
          "C:\\Users\\developer\\JavaPractice",
          "C:\\Users\\developer\\JavaPractice\\src",
          "C:\\Users\\developer\\JavaPractice\\docs"
        ],
        "files": {
          "C:\\Users\\developer\\JavaPractice\\README.md": "# Java Practice\\nDeveloper journey project.\\n",
          "C:\\Users\\developer\\JavaPractice\\src\\Student.java": "public class Student {\\n    int rollNo;\\n    boolean isPresent;\\n    float[] marks;\\n    String name;\\n}\\n",
          "C:\\Users\\developer\\JavaPractice\\.gitignore": "out/\\n.idea/\\n"
        },
        "promptSuffix": ">",
        "initialOutput": "Microsoft Windows [Version 11.0.26100.6584]\\n(c) Microsoft Corporation. All rights reserved.\\n"
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
      "title": "4: VS Code Integration Test",
      "subtitle": "20-step VS Code test using a real multi-file workspace with full-length source code.",
      "steps": [
        {
          "title": "Open full StudentService.js in VS Code",
          "why": "Ippudu VS Code lo small sample kakunda full-length source file open chestunnam. Syntax colors, line numbers, tabs, scrolling, strings, keywords, methods anni clear ga test cheyyachu.",
          "software": "vscode",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/studentService.js"
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
        },
        {
          "title": "Add first journey note",
          "why": "Existing file lo incremental typing correct ga work chesthundha ani test chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "journey-notes.md",
              "code": "VS Code integration started.\n"
            }
          }
        },
        {
          "title": "Create README.md",
          "why": "Project documentation kosam README.md create chestunnam.",
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
          "title": "Add setup section to README",
          "why": "README lo additional section add chesi normal editing flow ni test chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "README.md",
              "code": "\n## Setup\nUse Java 21 for the exercises.\n"
            }
          }
        },
        {
          "title": "Create VS Code settings",
          "why": "Project-level VS Code configuration file create chestunnam.",
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
          "title": "Create launch.json",
          "why": "Debug configuration kosam launch.json create chestunnam.",
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
          "title": "Create tasks.json",
          "why": "Task runner configuration ni project lo add chestunnam.",
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
          "title": "Check Java version in terminal",
          "why": "Integrated terminal correct ga lesson action receive chesthundha ani java version command run chestunnam.",
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
          "why": "Terminal nundi project root files ni verify chestunnam.",
          "software": "vscode",
          "action": {
            "action": "terminalCommand",
            "data": {
              "command": "dir",
              "output": "README.md  journey-notes.md  .vscode"
            }
          }
        },
        {
          "title": "Check Git status",
          "why": "VS Code terminal lo Git workflow kuda simulate cheyyagalama ani verify chestunnam.",
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
          "why": "Developer current branch main ani confirm chestunnam.",
          "software": "vscode",
          "action": {
            "action": "terminalCommand",
            "data": {
              "command": "git branch --show-current",
              "output": "main"
            }
          }
        },
        {
          "title": "Create architecture notes",
          "why": "Project architecture gurinchi documentation file create chestunnam.",
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
          "title": "Add simulator integration note",
          "why": "Multiple software handoff gurinchi architecture note lo add chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "docs/architecture.md",
              "code": "\nIntelliJ, VS Code, pgAdmin and Postman are part of the journey.\n"
            }
          }
        },
        {
          "title": "Create database notes",
          "why": "Database work ki related note file create chestunnam.",
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
          "why": "Database note lo student table details add chestunnam.",
          "software": "vscode",
          "action": {
            "action": "typeCode",
            "data": {
              "path": "docs/database.md",
              "code": "Table: student\nColumns: roll_no, is_present, marks, name\n"
            }
          }
        },
        {
          "title": "Create .gitignore",
          "why": "Repository cleanliness kosam common generated/editor files ni ignore chestunnam.",
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
          "title": "Run javac version",
          "why": "Java compiler availability ni terminal lo verify chestunnam.",
          "software": "vscode",
          "action": {
            "action": "terminalCommand",
            "data": {
              "command": "javac -version",
              "output": "javac 21"
            }
          }
        },
        {
          "title": "Open journey-notes.md again",
          "why": "Earlier create chesina file state preserve ayyindha ani malli open chesi check chestunnam.",
          "software": "vscode",
          "action": {
            "action": "openFile",
            "data": {
              "path": "journey-notes.md"
            }
          }
        },
        {
          "title": "Finish VS Code integration test",
          "why": "Final terminal command tho VS Code simulator lesson flow complete ga work chesthundha ani verify chestunnam.",
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
    },
    {
      "title": "5: Command Prompt Developer Workflow",
      "subtitle": "Test a realistic IntelliJ → Windows Command Prompt → IntelliJ workflow with a stateful virtual shell.",
      "steps": [
        {
          "title": "Review Student.java before command-line work",
          "why": "Command Prompt ki velladaniki mundu developer project context ni IntelliJ lo quick ga review chestadu. E folder/project meeda commands run cheyyalo clarity vastundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Open Command Prompt at the Java Practice folder",
          "why": "Developer project root nundi commands run cheyyadaniki Command Prompt open chestadu. Current working directory correct ga unte relative paths and build commands expected project meeda work chestayi.",
          "software": "cmd",
          "action": {
            "action": "setCwd",
            "data": {
              "cwd": "C:\\Users\\developer\\JavaPractice"
            }
          }
        },
        {
          "title": "Verify the installed Java runtime",
          "why": "Project run cheyyadaniki mundu java command available undha mariyu expected JDK version use avuthundha ani verify chestam.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "java -version"
            }
          }
        },
        {
          "title": "Check JAVA_HOME",
          "why": "JAVA_HOME correct JDK folder ni point chesthundha ani environment variable ni check chestam. Maven laanti tools ee value ni use cheyyachu.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "echo %JAVA_HOME%"
            }
          }
        },
        {
          "title": "List the project root files",
          "why": "dir /b simple file list ni chupistundi. Developer correct working directory lo unnado quick ga confirm cheyyadaniki idi useful.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "dir /b"
            }
          }
        },
        {
          "title": "Navigate into the src folder",
          "why": "CMD lo folder navigation ki cd command use chestam. Ippudu project root nundi src folder loki move ayyi prompt path change avuthundha ani verify chestunnam.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "cd src"
            }
          }
        },
        {
          "title": "List files inside src",
          "why": "src folder loki vachaka dir /b run chesi current folder content ni verify chestam. Ikkada Student.java kanipinchali.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "dir /b"
            }
          }
        },
        {
          "title": "Navigate back to the project root",
          "why": "cd .. parent folder ki move chestundi. Real CMD navigation lo developer frequently current folder nundi oka level back ki vastadu.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "cd .."
            }
          }
        },
        {
          "title": "Navigate using an absolute Windows path",
          "why": "Relative path tho matrame kaakunda cd /d full Windows path tho kuda folder change cheyyagalali. Ee step direct navigation behavior ni test chestundi.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "cd /d C:\\Users\\developer\\JavaPractice\\docs"
            }
          }
        },
        {
          "title": "Return from docs to the project root",
          "why": "docs nundi cd .. run chesi malli JavaPractice root ki return avutham. Ila forward mariyu backward folder navigation rendu prove avuthayi.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "cd .."
            }
          }
        },
        {
          "title": "Create a build directory",
          "why": "mkdir command virtual Windows filesystem ni actually update chestundi. Ee step CMD simulator display matrame kakunda stateful filesystem behavior kuda test chestundi.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "mkdir build"
            }
          }
        },
        {
          "title": "Set a local environment variable",
          "why": "set command current CMD session lo environment variable create chestundi. Real office workflows lo profiles, ports, credentials placeholders laanti values temporary ga set cheyyadam common.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "set APP_ENV=local"
            }
          }
        },
        {
          "title": "Read the APP_ENV variable",
          "why": "%APP_ENV% expansion correct ga work chesthundha ani echo command tho verify chestam.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "echo %APP_ENV%"
            }
          }
        },
        {
          "title": "Redirect command output into a file",
          "why": "> redirection command output ni console badulu file lo write chestundi. Ee step shell redirection mariyu virtual file creation rendu test chestundi.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "echo build=verified > build\\status.txt"
            }
          }
        },
        {
          "title": "Read the redirected file",
          "why": "type command file content ni console lo print chestundi. Previous step create chesina status.txt state preserve ayyindha ani verify chestam.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "type build\\status.txt"
            }
          }
        },
        {
          "title": "Test a command pipeline",
          "why": "Pipe symbol first command output ni next command input ga pampistundi. CMD workflows lo filtering kosam idi important behavior.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "echo Java Practice | findstr Java"
            }
          }
        },
        {
          "title": "Check Git repository status",
          "why": "Code changes mundu leka taruvatha git status run cheyyadam normal developer workflow. CMD simulator common Git commands ki realistic deterministic output generate chestundi.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "git status"
            }
          }
        },
        {
          "title": "Verify the Java compiler",
          "why": "javac -version tho compiler kuda expected JDK version nundi available undha ani confirm chestam.",
          "software": "cmd",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "javac -version"
            }
          }
        },
        {
          "title": "Return to Student.java after command-line checks",
          "why": "Command-line verification complete ayyaka developer malli IntelliJ ki vastadu. CMD state separate ga reconstruct avuthundi, Java project timeline continuity kuda preserve avuthundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        }
      ]
    }
  ]
};
