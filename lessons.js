window.COURSE = {
  "title": "Java Practice Developer Playback",
  "subtitle": "Lesson-by-lesson reconstruction of the Java teaching repository.",
  "books": [
    {
      "id": "book-1",
      "title": "Java & Developer Tool Foundations",
      "subtitle": "Java fundamentals, PostgreSQL, API testing, VS Code, and Windows command-line development.",
      "chapterStart": 1,
      "chapterEnd": 5
    },
    {
      "id": "book-2",
      "title": "Linux, Database & Delivery Workflow",
      "subtitle": "Linux workstation work, SQL Server, Jira collaboration, and Jenkins CI/CD.",
      "chapterStart": 6,
      "chapterEnd": 9
    },
    {
      "id": "book-3",
      "title": "Power BI Desktop: Full Analytics Feature Tour",
      "subtitle": "A populated campus analytics project covering Report, Table, Model, Power Query, DAX Query, TMDL, visual analytics, performance, mobile, and publishing.",
      "chapterStart": 10,
      "chapterEnd": 10
    },
    {
      "id": "book-4",
      "title": "Source Control & Automation",
      "subtitle": "Git local workflow, GitHub collaboration, and GitHub Actions CI.",
      "chapterStart": 11,
      "chapterEnd": 11
    },
    {
      "id": "book-5",
      "title": "MySQL Workbench: SQL Development & Database Engineering",
      "subtitle": "A populated MySQL project covering SQL editing, schema objects, table design, administration, performance, EER modeling, migration, and preferences.",
      "chapterStart": 12,
      "chapterEnd": 12
    }
  ],
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
      },
      "linux": {
        "distro": "Ubuntu 24.04 LTS",
        "user": "developer",
        "hostname": "java-dev",
        "home": "/home/developer",
        "currentPath": "/home/developer/JavaPractice",
        "activeWindow": "terminal",
        "files": {
          "/home/developer": {
            "type": "dir",
            "owner": "developer",
            "permissions": "drwxr-x---",
            "size": "4.0 KB"
          },
          "/home/developer/JavaPractice": {
            "type": "dir",
            "owner": "developer",
            "permissions": "drwxr-xr-x",
            "size": "4.0 KB"
          },
          "/home/developer/JavaPractice/src": {
            "type": "dir",
            "owner": "developer",
            "permissions": "drwxr-xr-x",
            "size": "4.0 KB"
          },
          "/home/developer/JavaPractice/src/Student.java": {
            "type": "file",
            "owner": "developer",
            "permissions": "-rw-r--r--",
            "content": "public class Student {\n    int rollNo;\n    boolean isPresent;\n    float[] marks;\n    String name;\n}\n"
          },
          "/home/developer/JavaPractice/README.md": {
            "type": "file",
            "owner": "developer",
            "permissions": "-rw-r--r--",
            "content": "# Java Practice\n\nJava 21 developer journey project.\n"
          },
          "/home/developer/JavaPractice/pom.xml": {
            "type": "file",
            "owner": "developer",
            "permissions": "-rw-r--r--",
            "content": "<project>\n  <modelVersion>4.0.0</modelVersion>\n  <groupId>com.javapractice</groupId>\n  <artifactId>java-practice</artifactId>\n  <version>1.0.0</version>\n</project>\n"
          },
          "/home/developer/JavaPractice/scripts": {
            "type": "dir",
            "owner": "developer",
            "permissions": "drwxr-xr-x",
            "size": "4.0 KB"
          },
          "/home/developer/JavaPractice/scripts/health-check.sh": {
            "type": "file",
            "owner": "developer",
            "permissions": "-rw-r--r--",
            "content": "#!/usr/bin/env bash\necho Health check passed\n"
          },
          "/home/developer/JavaPractice/logs": {
            "type": "dir",
            "owner": "developer",
            "permissions": "drwxr-xr-x",
            "size": "4.0 KB"
          },
          "/home/developer/JavaPractice/logs/app.log": {
            "type": "file",
            "owner": "developer",
            "permissions": "-rw-r--r--",
            "content": "2026-09-22 10:58:00 INFO JavaPracticeApplication ready\n2026-09-22 10:59:14 INFO GET /api/students/101 200\n"
          },
          "/etc": {
            "type": "dir",
            "owner": "root",
            "permissions": "drwxr-xr-x",
            "size": "12 KB"
          },
          "/var": {
            "type": "dir",
            "owner": "root",
            "permissions": "drwxr-xr-x",
            "size": "4.0 KB"
          },
          "/var/log": {
            "type": "dir",
            "owner": "root",
            "permissions": "drwxr-xr-x",
            "size": "4.0 KB"
          },
          "/tmp": {
            "type": "dir",
            "owner": "root",
            "permissions": "drwxrwxrwt",
            "size": "4.0 KB"
          }
        },
        "terminal": {
          "env": {
            "JAVA_HOME": "/usr/lib/jvm/java-21-openjdk-amd64",
            "MAVEN_HOME": "/opt/apache-maven-3.9.9",
            "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/jvm/java-21-openjdk-amd64/bin:/opt/apache-maven-3.9.9/bin"
          },
          "history": [],
          "commandHistory": []
        },
        "processes": [
          {
            "pid": 1,
            "name": "systemd",
            "user": "root",
            "cpu": 0.1,
            "memory": "18M"
          },
          {
            "pid": 822,
            "name": "postgres",
            "user": "postgres",
            "cpu": 0.4,
            "memory": "96M"
          },
          {
            "pid": 1307,
            "name": "dockerd",
            "user": "root",
            "cpu": 0.3,
            "memory": "132M"
          }
        ],
        "services": [
          {
            "name": "java-practice.service",
            "description": "Java Practice Spring Boot API",
            "status": "inactive",
            "enabled": true
          },
          {
            "name": "postgresql.service",
            "description": "PostgreSQL database server",
            "status": "active",
            "enabled": true
          },
          {
            "name": "docker.service",
            "description": "Docker Application Container Engine",
            "status": "active",
            "enabled": true
          }
        ],
        "packages": [
          {
            "name": "openjdk-21-jdk",
            "version": "21.0.5",
            "status": "installed",
            "repository": "ubuntu"
          },
          {
            "name": "maven",
            "version": "3.9.9",
            "status": "installed",
            "repository": "apache"
          },
          {
            "name": "git",
            "version": "2.43.0",
            "status": "installed",
            "repository": "ubuntu"
          },
          {
            "name": "curl",
            "version": "8.5.0",
            "status": "installed",
            "repository": "ubuntu"
          },
          {
            "name": "docker.io",
            "version": "28.4.0",
            "status": "installed",
            "repository": "docker"
          }
        ],
        "network": {
          "interfaces": [
            {
              "name": "lo",
              "state": "up",
              "address": "127.0.0.1/8",
              "gateway": ""
            },
            {
              "name": "eth0",
              "state": "up",
              "address": "192.168.1.42/24",
              "gateway": "192.168.1.1"
            }
          ],
          "routes": [
            {
              "destination": "default",
              "gateway": "192.168.1.1",
              "dev": "eth0"
            }
          ],
          "sockets": [
            {
              "protocol": "tcp",
              "state": "LISTEN",
              "local": "127.0.0.1:5432",
              "remote": "0.0.0.0:*",
              "process": "postgres/822"
            },
            {
              "protocol": "tcp",
              "state": "LISTEN",
              "local": "0.0.0.0:22",
              "remote": "0.0.0.0:*",
              "process": "sshd/940"
            }
          ]
        },
        "logs": [
          {
            "id": "l1",
            "time": "10:58:00",
            "level": "info",
            "unit": "java-practice.service",
            "message": "Java Practice service configuration loaded"
          },
          {
            "id": "l2",
            "time": "10:58:05",
            "level": "info",
            "unit": "postgresql.service",
            "message": "database system is ready to accept connections"
          },
          {
            "id": "l3",
            "time": "10:59:00",
            "level": "info",
            "unit": "docker.service",
            "message": "Docker daemon ready"
          }
        ],
        "disks": [
          {
            "device": "/dev/nvme0n1p2",
            "fs": "ext4",
            "size": "120G",
            "used": "38G",
            "available": "76G",
            "percent": "32%",
            "mount": "/"
          },
          {
            "device": "tmpfs",
            "fs": "tmpfs",
            "size": "7.8G",
            "used": "12M",
            "available": "7.8G",
            "percent": "1%",
            "mount": "/run"
          }
        ]
      },
      "sql_server_management_studio": {
        "title": "SQL Server Management Studio 22",
        "version": "22",
        "connected": false,
        "connection": {
          "serverType": "Database Engine",
          "serverName": "localhost",
          "authentication": "Windows Authentication",
          "userName": "developer",
          "database": "JavaPracticeDb"
        },
        "currentDatabase": "JavaPracticeDb",
        "currentUser": "developer",
        "statusText": "Disconnected",
        "databases": [
          {
            "name": "master",
            "system": true,
            "tables": [],
            "views": [],
            "procedures": [],
            "functions": [],
            "users": []
          },
          {
            "name": "JavaPracticeDb",
            "system": false,
            "tables": [],
            "views": [],
            "procedures": [],
            "functions": [],
            "users": [
              {
                "name": "developer"
              }
            ]
          }
        ],
        "expandedNodes": [],
        "queryTabs": [],
        "activeQueryId": null,
        "intellisenseCache": [
          {
            "label": "SELECT",
            "kind": "Keyword"
          },
          {
            "label": "FROM",
            "kind": "Keyword"
          },
          {
            "label": "WHERE",
            "kind": "Keyword"
          },
          {
            "label": "CREATE TABLE",
            "kind": "Keyword"
          },
          {
            "label": "INSERT INTO",
            "kind": "Keyword"
          },
          {
            "label": "dbo",
            "kind": "Schema"
          },
          {
            "label": "student",
            "kind": "Table"
          },
          {
            "label": "roll_no",
            "kind": "Column"
          },
          {
            "label": "is_present",
            "kind": "Column"
          },
          {
            "label": "name",
            "kind": "Column"
          }
        ],
        "sessions": [
          {
            "id": 51,
            "login": "developer",
            "status": "running",
            "command": "SELECT",
            "database": "JavaPracticeDb"
          },
          {
            "id": 52,
            "login": "sa",
            "status": "sleeping",
            "command": "AWAITING COMMAND",
            "database": "master"
          }
        ],
        "agentJobs": [],
        "backups": [],
        "files": {},
        "registeredServers": [
          {
            "name": "Local Java SQL",
            "server": "localhost",
            "group": "Local Server Groups"
          }
        ],
        "linkedServers": [],
        "agentJobHistory": [],
        "options": {
          "lineNumbers": true,
          "wordWrap": false,
          "includeActualPlan": false
        }
      },
      "jira": {
        "siteName": "Java Practice Team",
        "user": "Developer",
        "project": {
          "key": "JAVA",
          "name": "Java Practice API"
        },
        "boardName": "Java Practice Sprint Board",
        "activeView": "board",
        "columns": [
          {
            "id": "todo",
            "name": "TO DO"
          },
          {
            "id": "progress",
            "name": "IN PROGRESS"
          },
          {
            "id": "review",
            "name": "CODE REVIEW"
          },
          {
            "id": "done",
            "name": "DONE"
          }
        ],
        "sprint": {
          "id": "s12",
          "name": "Sprint 12",
          "goal": "Deliver and validate the Student API workflow",
          "status": "active",
          "startDate": "2026-09-21",
          "endDate": "2026-10-02"
        },
        "sprints": [
          {
            "id": "s12",
            "name": "Sprint 12",
            "goal": "Deliver and validate the Student API workflow",
            "status": "active",
            "startDate": "2026-09-21",
            "endDate": "2026-10-02"
          },
          {
            "id": "s13",
            "name": "Sprint 13",
            "goal": "Harden validation and monitoring",
            "status": "future",
            "startDate": "2026-10-05",
            "endDate": "2026-10-16"
          }
        ],
        "versions": [
          {
            "name": "1.2.0",
            "status": "unreleased",
            "releaseDate": "2026-10-02",
            "description": "Student API release"
          }
        ],
        "issues": [
          {
            "key": "JAVA-100",
            "type": "Epic",
            "summary": "Student API delivery",
            "status": "IN PROGRESS",
            "assignee": "Tech Lead",
            "reporter": "Product Owner",
            "priority": "High",
            "points": 13,
            "labels": [
              "student-api"
            ],
            "component": "Student API",
            "description": "Deliver the Student API from model through database and API validation.",
            "sprint": "Sprint 12",
            "fixVersions": [
              "1.2.0"
            ],
            "comments": [],
            "attachments": [],
            "subtasks": [],
            "links": [],
            "activity": [],
            "watchers": [],
            "worklogs": [],
            "development": {
              "branches": [],
              "commits": [],
              "pullRequests": [],
              "builds": [],
              "deployments": []
            }
          },
          {
            "key": "JAVA-101",
            "type": "Story",
            "summary": "Expose GET /api/students/{rollNo}",
            "status": "TO DO",
            "assignee": "Unassigned",
            "reporter": "Tech Lead",
            "priority": "High",
            "points": 5,
            "parent": "JAVA-100",
            "labels": [
              "backend",
              "student-api"
            ],
            "component": "Student API",
            "description": "Implement and verify the Student lookup endpoint using the existing Student model and database record.",
            "sprint": "Sprint 12",
            "fixVersions": [],
            "dueDate": "",
            "originalEstimate": "",
            "remainingEstimate": "",
            "comments": [],
            "attachments": [],
            "subtasks": [],
            "links": [
              {
                "type": "blocks",
                "key": "JAVA-104"
              }
            ],
            "activity": [],
            "watchers": [],
            "worklogs": [],
            "development": {
              "branches": [],
              "commits": [],
              "pullRequests": [],
              "builds": [],
              "deployments": []
            }
          },
          {
            "key": "JAVA-102",
            "type": "Bug",
            "summary": "Return 404 when student roll number is missing",
            "status": "IN PROGRESS",
            "assignee": "Developer",
            "reporter": "QA Engineer",
            "priority": "Medium",
            "points": 3,
            "parent": "JAVA-100",
            "labels": [
              "backend",
              "validation"
            ],
            "component": "Student API",
            "description": "Handle unknown roll numbers with the expected API error response.",
            "sprint": "Sprint 12",
            "fixVersions": [
              "1.2.0"
            ],
            "comments": [],
            "attachments": [],
            "subtasks": [],
            "links": [],
            "activity": [],
            "watchers": [],
            "worklogs": [],
            "development": {
              "branches": [],
              "commits": [],
              "pullRequests": [],
              "builds": [],
              "deployments": []
            }
          },
          {
            "key": "JAVA-103",
            "type": "Story",
            "summary": "Add Student API integration tests",
            "status": "CODE REVIEW",
            "assignee": "Developer",
            "reporter": "Tech Lead",
            "priority": "Medium",
            "points": 3,
            "parent": "JAVA-100",
            "labels": [
              "test",
              "student-api"
            ],
            "component": "Student API",
            "description": "Cover success and not-found scenarios with integration tests.",
            "sprint": "Sprint 12",
            "fixVersions": [
              "1.2.0"
            ],
            "comments": [],
            "attachments": [],
            "subtasks": [],
            "links": [],
            "activity": [],
            "watchers": [],
            "worklogs": [],
            "development": {
              "branches": [
                {
                  "name": "test/JAVA-103-student-api"
                }
              ],
              "commits": [],
              "pullRequests": [
                {
                  "title": "JAVA-103 integration tests",
                  "status": "OPEN"
                }
              ],
              "builds": [],
              "deployments": []
            }
          },
          {
            "key": "JAVA-104",
            "type": "Task",
            "summary": "Document Student API contract",
            "status": "TO DO",
            "assignee": "Developer",
            "reporter": "Tech Lead",
            "priority": "Low",
            "points": 2,
            "parent": "JAVA-100",
            "labels": [
              "docs"
            ],
            "component": "Student API",
            "description": "Document request, response, and error examples for the Student endpoint.",
            "sprint": "Sprint 13",
            "fixVersions": [],
            "comments": [],
            "attachments": [],
            "subtasks": [],
            "links": [
              {
                "type": "is blocked by",
                "key": "JAVA-101"
              }
            ],
            "activity": [],
            "watchers": [],
            "worklogs": [],
            "development": {
              "branches": [],
              "commits": [],
              "pullRequests": [],
              "builds": [],
              "deployments": []
            }
          }
        ],
        "components": [
          {
            "name": "Student API",
            "lead": "Tech Lead",
            "description": "Student REST API and persistence workflow",
            "issueCount": 5
          }
        ],
        "filters": [
          {
            "name": "My active Java work",
            "jql": "project = JAVA AND assignee = currentUser() AND status != DONE ORDER BY key ASC"
          }
        ],
        "quickFilters": [],
        "automations": [],
        "workflows": [
          {
            "name": "Java Delivery Workflow",
            "statuses": [
              "TO DO",
              "IN PROGRESS",
              "CODE REVIEW",
              "DONE"
            ]
          }
        ],
        "dashboard": {
          "gadgets": [
            {
              "type": "assigned",
              "title": "Assigned to me"
            },
            {
              "type": "sprint-health",
              "title": "Sprint health"
            },
            {
              "type": "created-resolved",
              "title": "Created vs resolved"
            },
            {
              "type": "activity",
              "title": "Activity stream"
            }
          ]
        }
      },
      "jenkins": {
        "title": "Dashboard",
        "user": "developer",
        "description": "CI/CD for the Java Practice Student API",
        "jobs": [
          {
            "name": "java-practice-api",
            "type": "Pipeline",
            "description": "Build, test, package, and validate the Java Practice Student API.",
            "status": "failed",
            "health": 82,
            "lastSuccess": "#40",
            "lastFailure": "#41",
            "duration": "29 sec",
            "config": {
              "jenkinsfile": "pipeline {\n    agent { label 'linux && java21' }\n    tools {\n        jdk 'JDK 21'\n        maven 'Maven 3.9'\n    }\n    parameters {\n        choice(name: 'TARGET_ENV', choices: ['qa', 'staging'], description: 'Deployment target')\n    }\n    stages {\n        stage('Checkout') { steps { checkout scm } }\n        stage('Build') { steps { sh 'mvn -B clean package -DskipTests' } }\n        stage('Test') {\n            parallel {\n                stage('Unit') { steps { sh 'mvn -B test' } }\n                stage('Integration') { steps { sh 'mvn -B verify -Pintegration' } }\n            }\n        }\n        stage('Package') { steps { archiveArtifacts artifacts: 'target/*.jar', fingerprint: true } }\n        stage('Deploy QA') { steps { echo \"Deploying to ${params.TARGET_ENV}\" } }\n    }\n    post {\n        always { junit 'target/surefire-reports/*.xml' }\n    }\n}",
              "pipelineDefinition": "Pipeline script from SCM",
              "scriptPath": "Jenkinsfile",
              "scm": {
                "type": "Git",
                "url": "https://github.com/example/java-practice.git",
                "branch": "*/main",
                "credentials": "github-token"
              },
              "parameterized": true,
              "agentLabel": "linux && java21",
              "buildDiscarder": "Keep 14 day(s), 30 build(s)"
            },
            "parameters": [
              {
                "name": "TARGET_ENV",
                "type": "Choice",
                "default": "qa",
                "description": "Deployment target",
                "choices": [
                  "qa",
                  "staging"
                ]
              }
            ],
            "env": {
              "JAVA_HOME": "/usr/lib/jvm/java-21-openjdk-amd64",
              "MAVEN_OPTS": "-Xmx1024m"
            },
            "triggers": [
              {
                "type": "cron",
                "value": "H/15 * * * *"
              }
            ],
            "postBuildActions": [
              {
                "type": "junit",
                "config": {
                  "patterns": "target/surefire-reports/*.xml"
                }
              }
            ],
            "pipeline": [
              {
                "name": "Checkout",
                "status": "success",
                "duration": "3s",
                "log": "Checking out main\nCheckout completed."
              },
              {
                "name": "Build",
                "status": "success",
                "duration": "14s",
                "log": "mvn -B clean package -DskipTests\nBUILD SUCCESS"
              },
              {
                "name": "Test",
                "status": "failed",
                "duration": "9s",
                "parallel": true,
                "branches": [
                  {
                    "name": "Unit",
                    "status": "success",
                    "duration": "4s",
                    "log": "42 tests passed."
                  },
                  {
                    "name": "Integration",
                    "status": "failed",
                    "duration": "9s",
                    "log": "StudentApiIntegrationTest expected 200 but received 500."
                  }
                ],
                "log": "Integration test failed."
              },
              {
                "name": "Package",
                "status": "skipped",
                "duration": "",
                "log": "Skipped because tests failed."
              },
              {
                "name": "Deploy QA",
                "status": "skipped",
                "duration": "",
                "log": "Skipped because tests failed."
              }
            ],
            "builds": [
              {
                "number": 41,
                "status": "failed",
                "time": "Today, 13:18",
                "duration": "29 sec",
                "durationSeconds": 29,
                "progress": 100,
                "cause": "Started by user developer",
                "console": "Started by user developer\nRunning on linux-java21-agent\n[Pipeline] Checkout\nChecking out main\n[Pipeline] Build\nBUILD SUCCESS\n[Pipeline] Test\n42 unit tests passed\nERROR StudentApiIntegrationTest: expected 200 but received 500\nFinished: FAILURE",
                "stages": [
                  {
                    "name": "Checkout",
                    "status": "success",
                    "duration": "3s",
                    "log": "Checking out main\nCheckout completed."
                  },
                  {
                    "name": "Build",
                    "status": "success",
                    "duration": "14s",
                    "log": "mvn -B clean package -DskipTests\nBUILD SUCCESS"
                  },
                  {
                    "name": "Test",
                    "status": "failed",
                    "duration": "9s",
                    "parallel": true,
                    "branches": [
                      {
                        "name": "Unit",
                        "status": "success",
                        "duration": "4s",
                        "log": "42 tests passed."
                      },
                      {
                        "name": "Integration",
                        "status": "failed",
                        "duration": "9s",
                        "log": "StudentApiIntegrationTest expected 200 but received 500."
                      }
                    ],
                    "log": "Integration test failed."
                  },
                  {
                    "name": "Package",
                    "status": "skipped",
                    "duration": "",
                    "log": "Skipped because tests failed."
                  },
                  {
                    "name": "Deploy QA",
                    "status": "skipped",
                    "duration": "",
                    "log": "Skipped because tests failed."
                  }
                ],
                "testResults": {
                  "total": 43,
                  "passed": 42,
                  "failed": 1,
                  "tests": [
                    {
                      "name": "getStudent_returns200",
                      "suite": "StudentApiIntegrationTest",
                      "status": "failed",
                      "duration": "0.34s",
                      "message": "Expected 200, received 500",
                      "stackTrace": "at StudentApiIntegrationTest.java:74",
                      "output": "GET /api/students/101 => 500"
                    },
                    {
                      "name": "studentModel_mapsFields",
                      "suite": "StudentServiceTest",
                      "status": "passed",
                      "duration": "0.02s"
                    }
                  ]
                },
                "artifacts": [],
                "environment": {
                  "JAVA_HOME": "/usr/lib/jvm/java-21-openjdk-amd64",
                  "BUILD_NUMBER": "41",
                  "TARGET_ENV": "qa"
                },
                "parameters": {
                  "TARGET_ENV": "qa"
                }
              },
              {
                "number": 40,
                "status": "success",
                "time": "Yesterday, 16:02",
                "duration": "31 sec",
                "durationSeconds": 31,
                "progress": 100,
                "cause": "GitHub push by developer",
                "console": "Finished: SUCCESS",
                "stages": [
                  {
                    "name": "Checkout",
                    "status": "success",
                    "duration": "3s",
                    "log": "Checking out main\nCheckout completed."
                  },
                  {
                    "name": "Build",
                    "status": "success",
                    "duration": "13s",
                    "log": "mvn -B clean package -DskipTests\nBUILD SUCCESS"
                  },
                  {
                    "name": "Test",
                    "status": "success",
                    "duration": "11s",
                    "parallel": true,
                    "branches": [
                      {
                        "name": "Unit",
                        "status": "success",
                        "duration": "4s",
                        "log": "42 tests passed."
                      },
                      {
                        "name": "Integration",
                        "status": "success",
                        "duration": "11s",
                        "log": "Student API integration tests passed."
                      }
                    ],
                    "log": "All tests passed."
                  },
                  {
                    "name": "Package",
                    "status": "success",
                    "duration": "2s",
                    "log": "Archived target/java-practice-1.0.0.jar"
                  },
                  {
                    "name": "Deploy QA",
                    "status": "success",
                    "duration": "5s",
                    "log": "QA deployment completed."
                  }
                ],
                "testResults": {
                  "total": 42,
                  "passed": 42,
                  "failed": 0,
                  "tests": []
                },
                "artifacts": [
                  {
                    "name": "target/java-practice-1.0.0.jar",
                    "size": "18.4 MB"
                  }
                ],
                "environment": {
                  "JAVA_HOME": "/usr/lib/jvm/java-21-openjdk-amd64",
                  "BUILD_NUMBER": "40",
                  "TARGET_ENV": "qa"
                },
                "parameters": {
                  "TARGET_ENV": "qa"
                }
              }
            ],
            "workspace": [
              {
                "path": "Jenkinsfile",
                "content": "pipeline {\n    agent { label 'linux && java21' }\n    tools {\n        jdk 'JDK 21'\n        maven 'Maven 3.9'\n    }\n    parameters {\n        choice(name: 'TARGET_ENV', choices: ['qa', 'staging'], description: 'Deployment target')\n    }\n    stages {\n        stage('Checkout') { steps { checkout scm } }\n        stage('Build') { steps { sh 'mvn -B clean package -DskipTests' } }\n        stage('Test') {\n            parallel {\n                stage('Unit') { steps { sh 'mvn -B test' } }\n                stage('Integration') { steps { sh 'mvn -B verify -Pintegration' } }\n            }\n        }\n        stage('Package') { steps { archiveArtifacts artifacts: 'target/*.jar', fingerprint: true } }\n        stage('Deploy QA') { steps { echo \"Deploying to ${params.TARGET_ENV}\" } }\n    }\n    post {\n        always { junit 'target/surefire-reports/*.xml' }\n    }\n}"
              },
              {
                "path": "pom.xml",
                "content": "<project>\\n  <modelVersion>4.0.0</modelVersion>\\n  <artifactId>java-practice</artifactId>\\n</project>"
              },
              {
                "path": "src/Student.java",
                "content": "public class Student {\\n    int rollNo;\\n    boolean isPresent;\\n    float[] marks;\\n    String name;\\n}\\n"
              },
              {
                "path": "src/test/StudentApiIntegrationTest.java",
                "content": "class StudentApiIntegrationTest { /* integration coverage */ }"
              }
            ],
            "changes": [
              {
                "hash": "8f4c2ad",
                "message": "JAVA-101 implement student lookup endpoint",
                "author": "Developer",
                "time": "Today, 13:12",
                "files": [
                  {
                    "path": "src/Student.java",
                    "diff": "@@ Student.java @@\\n class Student {\\n+    int rollNo;\\n+    String name;\\n }"
                  }
                ]
              }
            ]
          },
          {
            "name": "java-practice-docs",
            "type": "Freestyle project",
            "description": "Publish Java Practice developer documentation.",
            "status": "success",
            "health": 100,
            "lastSuccess": "#12",
            "lastFailure": "",
            "duration": "12 sec",
            "config": {},
            "pipeline": [],
            "builds": [
              {
                "number": 12,
                "status": "success",
                "time": "Today, 09:04",
                "duration": "12 sec",
                "progress": 100,
                "console": "Documentation generated.\\nFinished: SUCCESS"
              }
            ],
            "folder": "Java Practice"
          }
        ],
        "queue": [],
        "views": [
          {
            "name": "Java Pipelines",
            "jobs": [
              "java-practice-api"
            ]
          }
        ],
        "folders": [
          {
            "name": "Java Practice",
            "description": "Java developer CI/CD jobs",
            "jobs": [
              "java-practice-api",
              "java-practice-docs"
            ]
          }
        ],
        "multibranch": [
          {
            "name": "java-practice-branches",
            "repository": "https://github.com/example/java-practice.git",
            "branches": [
              {
                "name": "main",
                "status": "failed",
                "job": "java-practice-api"
              },
              {
                "name": "feature/JAVA-101-student-get",
                "status": "success",
                "pullRequest": 101,
                "log": "Jenkinsfile found and branch indexed."
              }
            ],
            "lastScan": "Today, 13:10",
            "scanLog": "Found main\\nFound PR-101\\nScan completed."
          }
        ],
        "manage": {
          "credentials": [
            {
              "id": "github-token",
              "type": "Username with password",
              "username": "developer",
              "description": "GitHub SCM credential",
              "scope": "Global",
              "domain": "Global credentials"
            }
          ],
          "nodes": [
            {
              "name": "linux-java21-agent",
              "online": true,
              "labels": [
                "linux",
                "java21",
                "docker"
              ],
              "executors": 2,
              "remoteFS": "/var/jenkins",
              "launchMethod": "Inbound agent",
              "log": "Agent connected\\nJDK 21 available\\nMaven 3.9 available\\n2 executors ready."
            },
            {
              "name": "windows-agent",
              "online": false,
              "labels": [
                "windows"
              ],
              "executors": 1,
              "remoteFS": "C:\\\\Jenkins",
              "log": "Agent offline."
            }
          ],
          "plugins": [
            {
              "id": "git",
              "name": "Git",
              "version": "5.7.0",
              "availableVersion": "5.8.0",
              "installed": true,
              "enabled": true,
              "description": "Git source control integration."
            },
            {
              "id": "workflow-aggregator",
              "name": "Pipeline",
              "version": "600",
              "installed": true,
              "enabled": true,
              "description": "Jenkins Pipeline suite."
            },
            {
              "id": "junit",
              "name": "JUnit",
              "version": "1300",
              "installed": true,
              "enabled": true,
              "description": "JUnit test reports and trends."
            }
          ],
          "tools": [
            {
              "name": "JDK 21",
              "type": "JDK",
              "version": "21",
              "home": "/usr/lib/jvm/java-21-openjdk-amd64"
            },
            {
              "name": "Maven 3.9",
              "type": "Maven",
              "version": "3.9.9",
              "home": "/opt/apache-maven-3.9.9"
            }
          ],
          "security": {
            "realm": "Jenkins user database",
            "authorization": "Matrix-based security",
            "csrf": true,
            "permissions": [
              "admin:Overall/Administer",
              "developer:Job/Build",
              "developer:Job/Read"
            ]
          },
          "sharedLibraries": [
            {
              "name": "java-ci",
              "defaultVersion": "main",
              "repository": "https://github.com/example/jenkins-shared-library.git"
            }
          ],
          "systemLog": [
            "INFO Jenkins is ready",
            "INFO Connected agent linux-java21-agent"
          ]
        }
      },
      "power_bi": {
        "title": "Campus Performance Analytics - Power BI Desktop",
        "reportName": "Campus Performance Analytics",
        "activeView": "report",
        "theme": "light",
        "ribbonTab": "Home",
        "paneTab": "data",
        "statusText": "Campus Performance Analytics • 6 tables • 5 relationships",
        "canvasZoom": 100,
        "canvasFit": "Fit to page",
        "gridlines": false,
        "snapToGrid": true,
        "lockObjects": false,
        "storageMode": "Import",
        "sources": [
          {
            "name": "JavaPracticeDb",
            "connector": "SQL Server",
            "server": "localhost",
            "database": "JavaPracticeDb"
          }
        ],
        "navigator": {
          "items": [
            {
              "name": "Department"
            },
            {
              "name": "Course"
            },
            {
              "name": "Student"
            },
            {
              "name": "Enrollment"
            },
            {
              "name": "Attendance"
            },
            {
              "name": "Calendar"
            }
          ],
          "selected": [
            "Department",
            "Course",
            "Student",
            "Enrollment",
            "Attendance",
            "Calendar"
          ],
          "preview": "Student"
        },
        "tables": [
          {
            "name": "Department",
            "x": 60,
            "y": 80,
            "columns": [
              {
                "name": "department_id",
                "type": "Whole Number"
              },
              {
                "name": "department",
                "type": "Text"
              },
              {
                "name": "dean",
                "type": "Text"
              }
            ],
            "rows": [
              [
                10,
                "Computer Science",
                "Dr. Patel"
              ],
              [
                20,
                "Business",
                "Dr. Harris"
              ],
              [
                30,
                "GIS",
                "Dr. Rao"
              ],
              [
                40,
                "Data Science",
                "Dr. Chen"
              ]
            ]
          },
          {
            "name": "Course",
            "x": 350,
            "y": 70,
            "columns": [
              {
                "name": "course_id",
                "type": "Whole Number"
              },
              {
                "name": "course_name",
                "type": "Text"
              },
              {
                "name": "department_id",
                "type": "Whole Number"
              },
              {
                "name": "credits",
                "type": "Whole Number"
              },
              {
                "name": "instructor",
                "type": "Text"
              }
            ],
            "rows": [
              [
                101,
                "Java Programming",
                10,
                4,
                "Prof. Kim"
              ],
              [
                102,
                "Database Systems",
                10,
                4,
                "Prof. Lee"
              ],
              [
                201,
                "Business Analytics",
                20,
                3,
                "Prof. Smith"
              ],
              [
                301,
                "GIS Applications",
                30,
                4,
                "Prof. Rao"
              ],
              [
                401,
                "Data Visualization",
                40,
                3,
                "Prof. Chen"
              ]
            ]
          },
          {
            "name": "Student",
            "x": 60,
            "y": 390,
            "columns": [
              {
                "name": "student_id",
                "type": "Whole Number"
              },
              {
                "name": "Student Name",
                "type": "Text"
              },
              {
                "name": "gender",
                "type": "Text"
              },
              {
                "name": "city",
                "type": "Text",
                "dataCategory": "City"
              },
              {
                "name": "admission_year",
                "type": "Whole Number"
              },
              {
                "name": "risk_status",
                "type": "Text"
              }
            ],
            "rows": [
              [
                1,
                "Asha Patel",
                "F",
                "Austin",
                2024,
                "On Track"
              ],
              [
                2,
                "Ravi Kumar",
                "M",
                "Round Rock",
                2024,
                "At Risk"
              ],
              [
                3,
                "Maya Chen",
                "F",
                "Cedar Park",
                2025,
                "High Performer"
              ],
              [
                4,
                "Noah Williams",
                "M",
                "Leander",
                2025,
                "On Track"
              ],
              [
                5,
                "Sofia Garcia",
                "F",
                "Austin",
                2024,
                "High Performer"
              ],
              [
                6,
                "Ethan Brown",
                "M",
                "Georgetown",
                2023,
                "At Risk"
              ],
              [
                7,
                "Isha Rao",
                "F",
                "Leander",
                2025,
                "On Track"
              ],
              [
                8,
                "Liam Johnson",
                "M",
                "Austin",
                2023,
                "On Track"
              ]
            ]
          },
          {
            "name": "Enrollment",
            "x": 350,
            "y": 380,
            "columns": [
              {
                "name": "enrollment_id",
                "type": "Whole Number"
              },
              {
                "name": "student_id",
                "type": "Whole Number"
              },
              {
                "name": "course_id",
                "type": "Whole Number"
              },
              {
                "name": "semester",
                "type": "Text"
              },
              {
                "name": "score",
                "type": "Whole Number"
              },
              {
                "name": "grade",
                "type": "Text"
              },
              {
                "name": "performance_band",
                "type": "Text"
              }
            ],
            "rows": [
              [
                1,
                1,
                101,
                "Spring 2026",
                94,
                "A",
                "Excellent"
              ],
              [
                2,
                2,
                102,
                "Spring 2026",
                78,
                "C",
                "Needs Support"
              ],
              [
                3,
                3,
                101,
                "Spring 2026",
                97,
                "A",
                "Excellent"
              ],
              [
                4,
                4,
                301,
                "Spring 2026",
                88,
                "B",
                "Good"
              ],
              [
                5,
                5,
                401,
                "Spring 2026",
                95,
                "A",
                "Excellent"
              ],
              [
                6,
                6,
                201,
                "Spring 2026",
                74,
                "C",
                "Needs Support"
              ],
              [
                7,
                7,
                301,
                "Spring 2026",
                90,
                "A",
                "Excellent"
              ],
              [
                8,
                8,
                102,
                "Spring 2026",
                84,
                "B",
                "Good"
              ],
              [
                9,
                1,
                401,
                "Fall 2025",
                91,
                "A",
                "Excellent"
              ],
              [
                10,
                4,
                102,
                "Fall 2025",
                86,
                "B",
                "Good"
              ]
            ]
          },
          {
            "name": "Attendance",
            "x": 660,
            "y": 370,
            "columns": [
              {
                "name": "attendance_id",
                "type": "Whole Number"
              },
              {
                "name": "student_id",
                "type": "Whole Number"
              },
              {
                "name": "Date",
                "type": "Date"
              },
              {
                "name": "present",
                "type": "Text"
              },
              {
                "name": "attendance_pct",
                "type": "Decimal Number"
              }
            ],
            "rows": [
              [
                1,
                1,
                "2026-01-15",
                "Y",
                96
              ],
              [
                2,
                2,
                "2026-01-15",
                "Y",
                82
              ],
              [
                3,
                3,
                "2026-01-15",
                "Y",
                99
              ],
              [
                4,
                4,
                "2026-01-15",
                "Y",
                93
              ],
              [
                5,
                5,
                "2026-01-15",
                "Y",
                98
              ],
              [
                6,
                6,
                "2026-01-15",
                "N",
                76
              ],
              [
                7,
                7,
                "2026-01-15",
                "Y",
                94
              ],
              [
                8,
                8,
                "2026-01-15",
                "Y",
                91
              ]
            ]
          },
          {
            "name": "Calendar",
            "x": 670,
            "y": 80,
            "columns": [
              {
                "name": "Date",
                "type": "Date"
              },
              {
                "name": "Month",
                "type": "Text"
              },
              {
                "name": "MonthNo",
                "type": "Whole Number"
              },
              {
                "name": "Quarter",
                "type": "Text"
              },
              {
                "name": "Year",
                "type": "Whole Number"
              }
            ],
            "rows": [
              [
                "2026-01-01",
                "Jan",
                1,
                "Q1",
                2026
              ],
              [
                "2026-02-01",
                "Feb",
                2,
                "Q1",
                2026
              ],
              [
                "2026-03-01",
                "Mar",
                3,
                "Q1",
                2026
              ],
              [
                "2026-04-01",
                "Apr",
                4,
                "Q2",
                2026
              ],
              [
                "2026-05-01",
                "May",
                5,
                "Q2",
                2026
              ],
              [
                "2026-06-01",
                "Jun",
                6,
                "Q2",
                2026
              ]
            ],
            "dateTable": true
          }
        ],
        "queries": [
          {
            "id": "Department",
            "name": "Department",
            "columns": [
              {
                "name": "department_id",
                "type": "Whole Number"
              },
              {
                "name": "department",
                "type": "Text"
              },
              {
                "name": "dean",
                "type": "Text"
              }
            ],
            "rows": [
              [
                10,
                "Computer Science",
                "Dr. Patel"
              ],
              [
                20,
                "Business",
                "Dr. Harris"
              ],
              [
                30,
                "GIS",
                "Dr. Rao"
              ],
              [
                40,
                "Data Science",
                "Dr. Chen"
              ]
            ],
            "steps": [
              {
                "name": "Source",
                "action": "source",
                "formula": "Sql.Database(\"localhost\", \"JavaPracticeDb\")"
              },
              {
                "name": "Navigation",
                "action": "navigation"
              },
              {
                "name": "Changed Type",
                "action": "changeDataType"
              }
            ]
          },
          {
            "id": "Course",
            "name": "Course",
            "columns": [
              {
                "name": "course_id",
                "type": "Whole Number"
              },
              {
                "name": "course_name",
                "type": "Text"
              },
              {
                "name": "department_id",
                "type": "Whole Number"
              },
              {
                "name": "credits",
                "type": "Whole Number"
              },
              {
                "name": "instructor",
                "type": "Text"
              }
            ],
            "rows": [
              [
                101,
                "Java Programming",
                10,
                4,
                "Prof. Kim"
              ],
              [
                102,
                "Database Systems",
                10,
                4,
                "Prof. Lee"
              ],
              [
                201,
                "Business Analytics",
                20,
                3,
                "Prof. Smith"
              ],
              [
                301,
                "GIS Applications",
                30,
                4,
                "Prof. Rao"
              ],
              [
                401,
                "Data Visualization",
                40,
                3,
                "Prof. Chen"
              ]
            ],
            "steps": [
              {
                "name": "Source",
                "action": "source",
                "formula": "Source{[Schema=\"dbo\",Item=\"Course\"]}[Data]"
              },
              {
                "name": "Navigation",
                "action": "navigation"
              },
              {
                "name": "Changed Type",
                "action": "changeDataType"
              }
            ]
          },
          {
            "id": "Student",
            "name": "Student",
            "columns": [
              {
                "name": "student_id",
                "type": "Whole Number"
              },
              {
                "name": "Student Name",
                "type": "Text"
              },
              {
                "name": "gender",
                "type": "Text"
              },
              {
                "name": "city",
                "type": "Text",
                "dataCategory": "City"
              },
              {
                "name": "admission_year",
                "type": "Whole Number"
              },
              {
                "name": "risk_status",
                "type": "Text"
              }
            ],
            "rows": [
              [
                1,
                "Asha Patel",
                "F",
                "Austin",
                2024,
                "On Track"
              ],
              [
                2,
                "Ravi Kumar",
                "M",
                "Round Rock",
                2024,
                "At Risk"
              ],
              [
                3,
                "Maya Chen",
                "F",
                "Cedar Park",
                2025,
                "High Performer"
              ],
              [
                4,
                "Noah Williams",
                "M",
                "Leander",
                2025,
                "On Track"
              ],
              [
                5,
                "Sofia Garcia",
                "F",
                "Austin",
                2024,
                "High Performer"
              ],
              [
                6,
                "Ethan Brown",
                "M",
                "Georgetown",
                2023,
                "At Risk"
              ],
              [
                7,
                "Isha Rao",
                "F",
                "Leander",
                2025,
                "On Track"
              ],
              [
                8,
                "Liam Johnson",
                "M",
                "Austin",
                2023,
                "On Track"
              ]
            ],
            "steps": [
              {
                "name": "Source",
                "action": "source",
                "formula": "Source{[Schema=\"dbo\",Item=\"Student\"]}[Data]"
              },
              {
                "name": "Navigation",
                "action": "navigation"
              },
              {
                "name": "Changed Type",
                "action": "changeDataType"
              },
              {
                "name": "Trimmed Text",
                "action": "trimColumn"
              },
              {
                "name": "Added Risk Label",
                "action": "addConditionalColumn"
              }
            ]
          },
          {
            "id": "Enrollment",
            "name": "Enrollment",
            "columns": [
              {
                "name": "enrollment_id",
                "type": "Whole Number"
              },
              {
                "name": "student_id",
                "type": "Whole Number"
              },
              {
                "name": "course_id",
                "type": "Whole Number"
              },
              {
                "name": "semester",
                "type": "Text"
              },
              {
                "name": "score",
                "type": "Whole Number"
              },
              {
                "name": "grade",
                "type": "Text"
              },
              {
                "name": "performance_band",
                "type": "Text"
              }
            ],
            "rows": [
              [
                1,
                1,
                101,
                "Spring 2026",
                94,
                "A",
                "Excellent"
              ],
              [
                2,
                2,
                102,
                "Spring 2026",
                78,
                "C",
                "Needs Support"
              ],
              [
                3,
                3,
                101,
                "Spring 2026",
                97,
                "A",
                "Excellent"
              ],
              [
                4,
                4,
                301,
                "Spring 2026",
                88,
                "B",
                "Good"
              ],
              [
                5,
                5,
                401,
                "Spring 2026",
                95,
                "A",
                "Excellent"
              ],
              [
                6,
                6,
                201,
                "Spring 2026",
                74,
                "C",
                "Needs Support"
              ],
              [
                7,
                7,
                301,
                "Spring 2026",
                90,
                "A",
                "Excellent"
              ],
              [
                8,
                8,
                102,
                "Spring 2026",
                84,
                "B",
                "Good"
              ],
              [
                9,
                1,
                401,
                "Fall 2025",
                91,
                "A",
                "Excellent"
              ],
              [
                10,
                4,
                102,
                "Fall 2025",
                86,
                "B",
                "Good"
              ]
            ],
            "steps": [
              {
                "name": "Source",
                "action": "source",
                "formula": "Source{[Schema=\"dbo\",Item=\"Enrollment\"]}[Data]"
              },
              {
                "name": "Navigation",
                "action": "navigation"
              },
              {
                "name": "Changed Type",
                "action": "changeDataType"
              },
              {
                "name": "Added Performance Band",
                "action": "addConditionalColumn"
              }
            ]
          },
          {
            "id": "Attendance",
            "name": "Attendance",
            "columns": [
              {
                "name": "attendance_id",
                "type": "Whole Number"
              },
              {
                "name": "student_id",
                "type": "Whole Number"
              },
              {
                "name": "Date",
                "type": "Date"
              },
              {
                "name": "present",
                "type": "Text"
              },
              {
                "name": "attendance_pct",
                "type": "Decimal Number"
              }
            ],
            "rows": [
              [
                1,
                1,
                "2026-01-15",
                "Y",
                96
              ],
              [
                2,
                2,
                "2026-01-15",
                "Y",
                82
              ],
              [
                3,
                3,
                "2026-01-15",
                "Y",
                99
              ],
              [
                4,
                4,
                "2026-01-15",
                "Y",
                93
              ],
              [
                5,
                5,
                "2026-01-15",
                "Y",
                98
              ],
              [
                6,
                6,
                "2026-01-15",
                "N",
                76
              ],
              [
                7,
                7,
                "2026-01-15",
                "Y",
                94
              ],
              [
                8,
                8,
                "2026-01-15",
                "Y",
                91
              ]
            ],
            "steps": [
              {
                "name": "Source",
                "action": "source",
                "formula": "Source{[Schema=\"dbo\",Item=\"Attendance\"]}[Data]"
              },
              {
                "name": "Navigation",
                "action": "navigation"
              },
              {
                "name": "Changed Type",
                "action": "changeDataType"
              }
            ]
          },
          {
            "id": "Calendar",
            "name": "Calendar",
            "columns": [
              {
                "name": "Date",
                "type": "Date"
              },
              {
                "name": "Month",
                "type": "Text"
              },
              {
                "name": "MonthNo",
                "type": "Whole Number"
              },
              {
                "name": "Quarter",
                "type": "Text"
              },
              {
                "name": "Year",
                "type": "Whole Number"
              }
            ],
            "rows": [
              [
                "2026-01-01",
                "Jan",
                1,
                "Q1",
                2026
              ],
              [
                "2026-02-01",
                "Feb",
                2,
                "Q1",
                2026
              ],
              [
                "2026-03-01",
                "Mar",
                3,
                "Q1",
                2026
              ],
              [
                "2026-04-01",
                "Apr",
                4,
                "Q2",
                2026
              ],
              [
                "2026-05-01",
                "May",
                5,
                "Q2",
                2026
              ],
              [
                "2026-06-01",
                "Jun",
                6,
                "Q2",
                2026
              ]
            ],
            "steps": [
              {
                "name": "Source",
                "action": "source",
                "formula": "Source{[Schema=\"dbo\",Item=\"Calendar\"]}[Data]"
              },
              {
                "name": "Navigation",
                "action": "navigation"
              },
              {
                "name": "Changed Type",
                "action": "changeDataType"
              }
            ]
          }
        ],
        "relationships": [
          {
            "id": "department_course",
            "fromTable": "Department",
            "fromColumn": "department_id",
            "toTable": "Course",
            "toColumn": "department_id",
            "cardinality": "1:*",
            "crossFilter": "Single",
            "active": true
          },
          {
            "id": "course_enrollment",
            "fromTable": "Course",
            "fromColumn": "course_id",
            "toTable": "Enrollment",
            "toColumn": "course_id",
            "cardinality": "1:*",
            "crossFilter": "Single",
            "active": true
          },
          {
            "id": "student_enrollment",
            "fromTable": "Student",
            "fromColumn": "student_id",
            "toTable": "Enrollment",
            "toColumn": "student_id",
            "cardinality": "1:*",
            "crossFilter": "Single",
            "active": true
          },
          {
            "id": "student_attendance",
            "fromTable": "Student",
            "fromColumn": "student_id",
            "toTable": "Attendance",
            "toColumn": "student_id",
            "cardinality": "1:*",
            "crossFilter": "Single",
            "active": true
          },
          {
            "id": "calendar_attendance",
            "fromTable": "Calendar",
            "fromColumn": "Date",
            "toTable": "Attendance",
            "toColumn": "Date",
            "cardinality": "1:*",
            "crossFilter": "Single",
            "active": true
          }
        ],
        "measures": [
          {
            "id": "m_total_students",
            "name": "Total Students",
            "table": "Measures",
            "dax": "DISTINCTCOUNT(Student[student_id])",
            "format": "0",
            "folder": "Enrollment KPIs"
          },
          {
            "id": "m_avg_score",
            "name": "Average Score",
            "table": "Measures",
            "dax": "AVERAGE(Enrollment[score])",
            "format": "0.0",
            "folder": "Academic KPIs"
          },
          {
            "id": "m_attendance",
            "name": "Attendance %",
            "table": "Measures",
            "dax": "AVERAGE(Attendance[attendance_pct]) / 100",
            "format": "0.0%",
            "folder": "Attendance KPIs"
          },
          {
            "id": "m_at_risk",
            "name": "At Risk Students",
            "table": "Measures",
            "dax": "CALCULATE([Total Students], Student[risk_status] = \"At Risk\")",
            "format": "0",
            "folder": "Student Risk"
          },
          {
            "id": "m_enrollments",
            "name": "Total Enrollments",
            "table": "Measures",
            "dax": "COUNTROWS(Enrollment)",
            "format": "0",
            "folder": "Enrollment KPIs"
          },
          {
            "id": "m_high",
            "name": "High Performers",
            "table": "Measures",
            "dax": "CALCULATE(DISTINCTCOUNT(Enrollment[student_id]), Enrollment[score] >= 90)",
            "format": "0",
            "folder": "Academic KPIs"
          }
        ],
        "calculatedColumns": [
          {
            "table": "Enrollment",
            "name": "Performance Band",
            "dax": "IF(Enrollment[score]>=90,\"Excellent\",IF(Enrollment[score]>=80,\"Good\",\"Needs Support\"))"
          }
        ],
        "calculatedTables": [],
        "pages": [
          {
            "id": "page1",
            "name": "Executive Overview",
            "hidden": false,
            "visuals": [
              {
                "id": "kpiStudents",
                "type": "card",
                "title": "Total Students",
                "x": 18,
                "y": 18,
                "w": 210,
                "h": 82,
                "data": {
                  "value": "8"
                }
              },
              {
                "id": "kpiScore",
                "type": "card",
                "title": "Average Score",
                "x": 246,
                "y": 18,
                "w": 210,
                "h": 82,
                "data": {
                  "value": "88.7"
                }
              },
              {
                "id": "kpiAttendance",
                "type": "card",
                "title": "Attendance %",
                "x": 474,
                "y": 18,
                "w": 210,
                "h": 82,
                "data": {
                  "value": "91.1%"
                }
              },
              {
                "id": "kpiRisk",
                "type": "card",
                "title": "At Risk Students",
                "x": 702,
                "y": 18,
                "w": 210,
                "h": 82,
                "data": {
                  "value": "2"
                }
              },
              {
                "id": "scoreByDept",
                "type": "clusteredColumn",
                "title": "Average Score by Department",
                "x": 18,
                "y": 120,
                "w": 445,
                "h": 205,
                "data": {
                  "categories": [
                    "CS",
                    "Business",
                    "GIS",
                    "Data Science"
                  ],
                  "values": [
                    88,
                    74,
                    89,
                    95
                  ]
                }
              },
              {
                "id": "attendanceTrend",
                "type": "line",
                "title": "Attendance Trend",
                "x": 480,
                "y": 120,
                "w": 432,
                "h": 205,
                "data": {
                  "categories": [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun"
                  ],
                  "values": [
                    89,
                    90,
                    92,
                    91,
                    93,
                    94
                  ]
                }
              },
              {
                "id": "semesterSlicer",
                "type": "slicer",
                "title": "Semester",
                "x": 18,
                "y": 345,
                "w": 205,
                "h": 165,
                "data": {
                  "items": [
                    {
                      "label": "Spring 2026",
                      "selected": true
                    },
                    {
                      "label": "Fall 2025",
                      "selected": false
                    },
                    {
                      "label": "Spring 2025",
                      "selected": false
                    }
                  ]
                }
              },
              {
                "id": "gradeMix",
                "type": "donut",
                "title": "Grade Distribution",
                "x": 240,
                "y": 345,
                "w": 205,
                "h": 165,
                "data": {
                  "categories": [
                    "A",
                    "B",
                    "C"
                  ],
                  "values": [
                    5,
                    3,
                    2
                  ]
                }
              },
              {
                "id": "topStudents",
                "type": "matrix",
                "title": "Top Student Performance",
                "x": 462,
                "y": 345,
                "w": 450,
                "h": 165,
                "data": {
                  "columns": [
                    "Student",
                    "Course",
                    "Score"
                  ],
                  "rows": [
                    [
                      "Maya Chen",
                      "Java Programming",
                      97
                    ],
                    [
                      "Sofia Garcia",
                      "Data Visualization",
                      95
                    ],
                    [
                      "Asha Patel",
                      "Java Programming",
                      94
                    ],
                    [
                      "Isha Rao",
                      "GIS Applications",
                      90
                    ]
                  ]
                }
              }
            ],
            "background": "#ffffff",
            "wallpaper": "#d4d4d4",
            "size": {
              "width": 960,
              "height": 540
            }
          },
          {
            "id": "page2",
            "name": "Student Performance",
            "hidden": false,
            "visuals": [
              {
                "id": "scoreScatter",
                "type": "scatter",
                "title": "Score vs Attendance",
                "x": 18,
                "y": 20,
                "w": 440,
                "h": 225,
                "data": {
                  "points": [
                    [
                      94,
                      96
                    ],
                    [
                      78,
                      82
                    ],
                    [
                      97,
                      99
                    ],
                    [
                      88,
                      93
                    ],
                    [
                      95,
                      98
                    ],
                    [
                      74,
                      76
                    ],
                    [
                      90,
                      94
                    ],
                    [
                      84,
                      91
                    ]
                  ]
                }
              },
              {
                "id": "courseScores",
                "type": "clusteredColumn",
                "title": "Average Score by Course",
                "x": 480,
                "y": 20,
                "w": 432,
                "h": 225,
                "data": {
                  "categories": [
                    "Java",
                    "Database",
                    "Business",
                    "GIS",
                    "Data Viz"
                  ],
                  "values": [
                    95.5,
                    82.7,
                    74,
                    89,
                    93
                  ]
                }
              },
              {
                "id": "studentTable",
                "type": "table",
                "title": "Student Detail",
                "x": 18,
                "y": 270,
                "w": 610,
                "h": 235,
                "data": {
                  "columns": [
                    "Student",
                    "City",
                    "Risk",
                    "Score"
                  ],
                  "rows": [
                    [
                      "Asha Patel",
                      "Austin",
                      "On Track",
                      94
                    ],
                    [
                      "Ravi Kumar",
                      "Round Rock",
                      "At Risk",
                      78
                    ],
                    [
                      "Maya Chen",
                      "Cedar Park",
                      "High Performer",
                      97
                    ],
                    [
                      "Noah Williams",
                      "Leander",
                      "On Track",
                      88
                    ],
                    [
                      "Sofia Garcia",
                      "Austin",
                      "High Performer",
                      95
                    ],
                    [
                      "Ethan Brown",
                      "Georgetown",
                      "At Risk",
                      74
                    ]
                  ]
                }
              },
              {
                "id": "riskSlicer",
                "type": "slicer",
                "title": "Risk Status",
                "x": 650,
                "y": 270,
                "w": 262,
                "h": 235,
                "data": {
                  "items": [
                    {
                      "label": "High Performer"
                    },
                    {
                      "label": "On Track"
                    },
                    {
                      "label": "At Risk"
                    }
                  ]
                }
              }
            ],
            "background": "#ffffff",
            "wallpaper": "#d4d4d4",
            "size": {
              "width": 960,
              "height": 540
            }
          },
          {
            "id": "page3",
            "name": "Attendance",
            "hidden": false,
            "visuals": [
              {
                "id": "attCard",
                "type": "card",
                "title": "Current Attendance",
                "x": 18,
                "y": 18,
                "w": 260,
                "h": 90,
                "data": {
                  "value": "91.1%"
                }
              },
              {
                "id": "presentCard",
                "type": "card",
                "title": "Students Present",
                "x": 298,
                "y": 18,
                "w": 260,
                "h": 90,
                "data": {
                  "value": "7 / 8"
                }
              },
              {
                "id": "absenceCard",
                "type": "card",
                "title": "Students Below 85%",
                "x": 578,
                "y": 18,
                "w": 260,
                "h": 90,
                "data": {
                  "value": "2"
                }
              },
              {
                "id": "monthlyAttendance",
                "type": "line",
                "title": "Monthly Attendance %",
                "x": 18,
                "y": 130,
                "w": 550,
                "h": 230,
                "data": {
                  "categories": [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun"
                  ],
                  "values": [
                    89,
                    90,
                    92,
                    91,
                    93,
                    94
                  ]
                }
              },
              {
                "id": "attendanceByStudent",
                "type": "clusteredBar",
                "title": "Attendance by Student",
                "x": 590,
                "y": 130,
                "w": 322,
                "h": 230,
                "data": {
                  "categories": [
                    "Asha",
                    "Ravi",
                    "Maya",
                    "Noah",
                    "Sofia",
                    "Ethan",
                    "Isha",
                    "Liam"
                  ],
                  "values": [
                    96,
                    82,
                    99,
                    93,
                    98,
                    76,
                    94,
                    91
                  ]
                }
              },
              {
                "id": "attendanceTable",
                "type": "matrix",
                "title": "Attendance Detail",
                "x": 18,
                "y": 380,
                "w": 894,
                "h": 130,
                "data": {
                  "columns": [
                    "Student",
                    "Attendance %",
                    "Status"
                  ],
                  "rows": [
                    [
                      "Maya Chen",
                      "99%",
                      "Excellent"
                    ],
                    [
                      "Sofia Garcia",
                      "98%",
                      "Excellent"
                    ],
                    [
                      "Asha Patel",
                      "96%",
                      "Good"
                    ],
                    [
                      "Ethan Brown",
                      "76%",
                      "Needs Attention"
                    ]
                  ]
                }
              }
            ],
            "background": "#ffffff",
            "wallpaper": "#d4d4d4",
            "size": {
              "width": 960,
              "height": 540
            }
          },
          {
            "id": "page4",
            "name": "Visual Gallery",
            "hidden": false,
            "visuals": [
              {
                "id": "g1",
                "type": "clusteredColumn",
                "title": "Column",
                "x": 18,
                "y": 18,
                "w": 214,
                "h": 148,
                "data": {
                  "categories": [
                    "A",
                    "B",
                    "C",
                    "D"
                  ],
                  "values": [
                    42,
                    35,
                    23,
                    51
                  ]
                }
              },
              {
                "id": "g2",
                "type": "line",
                "title": "Line",
                "x": 250,
                "y": 18,
                "w": 214,
                "h": 148,
                "data": {
                  "categories": [
                    "A",
                    "B",
                    "C",
                    "D"
                  ],
                  "values": [
                    42,
                    35,
                    23,
                    51
                  ]
                }
              },
              {
                "id": "g3",
                "type": "donut",
                "title": "Donut",
                "x": 482,
                "y": 18,
                "w": 214,
                "h": 148,
                "data": {
                  "categories": [
                    "A",
                    "B",
                    "C",
                    "D"
                  ],
                  "values": [
                    42,
                    35,
                    23,
                    51
                  ]
                }
              },
              {
                "id": "g4",
                "type": "scatter",
                "title": "Scatter",
                "x": 714,
                "y": 18,
                "w": 214,
                "h": 148,
                "data": {
                  "categories": [
                    "A",
                    "B",
                    "C",
                    "D"
                  ],
                  "values": [
                    42,
                    35,
                    23,
                    51
                  ]
                }
              },
              {
                "id": "g5",
                "type": "funnel",
                "title": "Funnel",
                "x": 18,
                "y": 186,
                "w": 214,
                "h": 148,
                "data": {
                  "categories": [
                    "A",
                    "B",
                    "C",
                    "D"
                  ],
                  "values": [
                    42,
                    35,
                    23,
                    51
                  ]
                }
              },
              {
                "id": "g6",
                "type": "gauge",
                "title": "Gauge",
                "x": 250,
                "y": 186,
                "w": 214,
                "h": 148,
                "data": {
                  "categories": [
                    "A",
                    "B",
                    "C",
                    "D"
                  ],
                  "values": [
                    42,
                    35,
                    23,
                    51
                  ]
                }
              },
              {
                "id": "g7",
                "type": "card",
                "title": "Card",
                "x": 482,
                "y": 186,
                "w": 214,
                "h": 148,
                "data": {
                  "value": "88.7"
                }
              },
              {
                "id": "g8",
                "type": "slicer",
                "title": "Slicer",
                "x": 714,
                "y": 186,
                "w": 214,
                "h": 148,
                "data": {
                  "items": [
                    {
                      "label": "Java"
                    },
                    {
                      "label": "Database"
                    },
                    {
                      "label": "GIS"
                    }
                  ]
                }
              },
              {
                "id": "g9",
                "type": "table",
                "title": "Table",
                "x": 18,
                "y": 354,
                "w": 214,
                "h": 148,
                "data": {
                  "columns": [
                    "Category",
                    "Value"
                  ],
                  "rows": [
                    [
                      "A",
                      42
                    ],
                    [
                      "B",
                      35
                    ],
                    [
                      "C",
                      23
                    ]
                  ]
                }
              },
              {
                "id": "g10",
                "type": "matrix",
                "title": "Matrix",
                "x": 250,
                "y": 354,
                "w": 214,
                "h": 148,
                "data": {
                  "columns": [
                    "Category",
                    "Value"
                  ],
                  "rows": [
                    [
                      "A",
                      42
                    ],
                    [
                      "B",
                      35
                    ],
                    [
                      "C",
                      23
                    ]
                  ]
                }
              },
              {
                "id": "g11",
                "type": "decomposition",
                "title": "Decomposition",
                "x": 482,
                "y": 354,
                "w": 214,
                "h": 148,
                "data": {
                  "categories": [
                    "A",
                    "B",
                    "C",
                    "D"
                  ],
                  "values": [
                    42,
                    35,
                    23,
                    51
                  ]
                }
              },
              {
                "id": "g12",
                "type": "keyInfluencers",
                "title": "Key influencers",
                "x": 714,
                "y": 354,
                "w": 214,
                "h": 148,
                "data": {
                  "categories": [
                    "A",
                    "B",
                    "C",
                    "D"
                  ],
                  "values": [
                    42,
                    35,
                    23,
                    51
                  ]
                }
              }
            ],
            "background": "#ffffff",
            "wallpaper": "#d4d4d4",
            "size": {
              "width": 960,
              "height": 540
            }
          },
          {
            "id": "page5",
            "name": "Student Drillthrough",
            "hidden": false,
            "visuals": [
              {
                "id": "detailCard",
                "type": "card",
                "title": "Selected Student",
                "x": 25,
                "y": 20,
                "w": 300,
                "h": 90,
                "data": {
                  "value": "Asha Patel"
                }
              },
              {
                "id": "detailTable",
                "type": "table",
                "title": "Enrollment History",
                "x": 25,
                "y": 130,
                "w": 880,
                "h": 350,
                "data": {
                  "columns": [
                    "Semester",
                    "Course",
                    "Score",
                    "Grade"
                  ],
                  "rows": [
                    [
                      "Spring 2026",
                      "Java Programming",
                      94,
                      "A"
                    ],
                    [
                      "Fall 2025",
                      "Data Visualization",
                      91,
                      "A"
                    ]
                  ]
                }
              }
            ],
            "background": "#ffffff",
            "wallpaper": "#d4d4d4",
            "size": {
              "width": 960,
              "height": 540
            }
          }
        ],
        "activePageId": "page1",
        "selectedVisualId": "scoreByDept",
        "selectedTable": "Student",
        "selectedQuery": "Student",
        "filters": {
          "report": [
            {
              "field": "Calendar[Year]",
              "value": "2026"
            }
          ],
          "page": {
            "page1": []
          },
          "visual": {}
        },
        "bookmarks": [
          {
            "id": "bmExecutive",
            "name": "Executive Snapshot",
            "snapshot": {
              "activePageId": "page1",
              "selectedVisualId": "scoreByDept"
            }
          },
          {
            "id": "bmRisk",
            "name": "At Risk Students",
            "snapshot": {
              "activePageId": "page2",
              "selectedVisualId": "studentTable"
            }
          }
        ],
        "interactions": [
          {
            "source": "semesterSlicer",
            "target": "scoreByDept",
            "mode": "filter"
          },
          {
            "source": "riskSlicer",
            "target": "studentTable",
            "mode": "filter"
          }
        ],
        "hierarchies": [
          {
            "id": "academicHierarchy",
            "name": "Academic Hierarchy",
            "table": "Course",
            "levels": [
              "department_id",
              "course_name"
            ]
          }
        ],
        "performance": {
          "recording": false,
          "events": []
        },
        "publish": {
          "workspace": null,
          "status": ""
        },
        "mobile": {
          "enabled": false,
          "visuals": []
        },
        "powerQueryOpen": false,
        "formulaBar": true,
        "columnQuality": true,
        "columnDistribution": false,
        "columnProfile": false,
        "serviceOpen": false,
        "daxQueries": [
          {
            "id": "dax1",
            "name": "Course Performance",
            "text": "EVALUATE\nSUMMARIZECOLUMNS(\n    Course[course_name],\n    \"Average Score\", [Average Score]\n)",
            "results": [
              [
                "Course",
                "Average Score"
              ],
              [
                "Java Programming",
                "95.5"
              ],
              [
                "Database Systems",
                "82.7"
              ],
              [
                "Business Analytics",
                "74.0"
              ],
              [
                "GIS Applications",
                "89.0"
              ],
              [
                "Data Visualization",
                "93.0"
              ]
            ]
          }
        ],
        "activeDaxQueryId": "dax1",
        "tmdlScripts": [
          {
            "id": "tmdl1",
            "name": "Student Model",
            "text": "createOrReplace\n\ttable Student\n\t\tcolumn student_id\n\t\t\tdataType: int64\n\t\tcolumn 'Student Name'\n\t\t\tdataType: string\n\n\tmeasure 'Total Students' = DISTINCTCOUNT(Student[student_id])",
            "preview": "Model is synchronized. No pending changes."
          }
        ],
        "activeTmdlScriptId": "tmdl1",
        "modelExplorerOpen": true,
        "openPanes": [
          "filters",
          "visualizations",
          "data"
        ],
        "ribbonCollapsed": false,
        "keytips": false
      },
      "git": {
        "title": "Git",
        "version": "Local Repository",
        "repository": {
          "name": "Java-Practice",
          "path": "C:\\Users\\developer\\Java-Practice",
          "initialized": true
        },
        "activeBranch": "main",
        "branches": [
          {
            "name": "main",
            "current": true
          },
          {
            "name": "feature/student-api"
          }
        ],
        "remotes": [
          {
            "name": "origin",
            "url": "https://github.com/sabareeshrao/Java-Practice.git"
          }
        ],
        "tags": [
          {
            "name": "v1.0.0",
            "hash": "a17b6f1"
          }
        ],
        "stashes": [],
        "files": [
          {
            "path": "src/Student.java",
            "status": "M",
            "staged": false,
            "content": "public class Student {\\n    private int rollNo;\\n    private String name;\\n}\\n",
            "oldContent": "public class Student {\\n    private int rollNo;\\n}\\n"
          },
          {
            "path": "README.md",
            "status": "M",
            "staged": true,
            "content": "# Java Practice\\n\\nHands-on Java developer workflow.\\n",
            "oldContent": "# Java Practice\\n"
          }
        ],
        "commits": [
          {
            "hash": "a17b6f1",
            "message": "Add Student domain model",
            "author": "Developer",
            "date": "Today",
            "branch": "main",
            "files": [
              "src/Student.java"
            ]
          },
          {
            "hash": "8ef31aa",
            "message": "Initialize Java practice project",
            "author": "Developer",
            "date": "Yesterday",
            "branch": "main",
            "files": [
              "README.md"
            ]
          }
        ],
        "conflicts": [],
        "terminalOpen": true,
        "terminalShell": "Git",
        "terminalHistory": [],
        "config": {
          "user": {
            "name": "Developer",
            "email": "developer@example.com"
          },
          "settings": {},
          "credentialHelper": "manager",
          "signingKey": "",
          "signCommits": false
        },
        "remoteBranches": [
          {
            "name": "origin/main",
            "remote": "origin"
          }
        ],
        "reflog": [],
        "rebasePlan": [],
        "gitignore": "*.class\\nout/\\n.idea/\\n",
        "hooks": {},
        "lfs": {
          "patterns": []
        },
        "submodules": [],
        "worktrees": []
      },
      "github": {
        "user": "sabareeshrao",
        "displayName": "Java Developer",
        "contributions": 64,
        "activeRepo": "Java-Practice",
        "repositories": [
          {
            "owner": "sabareeshrao",
            "name": "Java-Practice",
            "description": "Hands-on Java developer practice repository",
            "defaultBranch": "main",
            "private": false,
            "stars": 2,
            "watchers": 1,
            "forks": 1,
            "cloneUrl": "https://github.com/sabareeshrao/Java-Practice.git",
            "branches": [
              {
                "name": "main",
                "protected": true
              },
              {
                "name": "feature/student-api"
              }
            ],
            "tags": [
              {
                "name": "v1.0.0",
                "hash": "a17b6f1",
                "date": "Today"
              }
            ],
            "releases": [
              {
                "name": "Java Practice v1.0.0",
                "tag": "v1.0.0",
                "notes": "Initial practice milestone."
              }
            ],
            "files": [
              {
                "path": "src/Student.java",
                "content": "public class Student {\\n    private int rollNo;\\n    private String name;\\n}\\n",
                "message": "Add Student domain model",
                "time": "Today"
              },
              {
                "path": "README.md",
                "content": "# Java Practice\\n\\nHands-on Java developer workflow.",
                "message": "Update README",
                "time": "Today"
              },
              {
                "path": ".github/workflows/ci.yml",
                "content": "name: CI\\non: [push, pull_request]\\njobs:\\n  build:\\n    runs-on: ubuntu-latest\\n",
                "message": "Add CI workflow",
                "time": "Today"
              }
            ],
            "readme": "# Java Practice\\n\\nHands-on Java developer workflow.",
            "commits": [
              {
                "hash": "a17b6f1",
                "message": "Add Student domain model",
                "author": "Developer",
                "date": "Today",
                "files": [
                  "src/Student.java"
                ],
                "diff": [
                  "@@ Student.java",
                  "-    int rollNo;",
                  "+    private int rollNo;",
                  "+    private String name;"
                ]
              },
              {
                "hash": "8ef31aa",
                "message": "Initialize Java practice project",
                "author": "Developer",
                "date": "Yesterday",
                "files": [
                  "README.md"
                ]
              }
            ],
            "issues": [
              {
                "number": 1,
                "title": "Add validation for student roll number",
                "body": "Reject invalid roll numbers before persistence.",
                "author": "sabareeshrao",
                "state": "open",
                "labels": [
                  "enhancement"
                ],
                "assignee": "sabareeshrao",
                "comments": []
              }
            ],
            "pullRequests": [
              {
                "number": 2,
                "title": "Add Student REST endpoint",
                "head": "feature/student-api",
                "base": "main",
                "author": "sabareeshrao",
                "state": "open",
                "merged": false,
                "reviewers": [
                  "reviewer"
                ],
                "comments": [
                  {
                    "author": "reviewer",
                    "text": "Please add one validation test."
                  }
                ],
                "checks": [
                  {
                    "name": "build",
                    "status": "success"
                  },
                  {
                    "name": "tests",
                    "status": "success"
                  }
                ],
                "filesChanged": [
                  "src/StudentController.java"
                ],
                "diff": [
                  "+@RestController",
                  "+class StudentController {",
                  "+}"
                ]
              }
            ],
            "projects": [
              {
                "name": "Java Practice Board",
                "description": "Backlog, in progress, review and done"
              }
            ],
            "discussions": [
              {
                "title": "API error response conventions",
                "category": "General",
                "author": "sabareeshrao",
                "comments": 2
              }
            ],
            "security": {
              "dependabot": 0,
              "codeScanning": 0,
              "secretScanning": 0,
              "policy": true
            },
            "insights": {
              "contributors": 2,
              "clones": 14,
              "visitors": 8
            },
            "settings": {},
            "branchProtection": [
              {
                "branch": "main",
                "rule": "Require pull request review and passing checks"
              }
            ],
            "collaborators": [
              {
                "name": "reviewer",
                "role": "Write"
              }
            ]
          }
        ]
      },
      "github_actions": {
        "owner": "sabareeshrao",
        "repository": "Java-Practice",
        "workflows": [
          {
            "id": "ci",
            "name": "Java CI",
            "file": "ci.yml",
            "enabled": true,
            "events": [
              "push",
              "pull_request",
              "workflow_dispatch"
            ],
            "dispatch": true,
            "permissions": "contents: read",
            "concurrency": "ci-main",
            "yaml": "name: Java CI\\non:\\n  push:\\n    branches: [ main ]\\n  pull_request:\\n    branches: [ main ]\\n  workflow_dispatch:\\njobs:\\n  build:\\n    runs-on: ubuntu-latest\\n    steps:\\n      - uses: actions/checkout@v4\\n      - uses: actions/setup-java@v4\\n        with:\\n          java-version: '17'\\n      - run: mvn -B verify"
          }
        ],
        "runs": [
          {
            "id": "42",
            "name": "Java CI",
            "event": "push",
            "branch": "main",
            "status": "success",
            "commit": "a17b6f1",
            "actor": "sabareeshrao",
            "runner": "ubuntu-latest",
            "duration": "1m 42s",
            "jobs": [
              {
                "name": "build",
                "status": "success",
                "runner": "ubuntu-latest",
                "steps": [
                  {
                    "name": "Set up job",
                    "status": "success",
                    "log": "Runner image: ubuntu-latest"
                  },
                  {
                    "name": "Checkout",
                    "status": "success",
                    "log": "Checked out a17b6f1"
                  },
                  {
                    "name": "Set up Java",
                    "status": "success",
                    "log": "Java 17 configured"
                  },
                  {
                    "name": "Maven verify",
                    "status": "success",
                    "log": "BUILD SUCCESS"
                  }
                ]
              }
            ],
            "summary": "Build and tests passed.",
            "annotations": [],
            "artifacts": [
              {
                "name": "java-practice-jar",
                "size": "24 KB",
                "retention": "90 days"
              }
            ]
          }
        ],
        "templates": [
          {
            "name": "Java with Maven",
            "description": "Build and test with Maven."
          },
          {
            "name": "Java with Gradle",
            "description": "Build and test with Gradle."
          }
        ],
        "secrets": [
          {
            "name": "SONAR_TOKEN",
            "updated": "Today"
          }
        ],
        "variables": [
          {
            "name": "JAVA_VERSION",
            "value": "17",
            "updated": "Today"
          }
        ],
        "caches": [
          {
            "key": "maven-Linux-pom",
            "ref": "refs/heads/main",
            "size": "18 MB",
            "lastAccessed": "Today"
          }
        ],
        "artifacts": [],
        "environments": [
          {
            "name": "production",
            "reviewers": [
              "reviewer"
            ],
            "waitTimer": 0,
            "secrets": [
              "DEPLOY_TOKEN"
            ]
          }
        ],
        "runners": [
          {
            "name": "linux-java17-agent",
            "os": "Linux",
            "labels": [
              "self-hosted",
              "linux",
              "java17"
            ],
            "status": "online"
          }
        ],
        "marketplace": []
      },
      "mysql_workbench": {
        "title": "Campus Analytics - MySQL Workbench",
        "version": "MySQL Workbench 8.0 Community",
        "showHome": false,
        "connections": [
          {
            "id": "local-mysql",
            "name": "Local instance MySQL80",
            "host": "localhost",
            "port": 3306,
            "user": "root",
            "schema": "java_practice",
            "connected": true
          }
        ],
        "activeConnection": "local-mysql",
        "activeSchema": "java_practice",
        "tree": [
          {
            "name": "java_practice",
            "type": "schema",
            "path": "schemas/java_practice",
            "open": true,
            "properties": {
              "Charset": "utf8mb4",
              "Collation": "utf8mb4_0900_ai_ci"
            },
            "children": [
              {
                "name": "Tables",
                "type": "folder",
                "path": "schemas/java_practice/tables",
                "open": true,
                "children": [
                  {
                    "name": "department",
                    "type": "table",
                    "path": "schemas/java_practice/tables/department",
                    "open": true,
                    "properties": {
                      "Engine": "InnoDB",
                      "Rows": 4,
                      "Collation": "utf8mb4_0900_ai_ci",
                      "rows": 4
                    },
                    "ddl": "CREATE TABLE `java_practice`.`department` (...);",
                    "children": [
                      {
                        "name": "Columns",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/department/columns",
                        "open": true,
                        "children": [
                          {
                            "name": "department_id",
                            "type": "column",
                            "path": "schemas/java_practice/tables/department/columns/department_id",
                            "properties": {
                              "Datatype": "INT",
                              "PK": "YES",
                              "NN": "YES",
                              "AI": "YES"
                            }
                          },
                          {
                            "name": "department_name",
                            "type": "column",
                            "path": "schemas/java_practice/tables/department/columns/department_name",
                            "properties": {
                              "Datatype": "VARCHAR(100)",
                              "NN": "YES"
                            }
                          },
                          {
                            "name": "dean",
                            "type": "column",
                            "path": "schemas/java_practice/tables/department/columns/dean",
                            "properties": {
                              "Datatype": "VARCHAR(100)"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Indexes",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/department/indexes",
                        "open": true,
                        "children": [
                          {
                            "name": "PRIMARY",
                            "type": "index",
                            "path": "schemas/java_practice/tables/department/indexes/PRIMARY",
                            "properties": {
                              "Type": "BTREE",
                              "Unique": "YES"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Foreign Keys",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/department/fks",
                        "open": true,
                        "children": []
                      },
                      {
                        "name": "Triggers",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/department/triggers",
                        "open": true,
                        "children": []
                      }
                    ]
                  },
                  {
                    "name": "course",
                    "type": "table",
                    "path": "schemas/java_practice/tables/course",
                    "open": true,
                    "properties": {
                      "Engine": "InnoDB",
                      "Rows": 5,
                      "Collation": "utf8mb4_0900_ai_ci",
                      "rows": 5,
                      "foreignKeys": [
                        {
                          "name": "fk_course_department",
                          "type": "foreignKey",
                          "path": "schemas/java_practice/tables/course/fks/fk_course_department",
                          "properties": {
                            "Column": "department_id",
                            "References": "department.department_id"
                          }
                        }
                      ]
                    },
                    "ddl": "CREATE TABLE `java_practice`.`course` (...);",
                    "children": [
                      {
                        "name": "Columns",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/course/columns",
                        "open": true,
                        "children": [
                          {
                            "name": "course_id",
                            "type": "column",
                            "path": "schemas/java_practice/tables/course/columns/course_id",
                            "properties": {
                              "Datatype": "INT",
                              "PK": "YES",
                              "NN": "YES",
                              "AI": "YES"
                            }
                          },
                          {
                            "name": "course_name",
                            "type": "column",
                            "path": "schemas/java_practice/tables/course/columns/course_name",
                            "properties": {
                              "Datatype": "VARCHAR(120)",
                              "NN": "YES"
                            }
                          },
                          {
                            "name": "department_id",
                            "type": "column",
                            "path": "schemas/java_practice/tables/course/columns/department_id",
                            "properties": {
                              "Datatype": "INT",
                              "NN": "YES"
                            }
                          },
                          {
                            "name": "credits",
                            "type": "column",
                            "path": "schemas/java_practice/tables/course/columns/credits",
                            "properties": {
                              "Datatype": "INT"
                            }
                          },
                          {
                            "name": "instructor",
                            "type": "column",
                            "path": "schemas/java_practice/tables/course/columns/instructor",
                            "properties": {
                              "Datatype": "VARCHAR(100)"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Indexes",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/course/indexes",
                        "open": true,
                        "children": [
                          {
                            "name": "PRIMARY",
                            "type": "index",
                            "path": "schemas/java_practice/tables/course/indexes/PRIMARY",
                            "properties": {
                              "Type": "BTREE",
                              "Unique": "YES"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Foreign Keys",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/course/fks",
                        "open": true,
                        "children": [
                          {
                            "name": "fk_course_department",
                            "type": "foreignKey",
                            "path": "schemas/java_practice/tables/course/fks/fk_course_department",
                            "properties": {
                              "Column": "department_id",
                              "References": "department.department_id"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Triggers",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/course/triggers",
                        "open": true,
                        "children": []
                      }
                    ]
                  },
                  {
                    "name": "student",
                    "type": "table",
                    "path": "schemas/java_practice/tables/student",
                    "open": true,
                    "properties": {
                      "Engine": "InnoDB",
                      "Rows": 8,
                      "Collation": "utf8mb4_0900_ai_ci",
                      "rows": 8,
                      "triggers": [
                        {
                          "name": "before_student_update",
                          "type": "trigger",
                          "path": "schemas/java_practice/tables/student/triggers/before_student_update"
                        }
                      ]
                    },
                    "ddl": "CREATE TABLE `java_practice`.`student` (...);",
                    "children": [
                      {
                        "name": "Columns",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/student/columns",
                        "open": true,
                        "children": [
                          {
                            "name": "student_id",
                            "type": "column",
                            "path": "schemas/java_practice/tables/student/columns/student_id",
                            "properties": {
                              "Datatype": "INT",
                              "PK": "YES",
                              "NN": "YES",
                              "AI": "YES"
                            }
                          },
                          {
                            "name": "student_name",
                            "type": "column",
                            "path": "schemas/java_practice/tables/student/columns/student_name",
                            "properties": {
                              "Datatype": "VARCHAR(120)",
                              "NN": "YES"
                            }
                          },
                          {
                            "name": "email",
                            "type": "column",
                            "path": "schemas/java_practice/tables/student/columns/email",
                            "properties": {
                              "Datatype": "VARCHAR(160)",
                              "NN": "YES"
                            }
                          },
                          {
                            "name": "city",
                            "type": "column",
                            "path": "schemas/java_practice/tables/student/columns/city",
                            "properties": {
                              "Datatype": "VARCHAR(80)"
                            }
                          },
                          {
                            "name": "admission_year",
                            "type": "column",
                            "path": "schemas/java_practice/tables/student/columns/admission_year",
                            "properties": {
                              "Datatype": "INT"
                            }
                          },
                          {
                            "name": "risk_status",
                            "type": "column",
                            "path": "schemas/java_practice/tables/student/columns/risk_status",
                            "properties": {
                              "Datatype": "VARCHAR(40)"
                            }
                          },
                          {
                            "name": "updated_at",
                            "type": "column",
                            "path": "schemas/java_practice/tables/student/columns/updated_at",
                            "properties": {
                              "Datatype": "TIMESTAMP",
                              "Default": "CURRENT_TIMESTAMP"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Indexes",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/student/indexes",
                        "open": true,
                        "children": [
                          {
                            "name": "PRIMARY",
                            "type": "index",
                            "path": "schemas/java_practice/tables/student/indexes/PRIMARY",
                            "properties": {
                              "Type": "BTREE",
                              "Unique": "YES"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Foreign Keys",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/student/fks",
                        "open": true,
                        "children": []
                      },
                      {
                        "name": "Triggers",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/student/triggers",
                        "open": true,
                        "children": [
                          {
                            "name": "before_student_update",
                            "type": "trigger",
                            "path": "schemas/java_practice/tables/student/triggers/before_student_update"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "name": "enrollment",
                    "type": "table",
                    "path": "schemas/java_practice/tables/enrollment",
                    "open": true,
                    "properties": {
                      "Engine": "InnoDB",
                      "Rows": 10,
                      "Collation": "utf8mb4_0900_ai_ci",
                      "rows": 10,
                      "foreignKeys": [
                        {
                          "name": "fk_enrollment_student",
                          "type": "foreignKey",
                          "path": "schemas/java_practice/tables/enrollment/fks/fk_enrollment_student",
                          "properties": {
                            "Column": "student_id",
                            "References": "student.student_id"
                          }
                        },
                        {
                          "name": "fk_enrollment_course",
                          "type": "foreignKey",
                          "path": "schemas/java_practice/tables/enrollment/fks/fk_enrollment_course",
                          "properties": {
                            "Column": "course_id",
                            "References": "course.course_id"
                          }
                        }
                      ]
                    },
                    "ddl": "CREATE TABLE `java_practice`.`enrollment` (...);",
                    "children": [
                      {
                        "name": "Columns",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/enrollment/columns",
                        "open": true,
                        "children": [
                          {
                            "name": "enrollment_id",
                            "type": "column",
                            "path": "schemas/java_practice/tables/enrollment/columns/enrollment_id",
                            "properties": {
                              "Datatype": "INT",
                              "PK": "YES",
                              "NN": "YES",
                              "AI": "YES"
                            }
                          },
                          {
                            "name": "student_id",
                            "type": "column",
                            "path": "schemas/java_practice/tables/enrollment/columns/student_id",
                            "properties": {
                              "Datatype": "INT",
                              "NN": "YES"
                            }
                          },
                          {
                            "name": "course_id",
                            "type": "column",
                            "path": "schemas/java_practice/tables/enrollment/columns/course_id",
                            "properties": {
                              "Datatype": "INT",
                              "NN": "YES"
                            }
                          },
                          {
                            "name": "semester",
                            "type": "column",
                            "path": "schemas/java_practice/tables/enrollment/columns/semester",
                            "properties": {
                              "Datatype": "VARCHAR(30)"
                            }
                          },
                          {
                            "name": "score",
                            "type": "column",
                            "path": "schemas/java_practice/tables/enrollment/columns/score",
                            "properties": {
                              "Datatype": "DECIMAL(5,2)"
                            }
                          },
                          {
                            "name": "grade",
                            "type": "column",
                            "path": "schemas/java_practice/tables/enrollment/columns/grade",
                            "properties": {
                              "Datatype": "CHAR(1)"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Indexes",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/enrollment/indexes",
                        "open": true,
                        "children": [
                          {
                            "name": "PRIMARY",
                            "type": "index",
                            "path": "schemas/java_practice/tables/enrollment/indexes/PRIMARY",
                            "properties": {
                              "Type": "BTREE",
                              "Unique": "YES"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Foreign Keys",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/enrollment/fks",
                        "open": true,
                        "children": [
                          {
                            "name": "fk_enrollment_student",
                            "type": "foreignKey",
                            "path": "schemas/java_practice/tables/enrollment/fks/fk_enrollment_student",
                            "properties": {
                              "Column": "student_id",
                              "References": "student.student_id"
                            }
                          },
                          {
                            "name": "fk_enrollment_course",
                            "type": "foreignKey",
                            "path": "schemas/java_practice/tables/enrollment/fks/fk_enrollment_course",
                            "properties": {
                              "Column": "course_id",
                              "References": "course.course_id"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Triggers",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/enrollment/triggers",
                        "open": true,
                        "children": []
                      }
                    ]
                  },
                  {
                    "name": "attendance",
                    "type": "table",
                    "path": "schemas/java_practice/tables/attendance",
                    "open": true,
                    "properties": {
                      "Engine": "InnoDB",
                      "Rows": 8,
                      "Collation": "utf8mb4_0900_ai_ci",
                      "rows": 8,
                      "foreignKeys": [
                        {
                          "name": "fk_attendance_student",
                          "type": "foreignKey",
                          "path": "schemas/java_practice/tables/attendance/fks/fk_attendance_student",
                          "properties": {
                            "Column": "student_id",
                            "References": "student.student_id"
                          }
                        }
                      ]
                    },
                    "ddl": "CREATE TABLE `java_practice`.`attendance` (...);",
                    "children": [
                      {
                        "name": "Columns",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/attendance/columns",
                        "open": true,
                        "children": [
                          {
                            "name": "attendance_id",
                            "type": "column",
                            "path": "schemas/java_practice/tables/attendance/columns/attendance_id",
                            "properties": {
                              "Datatype": "INT",
                              "PK": "YES",
                              "NN": "YES",
                              "AI": "YES"
                            }
                          },
                          {
                            "name": "student_id",
                            "type": "column",
                            "path": "schemas/java_practice/tables/attendance/columns/student_id",
                            "properties": {
                              "Datatype": "INT",
                              "NN": "YES"
                            }
                          },
                          {
                            "name": "attendance_date",
                            "type": "column",
                            "path": "schemas/java_practice/tables/attendance/columns/attendance_date",
                            "properties": {
                              "Datatype": "DATE",
                              "NN": "YES"
                            }
                          },
                          {
                            "name": "present",
                            "type": "column",
                            "path": "schemas/java_practice/tables/attendance/columns/present",
                            "properties": {
                              "Datatype": "TINYINT(1)"
                            }
                          },
                          {
                            "name": "attendance_pct",
                            "type": "column",
                            "path": "schemas/java_practice/tables/attendance/columns/attendance_pct",
                            "properties": {
                              "Datatype": "DECIMAL(5,2)"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Indexes",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/attendance/indexes",
                        "open": true,
                        "children": [
                          {
                            "name": "PRIMARY",
                            "type": "index",
                            "path": "schemas/java_practice/tables/attendance/indexes/PRIMARY",
                            "properties": {
                              "Type": "BTREE",
                              "Unique": "YES"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Foreign Keys",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/attendance/fks",
                        "open": true,
                        "children": [
                          {
                            "name": "fk_attendance_student",
                            "type": "foreignKey",
                            "path": "schemas/java_practice/tables/attendance/fks/fk_attendance_student",
                            "properties": {
                              "Column": "student_id",
                              "References": "student.student_id"
                            }
                          }
                        ]
                      },
                      {
                        "name": "Triggers",
                        "type": "folder",
                        "path": "schemas/java_practice/tables/attendance/triggers",
                        "open": true,
                        "children": []
                      }
                    ]
                  }
                ]
              },
              {
                "name": "Views",
                "type": "folder",
                "path": "schemas/java_practice/views",
                "open": true,
                "children": [
                  {
                    "name": "vw_student_performance",
                    "type": "view",
                    "path": "schemas/java_practice/views/vw_student_performance",
                    "ddl": "CREATE VIEW vw_student_performance AS SELECT s.student_name,c.course_name,e.score,e.grade FROM student s JOIN enrollment e ON e.student_id=s.student_id JOIN course c ON c.course_id=e.course_id;"
                  }
                ]
              },
              {
                "name": "Stored Procedures",
                "type": "folder",
                "path": "schemas/java_practice/procedures",
                "open": true,
                "children": [
                  {
                    "name": "sp_students_at_risk",
                    "type": "procedure",
                    "path": "schemas/java_practice/procedures/sp_students_at_risk",
                    "ddl": "CREATE PROCEDURE sp_students_at_risk() BEGIN SELECT * FROM student WHERE risk_status='At Risk'; END;"
                  }
                ]
              },
              {
                "name": "Functions",
                "type": "folder",
                "path": "schemas/java_practice/functions",
                "open": true,
                "children": [
                  {
                    "name": "fn_grade_label",
                    "type": "function",
                    "path": "schemas/java_practice/functions/fn_grade_label",
                    "ddl": "CREATE FUNCTION fn_grade_label(score DECIMAL(5,2)) RETURNS VARCHAR(20) RETURN IF(score>=90,'Excellent',IF(score>=80,'Good','Needs Support'));"
                  }
                ]
              },
              {
                "name": "Events",
                "type": "folder",
                "path": "schemas/java_practice/events",
                "open": true,
                "children": [
                  {
                    "name": "evt_weekly_summary",
                    "type": "event",
                    "path": "schemas/java_practice/events/evt_weekly_summary",
                    "ddl": "CREATE EVENT evt_weekly_summary ON SCHEDULE EVERY 1 WEEK DO INSERT INTO audit_log(message) VALUES('weekly summary');"
                  }
                ]
              }
            ]
          }
        ],
        "initialSelection": "schemas/java_practice/tables/student",
        "queryTabs": [
          {
            "id": "sql-main",
            "title": "student_analysis.sql",
            "sql": "SELECT\n    s.student_id,\n    s.student_name,\n    c.course_name,\n    e.score,\n    e.grade\nFROM student s\nJOIN enrollment e ON e.student_id = s.student_id\nJOIN course c ON c.course_id = e.course_id\nORDER BY e.score DESC;",
            "dirty": false,
            "savedPath": "C:\\sql\\student_analysis.sql"
          },
          {
            "id": "sql-risk",
            "title": "risk_report.sql",
            "sql": "SELECT student_id, student_name, city, risk_status\nFROM student\nWHERE risk_status = 'At Risk';",
            "dirty": false,
            "savedPath": "C:\\sql\\risk_report.sql"
          }
        ],
        "initialQuery": "sql-main",
        "outputs": [
          {
            "status": "success",
            "time": "10:21:04",
            "action": "Query",
            "sql": "SELECT student performance...",
            "response": "5 row(s) returned",
            "duration": "0.014 sec"
          },
          {
            "status": "success",
            "time": "10:20:32",
            "action": "Schema",
            "message": "USE `java_practice`",
            "response": "Default schema changed",
            "duration": "0.001 sec"
          }
        ],
        "results": [
          {
            "id": "result-students",
            "title": "Result Grid",
            "columns": [
              "student_id",
              "student_name",
              "email",
              "city",
              "admission_year",
              "risk_status"
            ],
            "rows": [
              {
                "student_id": 1,
                "student_name": "Asha Patel",
                "email": "asha@example.edu",
                "city": "Austin",
                "admission_year": 2024,
                "risk_status": "On Track"
              },
              {
                "student_id": 2,
                "student_name": "Ravi Kumar",
                "email": "ravi@example.edu",
                "city": "Round Rock",
                "admission_year": 2024,
                "risk_status": "At Risk"
              },
              {
                "student_id": 3,
                "student_name": "Maya Chen",
                "email": "maya@example.edu",
                "city": "Cedar Park",
                "admission_year": 2025,
                "risk_status": "High Performer"
              },
              {
                "student_id": 4,
                "student_name": "Noah Williams",
                "email": "noah@example.edu",
                "city": "Leander",
                "admission_year": 2025,
                "risk_status": "On Track"
              },
              {
                "student_id": 5,
                "student_name": "Sofia Garcia",
                "email": "sofia@example.edu",
                "city": "Austin",
                "admission_year": 2024,
                "risk_status": "High Performer"
              }
            ],
            "editable": true,
            "pinned": true
          }
        ],
        "activeResult": "result-students",
        "snippets": [
          {
            "id": "sn-risk",
            "name": "At Risk Students",
            "sql": "SELECT * FROM student WHERE risk_status = 'At Risk';"
          },
          {
            "id": "sn-top",
            "name": "Top Scores",
            "sql": "SELECT * FROM enrollment WHERE score >= 90 ORDER BY score DESC;"
          }
        ],
        "rightMode": "help",
        "bottomMode": "results",
        "autoCommit": true,
        "sqlMode": "STRICT_TRANS_TABLES",
        "isolationLevel": "REPEATABLE READ",
        "safeUpdates": true,
        "rowLimit": 1000,
        "users": [
          {
            "user": "root",
            "host": "localhost",
            "privileges": [
              "ALL PRIVILEGES"
            ],
            "locked": false
          },
          {
            "user": "java_app",
            "host": "localhost",
            "privileges": [
              "SELECT",
              "INSERT",
              "UPDATE",
              "DELETE"
            ],
            "locked": false
          },
          {
            "user": "report_user",
            "host": "%",
            "privileges": [
              "SELECT"
            ],
            "locked": false
          }
        ],
        "serverRunning": true,
        "serverConnections": [
          {
            "id": 21,
            "user": "root",
            "host": "localhost",
            "db": "java_practice",
            "command": "Query",
            "time": 0
          },
          {
            "id": 22,
            "user": "java_app",
            "host": "localhost",
            "db": "java_practice",
            "command": "Sleep",
            "time": 14
          },
          {
            "id": 23,
            "user": "report_user",
            "host": "10.0.0.24",
            "db": "java_practice",
            "command": "Sleep",
            "time": 31
          }
        ],
        "model": {
          "name": "Campus Analytics Model",
          "zoom": 100,
          "tables": [
            {
              "name": "department",
              "columns": [
                "department_id INT PK",
                "department_name VARCHAR(100)",
                "dean VARCHAR(100)"
              ]
            },
            {
              "name": "course",
              "columns": [
                "course_id INT PK",
                "course_name VARCHAR(120)",
                "department_id INT FK",
                "credits INT"
              ]
            },
            {
              "name": "student",
              "columns": [
                "student_id INT PK",
                "student_name VARCHAR(120)",
                "email VARCHAR(160)",
                "city VARCHAR(80)",
                "risk_status VARCHAR(40)"
              ]
            },
            {
              "name": "enrollment",
              "columns": [
                "enrollment_id INT PK",
                "student_id INT FK",
                "course_id INT FK",
                "semester VARCHAR(30)",
                "score DECIMAL(5,2)"
              ]
            },
            {
              "name": "attendance",
              "columns": [
                "attendance_id INT PK",
                "student_id INT FK",
                "attendance_date DATE",
                "attendance_pct DECIMAL(5,2)"
              ]
            }
          ],
          "relationships": [
            {
              "from": "department.department_id",
              "to": "course.department_id",
              "type": "1:N"
            },
            {
              "from": "course.course_id",
              "to": "enrollment.course_id",
              "type": "1:N"
            },
            {
              "from": "student.student_id",
              "to": "enrollment.student_id",
              "type": "1:N"
            },
            {
              "from": "student.student_id",
              "to": "attendance.student_id",
              "type": "1:N"
            }
          ]
        }
      },
      "redis": {
        "state": {}
      },
      "spring_initializer": {
        "projectType": "Maven",
        "language": "Java",
        "bootVersion": "3.5.6",
        "group": "com.example",
        "artifact": "demo",
        "name": "demo",
        "packageName": "com.example.demo",
        "description": "Demo project for Spring Boot",
        "packaging": "Jar",
        "javaVersion": "17",
        "configFormat": "Properties",
        "dependencies": []
      },
      "maven_central": {
        "query": "",
        "results": [
          "spring-data-jpa",
          "liquibase",
          "mysql",
          "web",
          "junit"
        ],
        "selectedArtifact": "spring-data-jpa",
        "selectedVersion": "3.5.6"
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
            "data": {
              "file": "src/Student.java"
            }
          },
          "software": "intellij"
        }
      ]
    },
    {
      "title": "2: PostgreSQL / pgAdmin Developer Workflow",
      "subtitle": "27-step IntelliJ → pgAdmin → IntelliJ PostgreSQL INSERT/DML workflow covering CREATE TABLE, SELECT, single-row and multi-row INSERT, CREATE TABLE AS SELECT, and INSERT INTO SELECT.",
      "steps": [
        {
          "title": "Review Student fields before PostgreSQL work",
          "why": "Database schema rayadaniki mundu developer Student.java fields ni review chestadu. Java model mariyu PostgreSQL columns madhya mapping correct ga undali.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Explain DML",
          "why": "INSERT, UPDATE and DELETE are SQL Data Manipulation Language statements used to manipulate data stored inside database tables.",
          "software": "pgadmin",
          "action": {
            "action": "showSqlConcept",
            "data": {
              "message": "DML statements manipulate data stored inside tables.\n\nINSERT — add rows\nUPDATE — change existing rows\nDELETE — remove rows",
              "statusText": "DML: INSERT, UPDATE, DELETE"
            }
          }
        },
        {
          "title": "Explain CREATE TABLE syntax",
          "why": "A PostgreSQL table is created by providing a table name followed by column names and their data types inside parentheses.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "CREATE TABLE table_name (\n    column_name data_type,\n    column_name data_type,\n    column_name data_type\n);"
            }
          }
        },
        {
          "title": "Create the course table",
          "why": "Create a table named course containing course_number INTEGER, name TEXT and price NUMERIC.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "CREATE TABLE course (\n    course_number INTEGER,\n    name TEXT,\n    price NUMERIC\n);"
            }
          }
        },
        {
          "title": "Execute the CREATE TABLE query",
          "why": "Run the CREATE TABLE statement using pgAdmin's Execute/Run query functionality.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "createCourse": true,
              "message": "Query returned successfully in approximately 120 milliseconds.",
              "statusText": "course table created"
            }
          }
        },
        {
          "title": "View the empty course table",
          "why": "Use SELECT * to inspect course. The table has course_number, name and price columns and initially contains zero rows.",
          "software": "pgadmin",
          "action": {
            "action": "typeAndExecuteSql",
            "data": {
              "replace": true,
              "sql": "SELECT * FROM course;",
              "message": "SELECT 0",
              "statusText": "0 rows returned",
              "showTab": "data",
              "result": {
                "columns": [
                  "course_number",
                  "name",
                  "price"
                ],
                "rows": []
              }
            }
          }
        },
        {
          "title": "Explain basic INSERT syntax",
          "why": "VALUES can insert a row into a table. When column names are omitted, values normally must follow the table's expected column order.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "INSERT INTO table_name\nVALUES (value1, value2, value3);"
            }
          }
        },
        {
          "title": "Insert the first course",
          "why": "Insert the first record without explicitly specifying column names. This is not the preferred style because the reader must already know the table's column order.",
          "software": "pgadmin",
          "action": {
            "action": "typeAndExecuteSql",
            "data": {
              "replace": true,
              "sql": "INSERT INTO course\nVALUES (1, 'PostgreSQL', 150);",
              "courseRowsAfter": [
                [
                  1,
                  "PostgreSQL",
                  150
                ]
              ],
              "message": "INSERT 0 1 — Query executed successfully in approximately 84 milliseconds.",
              "statusText": "1 row inserted"
            }
          }
        },
        {
          "title": "Verify the first inserted row",
          "why": "Query course again and use the Data Output grid to verify that the PostgreSQL course was inserted.",
          "software": "pgadmin",
          "action": {
            "action": "typeAndExecuteSql",
            "data": {
              "replace": true,
              "sql": "SELECT * FROM course;",
              "message": "SELECT 1",
              "statusText": "1 row returned",
              "showTab": "data",
              "result": {
                "columns": [
                  "course_number",
                  "name",
                  "price"
                ],
                "rows": [
                  [
                    1,
                    "PostgreSQL",
                    150
                  ]
                ]
              }
            }
          }
        },
        {
          "title": "Explain the recommended INSERT syntax",
          "why": "The preferred approach explicitly writes destination column names. It makes the SQL easier to understand, makes each destination explicit, avoids relying on remembered table order, and permits a different explicit column order.",
          "software": "pgadmin",
          "action": {
            "action": "showSqlConcept",
            "data": {
              "message": "Recommended INSERT syntax:\n\nINSERT INTO table_name (column1, column2, column3) VALUES (value1, value2, value3);\n\nExplicit column names make each destination clear and allow a different column order.",
              "statusText": "Recommended INSERT syntax"
            }
          }
        },
        {
          "title": "Insert the MySQL course using explicit columns",
          "why": "Insert the second course while explicitly naming each destination column.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "INSERT INTO course (course_number, name, price)\nVALUES (2, 'MySQL', 100);"
            }
          }
        },
        {
          "title": "Execute the second INSERT",
          "why": "Run the INSERT statement so the MySQL course record is inserted successfully.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "courseRowsAfter": [
                [
                  1,
                  "PostgreSQL",
                  150
                ],
                [
                  2,
                  "MySQL",
                  100
                ]
              ],
              "message": "INSERT 0 1",
              "statusText": "MySQL course inserted"
            }
          }
        },
        {
          "title": "Verify that two rows exist",
          "why": "Display course after the second insertion and confirm that the PostgreSQL and MySQL rows exist.",
          "software": "pgadmin",
          "action": {
            "action": "typeAndExecuteSql",
            "data": {
              "replace": true,
              "sql": "SELECT * FROM course;",
              "message": "SELECT 2",
              "statusText": "2 rows returned",
              "showTab": "data",
              "result": {
                "columns": [
                  "course_number",
                  "name",
                  "price"
                ],
                "rows": [
                  [
                    1,
                    "PostgreSQL",
                    150
                  ],
                  [
                    2,
                    "MySQL",
                    100
                  ]
                ]
              }
            }
          }
        },
        {
          "title": "Reorder the INSERT column list",
          "why": "The explicit INSERT column order does not have to match the table definition as long as VALUES follow the same explicit column order.",
          "software": "pgadmin",
          "action": {
            "action": "typeAndExecuteSql",
            "data": {
              "replace": true,
              "sql": "INSERT INTO course (name, price, course_number)\nVALUES ('MongoDB', 100, 3);",
              "courseRowsAfter": [
                [
                  1,
                  "PostgreSQL",
                  150
                ],
                [
                  2,
                  "MySQL",
                  100
                ],
                [
                  3,
                  "MongoDB",
                  100
                ]
              ],
              "message": "INSERT 0 1",
              "statusText": "MongoDB course inserted"
            }
          }
        },
        {
          "title": "Verify three inserted rows",
          "why": "Query course and confirm that three records now exist.",
          "software": "pgadmin",
          "action": {
            "action": "typeAndExecuteSql",
            "data": {
              "replace": true,
              "sql": "SELECT * FROM course;",
              "message": "SELECT 3",
              "statusText": "3 rows returned",
              "showTab": "data",
              "result": {
                "columns": [
                  "course_number",
                  "name",
                  "price"
                ],
                "rows": [
                  [
                    1,
                    "PostgreSQL",
                    150
                  ],
                  [
                    2,
                    "MySQL",
                    100
                  ],
                  [
                    3,
                    "MongoDB",
                    100
                  ]
                ]
              }
            }
          }
        },
        {
          "title": "Insert multiple rows in one SQL statement",
          "why": "Prepare three additional records in one multi-row VALUES INSERT instead of running three separate INSERT statements.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "INSERT INTO course (course_number, name, price)\nVALUES\n    (4, 'PostgreSQL_new', 150),\n    (5, 'MySQL_new', 100),\n    (6, 'MongoDB_new', 100);"
            }
          }
        },
        {
          "title": "Execute the multi-row INSERT",
          "why": "Execute the multi-row INSERT so three additional records are added to course.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "courseRowsAfter": [
                [
                  1,
                  "PostgreSQL",
                  150
                ],
                [
                  2,
                  "MySQL",
                  100
                ],
                [
                  3,
                  "MongoDB",
                  100
                ],
                [
                  4,
                  "PostgreSQL_new",
                  150
                ],
                [
                  5,
                  "MySQL_new",
                  100
                ],
                [
                  6,
                  "MongoDB_new",
                  100
                ]
              ],
              "message": "INSERT 0 3",
              "statusText": "3 rows inserted"
            }
          }
        },
        {
          "title": "Verify six rows in the course table",
          "why": "Verify the contents after inserting the additional three records. course should now contain six rows.",
          "software": "pgadmin",
          "action": {
            "action": "typeAndExecuteSql",
            "data": {
              "replace": true,
              "sql": "SELECT * FROM course;",
              "message": "SELECT 6",
              "statusText": "6 rows returned",
              "showTab": "data",
              "result": {
                "columns": [
                  "course_number",
                  "name",
                  "price"
                ],
                "rows": [
                  [
                    1,
                    "PostgreSQL",
                    150
                  ],
                  [
                    2,
                    "MySQL",
                    100
                  ],
                  [
                    3,
                    "MongoDB",
                    100
                  ],
                  [
                    4,
                    "PostgreSQL_new",
                    150
                  ],
                  [
                    5,
                    "MySQL_new",
                    100
                  ],
                  [
                    6,
                    "MongoDB_new",
                    100
                  ]
                ]
              }
            }
          }
        },
        {
          "title": "Create a new table from an existing table",
          "why": "CREATE TABLE AS creates a new table from a SELECT result. new_course will copy the six rows currently in course.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "CREATE TABLE new_course AS\nSELECT * FROM course;"
            }
          }
        },
        {
          "title": "Execute CREATE TABLE AS SELECT",
          "why": "Execute the command so new_course is created containing the six rows from course.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "createNewCourse": true,
              "newCourseRowsAfter": [
                [
                  1,
                  "PostgreSQL",
                  150
                ],
                [
                  2,
                  "MySQL",
                  100
                ],
                [
                  3,
                  "MongoDB",
                  100
                ],
                [
                  4,
                  "PostgreSQL_new",
                  150
                ],
                [
                  5,
                  "MySQL_new",
                  100
                ],
                [
                  6,
                  "MongoDB_new",
                  100
                ]
              ],
              "message": "SELECT 6",
              "statusText": "new_course created with 6 rows"
            }
          }
        },
        {
          "title": "View data from the new table",
          "why": "Query new_course to confirm that the copied course records are present.",
          "software": "pgadmin",
          "action": {
            "action": "typeAndExecuteSql",
            "data": {
              "replace": true,
              "sql": "SELECT * FROM new_course;",
              "message": "SELECT 6",
              "statusText": "6 rows returned from new_course",
              "showTab": "data",
              "result": {
                "columns": [
                  "course_number",
                  "name",
                  "price"
                ],
                "rows": [
                  [
                    1,
                    "PostgreSQL",
                    150
                  ],
                  [
                    2,
                    "MySQL",
                    100
                  ],
                  [
                    3,
                    "MongoDB",
                    100
                  ],
                  [
                    4,
                    "PostgreSQL_new",
                    150
                  ],
                  [
                    5,
                    "MySQL_new",
                    100
                  ],
                  [
                    6,
                    "MongoDB_new",
                    100
                  ]
                ]
              }
            }
          }
        },
        {
          "title": "Insert rows from one table into another",
          "why": "Use INSERT INTO ... SELECT so rows returned from new_course become rows inserted into course instead of supplying literal VALUES.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "INSERT INTO course (course_number, name, price)\nSELECT course_number, name, price\nFROM new_course;"
            }
          }
        },
        {
          "title": "Execute INSERT INTO SELECT",
          "why": "Run the INSERT...SELECT statement. Six rows from new_course are added to the existing six rows in course.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "courseRowsAfter": [
                [
                  1,
                  "PostgreSQL",
                  150
                ],
                [
                  2,
                  "MySQL",
                  100
                ],
                [
                  3,
                  "MongoDB",
                  100
                ],
                [
                  4,
                  "PostgreSQL_new",
                  150
                ],
                [
                  5,
                  "MySQL_new",
                  100
                ],
                [
                  6,
                  "MongoDB_new",
                  100
                ],
                [
                  1,
                  "PostgreSQL",
                  150
                ],
                [
                  2,
                  "MySQL",
                  100
                ],
                [
                  3,
                  "MongoDB",
                  100
                ],
                [
                  4,
                  "PostgreSQL_new",
                  150
                ],
                [
                  5,
                  "MySQL_new",
                  100
                ],
                [
                  6,
                  "MongoDB_new",
                  100
                ]
              ],
              "message": "INSERT 0 6",
              "statusText": "6 rows copied into course"
            }
          }
        },
        {
          "title": "Verify twelve rows in the original table",
          "why": "Query course after copying all six rows from new_course back into it. The original six rows remain and another six duplicate rows were inserted.",
          "software": "pgadmin",
          "action": {
            "action": "typeAndExecuteSql",
            "data": {
              "replace": true,
              "sql": "SELECT * FROM course;",
              "message": "SELECT 12",
              "statusText": "12 rows returned",
              "showTab": "data",
              "result": {
                "columns": [
                  "course_number",
                  "name",
                  "price"
                ],
                "rows": [
                  [
                    1,
                    "PostgreSQL",
                    150
                  ],
                  [
                    2,
                    "MySQL",
                    100
                  ],
                  [
                    3,
                    "MongoDB",
                    100
                  ],
                  [
                    4,
                    "PostgreSQL_new",
                    150
                  ],
                  [
                    5,
                    "MySQL_new",
                    100
                  ],
                  [
                    6,
                    "MongoDB_new",
                    100
                  ],
                  [
                    1,
                    "PostgreSQL",
                    150
                  ],
                  [
                    2,
                    "MySQL",
                    100
                  ],
                  [
                    3,
                    "MongoDB",
                    100
                  ],
                  [
                    4,
                    "PostgreSQL_new",
                    150
                  ],
                  [
                    5,
                    "MySQL_new",
                    100
                  ],
                  [
                    6,
                    "MongoDB_new",
                    100
                  ]
                ]
              }
            }
          }
        },
        {
          "title": "Explain why INSERT is DML",
          "why": "INSERT belongs to Data Manipulation Language because it changes the data stored inside a database table. UPDATE and DELETE are also DML.",
          "software": "pgadmin",
          "action": {
            "action": "showSqlConcept",
            "data": {
              "message": "DML classification\n\nINSERT — DML\nUPDATE — DML\nDELETE — DML\n\nINSERT changes the data stored in a table.",
              "statusText": "INSERT is DML"
            }
          }
        },
        {
          "title": "Explain PostgreSQL characteristics",
          "why": "PostgreSQL is a powerful open-source relational database management system. It is SQL compliant and supports Data Manipulation Language.",
          "software": "pgadmin",
          "action": {
            "action": "showSqlConcept",
            "data": {
              "message": "PostgreSQL characteristics\n\n• Relational Database Management System\n• Open source\n• SQL compliant\n• Supports DML",
              "statusText": "PostgreSQL characteristics"
            }
          }
        },
        {
          "title": "Return to Student.java after PostgreSQL verification",
          "why": "Schema, sample data, query result, EXPLAIN, index checks complete ayyaka developer malli IntelliJ ki vastadu. Java project state continuous ga preserve avuthundi.",
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
      "subtitle": "20-step VS Code test against the full Java Practice project using realistic Explorer, tabs, syntax coloring, terminal, and editor state.",
      "steps": [
        {
          "title": "Open full Calculator.java in VS Code",
          "why": "Ippudu VS Code lo actual Java Practice repo nundi Calculator.java open chestunnam. Full project tree, Java syntax colors, line numbers, tabs, indentation guides, minimap anni real VS Code laga test cheyyachu.",
          "software": "vscode",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/polymorphism/Calculator.java"
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
    },
    {
      "title": "6: Linux Developer Workstation",
      "subtitle": "Test a realistic IntelliJ → Ubuntu/Linux terminal → system tools → IntelliJ workflow with a stateful virtual Bash environment.",
      "steps": [
        {
          "title": "Review Student.java before Linux work",
          "why": "Linux terminal ki switch avvadaniki mundu developer Java project context ni IntelliJ lo review chestadu. Ee workflow same Java Practice project meeda continue avuthundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Open the Linux project terminal",
          "why": "Production-style Java work lo Linux terminal common. Project root directory lo shell open chesi commands correct project meeda run avuthunnaya ani start chestam.",
          "software": "linux",
          "action": {
            "action": "setCwd",
            "data": {
              "path": "/home/developer/JavaPractice"
            }
          }
        },
        {
          "title": "Confirm the current Linux directory",
          "why": "pwd current working directory ni print chestundi. Developer expected JavaPractice folder lo unnado idi confirm chestundi.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "pwd"
            }
          }
        },
        {
          "title": "Inspect project files with Linux permissions",
          "why": "ls -la hidden files, permissions, owner mariyu project files ni detailed ga chupistundi. Linux deployment/debugging lo ee information chala useful.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "ls -la"
            }
          }
        },
        {
          "title": "Verify Java 21 on Linux",
          "why": "Linux machine expected Java runtime ni use chesthundha ani java -version tho verify chestam.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "java -version"
            }
          }
        },
        {
          "title": "Check JAVA_HOME",
          "why": "Java tools correct JDK ni locate cheyyadaniki JAVA_HOME important. Bash variable expansion kuda ee step lo test avuthundi.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "echo $JAVA_HOME"
            }
          }
        },
        {
          "title": "Set the application environment",
          "why": "export command current Bash session lo environment variable set chestundi. Local, QA, prod laanti runtime profiles ni ila control cheyyadam common.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "export APP_ENV=local && echo $APP_ENV"
            }
          }
        },
        {
          "title": "Create build files from the shell",
          "why": "mkdir -p mariyu touch commands virtual Linux filesystem ni actually modify chestayi. Playback text matrame kaakunda filesystem state preserve avuthundi.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "mkdir -p build && touch build/status.txt"
            }
          }
        },
        {
          "title": "Redirect output into a Linux file",
          "why": "> redirection shell output ni file lo write chestundi. Taruvatha cat tho same file content ni read chesi redirection state verify chestam.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "echo build=verified > build/status.txt && cat build/status.txt"
            }
          }
        },
        {
          "title": "Filter project text through a pipe",
          "why": "Linux lo pipes daily workflow lo important. cat output ni grep ki pampinchi Java text ni filter chestunnam.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "cat README.md | grep Java"
            }
          }
        },
        {
          "title": "Make the health script executable",
          "why": "Linux permissions executable scripts ni control chestayi. chmod +x tho health-check script run cheyyadaniki permission add chestam.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "chmod +x scripts/health-check.sh"
            }
          }
        },
        {
          "title": "Run the Bash health-check script",
          "why": "Shell script execution Linux developer workflow lo common. Previous permission change taruvatha script command execute ayi output generate chestundi.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "./scripts/health-check.sh"
            }
          }
        },
        {
          "title": "Check the Java service status",
          "why": "systemctl status tho deployed service running state ni inspect chestam. Linux production troubleshooting lo idi core command.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "systemctl status java-practice.service"
            }
          }
        },
        {
          "title": "Restart the Java service",
          "why": "Configuration or deployment change taruvatha developer service ni restart cheyyalsi vastundi. Simulator service state ni inactive nundi active ki update chestundi.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "sudo systemctl restart java-practice.service"
            }
          }
        },
        {
          "title": "Inspect recent service logs",
          "why": "journalctl service logs ni inspect cheyyadaniki use chestam. Restart event and application logs ni terminal nundi verify cheyyachu.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "journalctl -u java-practice.service -n 5"
            }
          }
        },
        {
          "title": "Inspect Linux network addresses",
          "why": "ip addr server interfaces mariyu IP addresses ni show chestundi. Connectivity issues troubleshoot cheyyadaniki idi common first check.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "ip addr"
            }
          }
        },
        {
          "title": "Inspect listening ports",
          "why": "ss -tulpn tho application, PostgreSQL, SSH laanti services e ports meeda listen chestunnayo verify cheyyachu.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "ss -tulpn"
            }
          }
        },
        {
          "title": "Check disk usage",
          "why": "df -h filesystem usage ni human-readable format lo chupistundi. Disk-full production issues identify cheyyadaniki idi important.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "df -h"
            }
          }
        },
        {
          "title": "Run the Maven test workflow",
          "why": "Linux CI/server environment lo Maven commands frequently run chestaru. mvn test deterministic build output tho Java build workflow ni simulate chestundi.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "mvn test"
            }
          }
        },
        {
          "title": "Start and stop Spring Boot on Linux",
          "why": "mvn spring-boot:run long-running Java process ni start chestundi. Taruvatha Ctrl+C behavior ni separate simulator action tho stop chestam.",
          "software": "linux",
          "action": {
            "action": "executeCommand",
            "data": {
              "command": "mvn spring-boot:run"
            }
          }
        },
        {
          "title": "Stop the running Spring Boot process",
          "why": "Terminal lo Ctrl+C long-running foreground process ni terminate chestundi. Linux developer ki idi daily interaction.",
          "software": "linux",
          "action": {
            "action": "stopProcess",
            "data": {
              "output": "^C"
            }
          }
        },
        {
          "title": "Return to Student.java after Linux checks",
          "why": "Linux verification complete ayyaka developer malli IntelliJ ki return avuthadu. Multi-software timeline continuity preserve avuthundi.",
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
      "title": "7: SQL Server Management Studio Workflow",
      "subtitle": "Test a realistic IntelliJ → SSMS → T-SQL → results/performance → IntelliJ workflow with a stateful virtual SQL Server.",
      "steps": [
        {
          "title": "Review Student.java before SQL Server work",
          "why": "SQL Server table design start cheyyadaniki mundu developer Student.java model ni IntelliJ lo review chestadu. Java fields database columns tho ela map avvalo clarity vastundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Open the SQL Server connection dialog",
          "why": "Database work start cheyyadaniki SSMS lo Database Engine connection dialog open chestam. Server, authentication mariyu target database details ikkada configure chestam.",
          "software": "ssms",
          "action": {
            "action": "openConnectDialog",
            "data": {}
          }
        },
        {
          "title": "Set localhost as the SQL Server",
          "why": "Development environment lo local SQL Server instance ni connect cheyyadaniki server name localhost ga set chestunnam.",
          "software": "ssms",
          "action": {
            "action": "setConnectionField",
            "data": {
              "field": "serverName",
              "value": "localhost"
            }
          }
        },
        {
          "title": "Use Windows Authentication",
          "why": "Local developer machine lo Windows Authentication common secure option. Separate SQL password lekunda current Windows identity ni use chestundi.",
          "software": "ssms",
          "action": {
            "action": "setConnectionField",
            "data": {
              "field": "authentication",
              "value": "Windows Authentication"
            }
          }
        },
        {
          "title": "Connect and open the Databases node",
          "why": "Connection successful ayyaka Object Explorer lo server tree mariyu Databases node available avuthayi. Ikkada nundi application database ni navigate chestam.",
          "software": "ssms",
          "action": {
            "action": "connectServer",
            "data": {
              "database": "JavaPracticeDb",
              "userName": "developer",
              "expandDatabases": true,
              "statusText": "Ready"
            }
          }
        },
        {
          "title": "Expand JavaPracticeDb",
          "why": "Application-specific tables, views, programmability objects choodadaniki JavaPracticeDb database node ni expand chestam.",
          "software": "ssms",
          "action": {
            "action": "expandNode",
            "data": {
              "id": "db:JavaPracticeDb",
              "select": true
            }
          }
        },
        {
          "title": "Set JavaPracticeDb as the query database",
          "why": "Query execute ayye database context explicit ga JavaPracticeDb ki set chesthe commands wrong database meeda run avvakunda untayi.",
          "software": "ssms",
          "action": {
            "action": "changeDatabase",
            "data": {
              "database": "JavaPracticeDb"
            }
          }
        },
        {
          "title": "Open a new SQL query",
          "why": "DDL mariyu data validation commands rayadaniki new query editor open chestam. Ee editor manual typing kuda support chestundi.",
          "software": "ssms",
          "action": {
            "action": "newQuery",
            "data": {
              "id": "student-query",
              "title": "student_setup.sql",
              "database": "JavaPracticeDb"
            }
          }
        },
        {
          "title": "Type the student table definition",
          "why": "Java Student model ki corresponding SQL Server table ni T-SQL tho define chestam. Primary key mariyu NOT NULL constraints kuda schema lo include chestunnam.",
          "software": "ssms",
          "action": {
            "action": "typeSql",
            "data": {
              "sql": "CREATE TABLE dbo.student (\n    roll_no INT PRIMARY KEY,\n    is_present BIT NOT NULL,\n    name NVARCHAR(100) NOT NULL\n);",
              "boundary": true
            }
          }
        },
        {
          "title": "Execute CREATE TABLE",
          "why": "Execute chesthe simulator virtual T-SQL engine statement ni parse chesi dbo.student table ni actual simulator database state lo create chestundi.",
          "software": "ssms",
          "action": {
            "action": "executeQuery",
            "data": {}
          }
        },
        {
          "title": "Refresh Object Explorer",
          "why": "Schema change taruvatha Object Explorer refresh chesthe newly created table tree lo kanipistundi. Real SSMS workflow lo idi common step.",
          "software": "ssms",
          "action": {
            "action": "refreshObjectExplorer",
            "data": {}
          }
        },
        {
          "title": "Expand the Tables folder",
          "why": "JavaPracticeDb Tables folder open chesi dbo.student object create ayyindha ani visual ga verify chestam.",
          "software": "ssms",
          "action": {
            "action": "expandNode",
            "data": {
              "id": "folder:JavaPracticeDb:Tables",
              "select": true
            }
          }
        },
        {
          "title": "Insert two student rows",
          "why": "Table schema verify ayyaka sample records insert chestam. Multi-row INSERT virtual database state ni update chestundi.",
          "software": "ssms",
          "action": {
            "action": "typeSql",
            "data": {
              "sql": "INSERT INTO dbo.student (roll_no, is_present, name)\nVALUES (101, 1, 'Ravi'),\n       (102, 1, 'Anita');"
            }
          }
        },
        {
          "title": "Execute the INSERT",
          "why": "INSERT run ayyaka Ravi mariyu Anita rows dbo.student table lo persist avuthayi. Subsequent SELECT same state nundi data read chestundi.",
          "software": "ssms",
          "action": {
            "action": "executeQuery",
            "data": {}
          }
        },
        {
          "title": "Write a SELECT for student 101",
          "why": "Backend expected record ni database level lo verify cheyyadaniki roll_no 101 meeda filtered SELECT query rayadam normal debugging workflow.",
          "software": "ssms",
          "action": {
            "action": "typeSql",
            "data": {
              "sql": "SELECT roll_no, is_present, name\nFROM dbo.student\nWHERE roll_no = 101;"
            }
          }
        },
        {
          "title": "Execute the SELECT and inspect the grid",
          "why": "Query execute chesthe hard-coded screenshot kaakunda virtual table state nundi dynamic result grid generate avuthundi.",
          "software": "ssms",
          "action": {
            "action": "executeQuery",
            "data": {}
          }
        },
        {
          "title": "Show the actual execution plan",
          "why": "Query performance understand cheyyadaniki execution plan operators ni inspect chestam. Scan leka seek laanti access pattern ni visual ga identify cheyyachu.",
          "software": "ssms",
          "action": {
            "action": "showActualExecutionPlan",
            "data": {
              "table": "dbo.student"
            }
          }
        },
        {
          "title": "Inspect client statistics",
          "why": "Rows returned mariyu execution timing laanti client statistics query behavior ni quick ga assess cheyyadaniki useful.",
          "software": "ssms",
          "action": {
            "action": "showClientStatistics",
            "data": {}
          }
        },
        {
          "title": "Type a transaction with ROLLBACK",
          "why": "Production data ni modify cheyyadaniki mundu transaction behavior understand cheyyali. UPDATE taruvatha ROLLBACK chesthe original value restore avuthundi.",
          "software": "ssms",
          "action": {
            "action": "typeSql",
            "data": {
              "sql": "BEGIN TRAN;\nUPDATE dbo.student\nSET name = 'Ravi Kumar'\nWHERE roll_no = 101;\nROLLBACK;"
            }
          }
        },
        {
          "title": "Execute and roll back the transaction",
          "why": "Virtual T-SQL engine BEGIN TRAN, UPDATE mariyu ROLLBACK ni statefully process chestundi. Change permanent ga save kakunda undo avuthundi.",
          "software": "ssms",
          "action": {
            "action": "executeQuery",
            "data": {}
          }
        },
        {
          "title": "Save the SQL script",
          "why": "Useful schema and test queries ni source control lo preserve cheyyadaniki .sql file ga save chestam.",
          "software": "ssms",
          "action": {
            "action": "saveQuery",
            "data": {
              "path": "C:\\JavaPractice\\sql\\student_setup.sql",
              "fileName": "student_setup.sql"
            }
          }
        },
        {
          "title": "Open Activity Monitor",
          "why": "Database sessions mariyu running commands troubleshoot cheyyadaniki Activity Monitor use chestam. Developer connection status ni ikkada inspect cheyyachu.",
          "software": "ssms",
          "action": {
            "action": "openActivityMonitor",
            "data": {}
          }
        },
        {
          "title": "Create an index for student lookups",
          "why": "Frequently filtered roll_no column meeda index maintain chesthe query access path realistic ga model cheyyachu. Object Explorer lo Indexes node kuda update avuthundi.",
          "software": "ssms",
          "action": {
            "action": "createIndex",
            "data": {
              "database": "JavaPracticeDb",
              "table": "dbo.student",
              "name": "IX_student_roll_no",
              "columns": [
                "roll_no"
              ],
              "unique": true
            }
          }
        },
        {
          "title": "Inspect Object Explorer details",
          "why": "Current database objects ni quick summary ga choodadaniki Object Explorer Details useful. Table count mariyu selected object context verify chestam.",
          "software": "ssms",
          "action": {
            "action": "showObjectExplorerDetails",
            "data": {}
          }
        },
        {
          "title": "Back up JavaPracticeDb",
          "why": "Schema/data changes taruvatha database backup create cheyyadam production-safe workflow lo important. Simulator backup history ni statefully maintain chestundi.",
          "software": "ssms",
          "action": {
            "action": "backupDatabase",
            "data": {
              "database": "JavaPracticeDb",
              "type": "Full",
              "path": "C:\\SQLBackups\\JavaPracticeDb_full.bak",
              "time": "13:30"
            }
          }
        },
        {
          "title": "Create a SQL Server Agent maintenance job",
          "why": "Recurring database maintenance automate cheyyadaniki SQL Server Agent job create chestam. Ee job ki steps and status simulator state lo persist avuthayi.",
          "software": "ssms",
          "action": {
            "action": "createAgentJob",
            "data": {
              "name": "JavaPractice Nightly Maintenance",
              "steps": [
                {
                  "name": "Update Statistics",
                  "command": "UPDATE STATISTICS dbo.student"
                }
              ]
            }
          }
        },
        {
          "title": "Schedule the maintenance job",
          "why": "Job manual ga matrame కాకుండా schedule meeda run avvali. Daily 2 AM schedule add chesi automated operations workflow ni simulate chestam.",
          "software": "ssms",
          "action": {
            "action": "createAgentSchedule",
            "data": {
              "job": "JavaPractice Nightly Maintenance",
              "schedule": "Nightly 2 AM",
              "frequency": "Daily",
              "time": "02:00"
            }
          }
        },
        {
          "title": "Run the SQL Server Agent job",
          "why": "Job configuration validate cheyyadaniki manual test run chestam. Successful run job history lo record avuthundi.",
          "software": "ssms",
          "action": {
            "action": "runAgentJob",
            "data": {
              "name": "JavaPractice Nightly Maintenance",
              "time": "13:31",
              "duration": "00:00:02"
            }
          }
        },
        {
          "title": "Review SQL Server Agent job history",
          "why": "Scheduled task successful ga execute ayyindha ani Job History lo status, run time mariyu duration inspect chestam.",
          "software": "ssms",
          "action": {
            "action": "showAgentJobHistory",
            "data": {}
          }
        },
        {
          "title": "Open the SSMS query editor context menu",
          "why": "SSMS lo query editor meeda right-click chesthe execution, IntelliSense, execution plans, live statistics, results mode, Properties mariyu Query Options laanti commands oka contextual menu lo available untayi. Ee lesson transcript-driven UI capability ni simulator lo directly demonstrate chestundi.",
          "software": "ssms",
          "action": {
            "action": "openContextMenu",
            "data": {
              "menu": "queryEditor",
              "x": 650,
              "y": 255,
              "context": {
                "kind": "queryEditor"
              }
            }
          }
        },
        {
          "title": "Inspect dbo.student Object Dependencies",
          "why": "Database object relationships understand cheyyadaniki SSMS Object Dependencies dialog use chestam. Dependency direction radio options, expandable dependency list, connection details mariyu object metadata oka dedicated SSMS dialog lo display avuthayi.",
          "software": "ssms",
          "action": {
            "action": "showObjectDependencies",
            "data": {
              "object": "dbo.student",
              "type": "Table",
              "direction": "dependsOn",
              "selected": "dbo.student",
              "dependencies": [
                {
                  "name": "JavaPracticeDb",
                  "type": "Database",
                  "level": 0
                },
                {
                  "name": "dbo.student",
                  "type": "Table",
                  "level": 1
                },
                {
                  "name": "PK_student",
                  "type": "Primary Key",
                  "level": 2
                },
                {
                  "name": "IX_student_roll_no",
                  "type": "Index",
                  "level": 2
                }
              ]
            }
          }
        },
        {
          "title": "Return to Student.java after database verification",
          "why": "Database schema, data mariyu query checks complete ayyaka developer malli IntelliJ ki return avuthadu. Project timeline continuity preserve avuthundi.",
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
      "title": "8: Jira Developer Workflow",
      "subtitle": "Follow a realistic Java developer ticket from sprint board through development, CI, QA, review, release tracking, and reporting.",
      "steps": [
        {
          "title": "Review Student.java before starting the Jira ticket",
          "why": "Jira ticket start cheyyadaniki mundu developer existing Student.java context ni IntelliJ lo quick ga review chestadu. Ticket requirement code structure tho ela connect avuthundo clarity vastundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Open the active Jira sprint board",
          "why": "Office day lo developer first active sprint board open chesi assigned work, current status mariyu team flow ni check chestadu.",
          "software": "jira",
          "action": {
            "action": "openBoard",
            "data": {}
          }
        },
        {
          "title": "Open JAVA-101 Student API story",
          "why": "Implementation start cheyyadaniki mundu story description, parent epic, priority, sprint mariyu dependencies ni issue panel lo review chestam.",
          "software": "jira",
          "action": {
            "action": "openIssue",
            "data": {
              "key": "JAVA-101",
              "boundary": true
            }
          }
        },
        {
          "title": "Assign JAVA-101 to the developer",
          "why": "Ticket ni actively own chestunnappudu assignee ni Developer ga set chestam. Team ki evaru work chestunnaro clear ga kanipistundi.",
          "software": "jira",
          "action": {
            "action": "assignIssue",
            "data": {
              "key": "JAVA-101",
              "assignee": "Developer"
            }
          }
        },
        {
          "title": "Move the story to IN PROGRESS",
          "why": "Actual implementation start ayyaka work item status ni IN PROGRESS ki move chestam. Sprint board current work ni correct ga reflect chestundi.",
          "software": "jira",
          "action": {
            "action": "setStatus",
            "data": {
              "key": "JAVA-101",
              "status": "IN PROGRESS"
            }
          }
        },
        {
          "title": "Set the delivery due date",
          "why": "Target delivery date ni ticket lo record chesthe sprint planning mariyu release coordination easy avuthayi.",
          "software": "jira",
          "action": {
            "action": "setDueDate",
            "data": {
              "key": "JAVA-101",
              "dueDate": "2026-09-28"
            }
          }
        },
        {
          "title": "Add the original and remaining estimate",
          "why": "Work effort track cheyyadaniki original estimate mariyu remaining estimate set chestam. Sprint capacity discussion lo ee values useful.",
          "software": "jira",
          "action": {
            "action": "setEstimate",
            "data": {
              "key": "JAVA-101",
              "original": "6h",
              "minutes": 360,
              "remaining": "6h"
            }
          }
        },
        {
          "title": "Log the first hour of development work",
          "why": "Implementation meeda spend chesina time ni Jira worklog lo record chestam. Remaining estimate kuda update chesthe progress realistic ga track avuthundi.",
          "software": "jira",
          "action": {
            "action": "logWork",
            "data": {
              "key": "JAVA-101",
              "author": "Developer",
              "timeSpent": "1h",
              "minutes": 60,
              "remainingEstimate": "5h",
              "comment": "Reviewed model and API contract",
              "date": "2026-09-22"
            }
          }
        },
        {
          "title": "Add a progress comment",
          "why": "Team members ki context ivvadaniki concise progress comment add chestam. Stand-up leka handoff mundu ticket history useful ga untundi.",
          "software": "jira",
          "action": {
            "action": "addComment",
            "data": {
              "key": "JAVA-101",
              "author": "Developer",
              "time": "Today",
              "text": "Student model and database contract verified. Starting endpoint implementation."
            }
          }
        },
        {
          "title": "Create the feature branch from the Jira story",
          "why": "Jira key branch name lo include chesthe code changes ticket tho traceable ga untayi. Branch, commit, PR development panel lo connect avuthayi.",
          "software": "jira",
          "action": {
            "action": "createBranch",
            "data": {
              "key": "JAVA-101",
              "name": "feature/JAVA-101-student-get"
            }
          }
        },
        {
          "title": "Link the implementation commit",
          "why": "Commit ni Jira story tho link chesthe requirement nundi exact code change varaku traceability maintain avuthundi.",
          "software": "jira",
          "action": {
            "action": "linkCommit",
            "data": {
              "key": "JAVA-101",
              "id": "8f4c2ad",
              "message": "JAVA-101 implement student lookup endpoint"
            }
          }
        },
        {
          "title": "Link the pull request",
          "why": "Code review status ni Jira nundi choodadaniki pull request ni story tho link chestam. Developer workflow ticket nundi Git review varaku continuous ga untundi.",
          "software": "jira",
          "action": {
            "action": "linkPullRequest",
            "data": {
              "key": "JAVA-101",
              "title": "JAVA-101 Student lookup endpoint",
              "status": "OPEN"
            }
          }
        },
        {
          "title": "Record the successful CI build",
          "why": "Pull request build green ga undha ani Jira development information lo surface chestam. Review mundu automated validation pass ayyindha ani team verify cheyyachu.",
          "software": "jira",
          "action": {
            "action": "setBuildStatus",
            "data": {
              "key": "JAVA-101",
              "name": "Java CI",
              "status": "SUCCESS",
              "number": "184"
            }
          }
        },
        {
          "title": "Record the QA deployment",
          "why": "Build QA environment ki deploy ayyaka deployment status ticket tho link chestam. Code complete nundi test environment varaku lifecycle visible ga untundi.",
          "software": "jira",
          "action": {
            "action": "setDeploymentStatus",
            "data": {
              "key": "JAVA-101",
              "environment": "QA",
              "status": "SUCCESS",
              "version": "1.2.0-rc1"
            }
          }
        },
        {
          "title": "Assign the story to release 1.2.0",
          "why": "Fix Version set chesthe JAVA-101 release scope lo officially include avuthundi. Release page progress ticket statuses nundi calculate avuthundi.",
          "software": "jira",
          "action": {
            "action": "setFixVersion",
            "data": {
              "key": "JAVA-101",
              "version": "1.2.0",
              "replace": true
            }
          }
        },
        {
          "title": "Review linked development activity",
          "why": "Development view lo branch, commit, pull request, build mariyu deployment counts oka place lo verify chestam.",
          "software": "jira",
          "action": {
            "action": "openDevelopment",
            "data": {}
          }
        },
        {
          "title": "Search the developer's release work with JQL",
          "why": "JQL use chesi current user ki assign ayina 1.2.0 release work ni filter chestam. Real Jira lo focused triage kosam advanced search common.",
          "software": "jira",
          "action": {
            "action": "runJql",
            "data": {
              "jql": "project = JAVA AND fixVersion = \"1.2.0\" AND assignee = currentUser() ORDER BY key ASC",
              "boundary": false
            }
          }
        },
        {
          "title": "Review the sprint backlog",
          "why": "Implementation progress madhyalo backlog open chesi current sprint mariyu future sprint work separation ni verify chestam.",
          "software": "jira",
          "action": {
            "action": "openBacklog",
            "data": {}
          }
        },
        {
          "title": "Create a review automation rule",
          "why": "Repetitive status transitions automate cheyyadaniki Jira Automation rule create chestam. CI or PR event taruvatha review status update avvadam common team pattern.",
          "software": "jira",
          "action": {
            "action": "createAutomation",
            "data": {
              "name": "JAVA-101 Ready for review",
              "trigger": "Build succeeded",
              "condition": "Issue = JAVA-101",
              "action": "Transition work item",
              "targetStatus": "CODE REVIEW"
            }
          }
        },
        {
          "title": "Run the automation and move JAVA-101 to CODE REVIEW",
          "why": "Successful CI signal taruvatha automation rule story ni CODE REVIEW ki move chestundi. Manual status maintenance thaggutundi.",
          "software": "jira",
          "action": {
            "action": "runAutomation",
            "data": {
              "name": "JAVA-101 Ready for review",
              "key": "JAVA-101",
              "status": "CODE REVIEW",
              "result": "SUCCESS",
              "time": "Today"
            }
          }
        },
        {
          "title": "Open JAVA-101 after automated transition",
          "why": "Automation correct ga work ayyindha ani issue ni malli open chesi status, development links mariyu worklog context verify chestam.",
          "software": "jira",
          "action": {
            "action": "openIssue",
            "data": {
              "key": "JAVA-101"
            }
          }
        },
        {
          "title": "Complete JAVA-101 after review",
          "why": "Review approve ayyaka story ni DONE ki transition chestam. Sprint metrics mariyu release progress automatically updated state ni use chestayi.",
          "software": "jira",
          "action": {
            "action": "transitionIssue",
            "data": {
              "key": "JAVA-101",
              "to": "DONE"
            }
          }
        },
        {
          "title": "Review release 1.2.0 progress",
          "why": "Releases view lo 1.2.0 scope lo unna work items mariyu completed count ni inspect chestam. Ticket completion release planning tho connect avuthundi.",
          "software": "jira",
          "action": {
            "action": "openReleases",
            "data": {}
          }
        },
        {
          "title": "Open the Jira team dashboard",
          "why": "Dashboard gadgets assigned work, sprint health, created-versus-resolved mariyu activity ni quick team summary ga chupistayi.",
          "software": "jira",
          "action": {
            "action": "openDashboard",
            "data": {}
          }
        },
        {
          "title": "Inspect the sprint burndown report",
          "why": "Sprint end ki progress trend ni check cheyyadaniki burndown report use chestam. Remaining work and scope health ni quick ga assess cheyyachu.",
          "software": "jira",
          "action": {
            "action": "openReport",
            "data": {
              "report": "burndown"
            }
          }
        },
        {
          "title": "Return to Student.java after Jira workflow completion",
          "why": "Ticket workflow complete ayyaka developer malli IntelliJ ki return avuthadu. Jira, Git-style development data, release tracking mariyu code timeline continuous ga preserve avuthayi.",
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
      "title": "9: Jenkins CI/CD Workflow",
      "subtitle": "Troubleshoot a failed Java build, verify Jenkins pipeline configuration, rerun the Student API CI/CD pipeline, and inspect the successful output.",
      "steps": [
        {
          "title": "Review Student.java before CI troubleshooting",
          "why": "Jenkins failure ni investigate cheyyadaniki mundu developer latest Student.java change ni IntelliJ lo review chestadu. Build failure code change tho related aa ani context establish avuthundi.",
          "software": "intellij",
          "action": {
            "action": "openFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Open the Jenkins dashboard",
          "why": "CI status check cheyyadaniki developer Jenkins dashboard open chestadu. Java Practice jobs health mariyu latest build status ikkada quick ga kanipistayi.",
          "software": "jenkins",
          "action": {
            "action": "openDashboard",
            "data": {}
          }
        },
        {
          "title": "Search for the Java Practice pipeline",
          "why": "Multiple Jenkins jobs unna environment lo search use chesi java-practice-api pipeline ni fast ga locate chestam.",
          "software": "jenkins",
          "action": {
            "action": "typeSearch",
            "data": {
              "text": "java-practice-api",
              "boundary": false
            }
          }
        },
        {
          "title": "Open java-practice-api",
          "why": "Student API ki sambandhinchina pipeline configuration, build history mariyu latest result inspect cheyyadaniki job open chestam.",
          "software": "jenkins",
          "action": {
            "action": "openJob",
            "data": {
              "name": "java-practice-api"
            }
          }
        },
        {
          "title": "Open failed build #41",
          "why": "Latest build fail ayyindi kabatti exact stage, console output, test failure inspect cheyyadaniki build #41 open chestam.",
          "software": "jenkins",
          "action": {
            "action": "openBuild",
            "data": {
              "job": "java-practice-api",
              "number": 41
            }
          }
        },
        {
          "title": "Inspect the failed console output",
          "why": "Console Output CI failure root cause identify cheyyadaniki primary place. Integration test 500 response valla build fail ayyindani verify chestam.",
          "software": "jenkins",
          "action": {
            "action": "showConsole",
            "data": {
              "job": "java-practice-api",
              "number": 41,
              "text": "Started by user developer\\nRunning on linux-java21-agent\\n[Pipeline] Checkout\\nChecking out main\\n[Pipeline] Build\\nBUILD SUCCESS\\n[Pipeline] Test\\n42 unit tests passed\\nERROR StudentApiIntegrationTest: expected 200 but received 500\\nFinished: FAILURE"
            }
          }
        },
        {
          "title": "Open the JUnit test report",
          "why": "Console summary tarvatha exact failed test, message mariyu stack location ni Jenkins Test Result view lo inspect chestam.",
          "software": "jenkins",
          "action": {
            "action": "openTestResults",
            "data": {
              "job": "java-practice-api",
              "number": 41
            }
          }
        },
        {
          "title": "Open Jenkins node status",
          "why": "Failure infrastructure problem aa kaada ani rule out cheyyadaniki Linux Java 21 agent online undho executors available unnaya ani Nodes view lo verify chestam.",
          "software": "jenkins",
          "action": {
            "action": "openNodes",
            "data": {}
          }
        },
        {
          "title": "Return to the Java Practice job",
          "why": "Agent healthy ani confirm ayyaka configuration ni validate cheyyadaniki Java Practice pipeline ki return avutham.",
          "software": "jenkins",
          "action": {
            "action": "openJob",
            "data": {
              "name": "java-practice-api"
            }
          }
        },
        {
          "title": "Open pipeline configuration",
          "why": "SCM, Java environment, parameters, trigger mariyu Jenkinsfile settings expected values tho unnaya ani Configure screen lo check chestam.",
          "software": "jenkins",
          "action": {
            "action": "openConfigureJob",
            "data": {
              "job": "java-practice-api"
            }
          }
        },
        {
          "title": "Verify the Git repository",
          "why": "Pipeline correct source repository ni checkout cheyyali. Git URL ni Java Practice repo ki set chesi SCM configuration ni establish chestam.",
          "software": "jenkins",
          "action": {
            "action": "setScmGit",
            "data": {
              "job": "java-practice-api",
              "url": "https://github.com/example/java-practice.git",
              "branch": "*/main",
              "credentials": "github-token"
            }
          }
        },
        {
          "title": "Verify the main branch",
          "why": "Production-like CI main branch meeda expected code ni build chesthundha ani branch specification ni confirm chestam.",
          "software": "jenkins",
          "action": {
            "action": "setScmBranch",
            "data": {
              "job": "java-practice-api",
              "branch": "*/main"
            }
          }
        },
        {
          "title": "Verify SCM credentials",
          "why": "Private repository access simulation kosam Jenkins credential id correct ga attach ayyindha ani confirm chestam.",
          "software": "jenkins",
          "action": {
            "action": "setScmCredentials",
            "data": {
              "job": "java-practice-api",
              "credentials": "github-token"
            }
          }
        },
        {
          "title": "Set JAVA_HOME for the build",
          "why": "Jenkins agent correct JDK 21 ni use cheyyadaniki JAVA_HOME environment variable set chestam.",
          "software": "jenkins",
          "action": {
            "action": "setEnvironmentVariable",
            "data": {
              "job": "java-practice-api",
              "name": "JAVA_HOME",
              "value": "/usr/lib/jvm/java-21-openjdk-amd64"
            }
          }
        },
        {
          "title": "Set Maven memory options",
          "why": "Maven build ki stable JVM memory settings maintain cheyyadaniki MAVEN_OPTS environment variable configure chestam.",
          "software": "jenkins",
          "action": {
            "action": "setEnvironmentVariable",
            "data": {
              "job": "java-practice-api",
              "name": "MAVEN_OPTS",
              "value": "-Xmx1024m"
            }
          }
        },
        {
          "title": "Enable build parameters",
          "why": "Same pipeline ni QA leka staging target tho reuse cheyyadaniki parameterized build enable chestam.",
          "software": "jenkins",
          "action": {
            "action": "setParameterized",
            "data": {
              "job": "java-practice-api",
              "value": true
            }
          }
        },
        {
          "title": "Add TARGET_ENV parameter",
          "why": "Deployment target ni build start time lo select cheyyadaniki Choice parameter add chestam.",
          "software": "jenkins",
          "action": {
            "action": "addParameter",
            "data": {
              "job": "java-practice-api",
              "name": "TARGET_ENV",
              "type": "Choice",
              "default": "qa",
              "description": "Deployment target",
              "choices": [
                "qa",
                "staging"
              ]
            }
          }
        },
        {
          "title": "Configure the CI trigger",
          "why": "Repository changes regular ga validate avvadaniki Jenkins cron trigger ni configure chestam. Simulator scheduling state ni preserve chestundi.",
          "software": "jenkins",
          "action": {
            "action": "setBuildTrigger",
            "data": {
              "job": "java-practice-api",
              "type": "cron",
              "value": "H/15 * * * *",
              "enabled": true
            }
          }
        },
        {
          "title": "Use Jenkinsfile from source control",
          "why": "Pipeline definition application repo tho version control lo undali. Jenkinsfile script path ni SCM-based pipeline ga configure chestam.",
          "software": "jenkins",
          "action": {
            "action": "setPipelineDefinition",
            "data": {
              "job": "java-practice-api",
              "definition": "Pipeline script from SCM",
              "scriptPath": "Jenkinsfile"
            }
          }
        },
        {
          "title": "Update the Java Jenkinsfile",
          "why": "Build, unit test, integration test, packaging mariyu QA deployment stages ni Jenkinsfile lo define chestam. CI workflow code laga versioned ga untundi.",
          "software": "jenkins",
          "action": {
            "action": "setJenkinsfile",
            "data": {
              "job": "java-practice-api",
              "text": "pipeline {\n    agent { label 'linux && java21' }\n    tools {\n        jdk 'JDK 21'\n        maven 'Maven 3.9'\n    }\n    parameters {\n        choice(name: 'TARGET_ENV', choices: ['qa', 'staging'], description: 'Deployment target')\n    }\n    stages {\n        stage('Checkout') { steps { checkout scm } }\n        stage('Build') { steps { sh 'mvn -B clean package -DskipTests' } }\n        stage('Test') {\n            parallel {\n                stage('Unit') { steps { sh 'mvn -B test' } }\n                stage('Integration') { steps { sh 'mvn -B verify -Pintegration' } }\n            }\n        }\n        stage('Package') { steps { archiveArtifacts artifacts: 'target/*.jar', fingerprint: true } }\n        stage('Deploy QA') { steps { echo \"Deploying to ${params.TARGET_ENV}\" } }\n    }\n    post {\n        always { junit 'target/surefire-reports/*.xml' }\n    }\n}",
              "boundary": false
            }
          }
        },
        {
          "title": "Validate Jenkinsfile syntax",
          "why": "Pipeline rerun mundu Jenkinsfile syntax valid ga undha ani validate chestam. Configuration mistake valla unnecessary build failure avoid avuthundi.",
          "software": "jenkins",
          "action": {
            "action": "validateJenkinsfile",
            "data": {
              "valid": true,
              "message": "Jenkinsfile syntax is valid"
            }
          }
        },
        {
          "title": "Open Build with Parameters",
          "why": "Corrected pipeline ni QA target tho explicit ga run cheyyadaniki Build with Parameters screen open chestam.",
          "software": "jenkins",
          "action": {
            "action": "openBuildWithParameters",
            "data": {
              "job": "java-practice-api"
            }
          }
        },
        {
          "title": "Start build #42 for QA",
          "why": "TARGET_ENV=qa tho new CI run start chestam. Jenkins build history lo #42 running build ga create avuthundi.",
          "software": "jenkins",
          "action": {
            "action": "buildWithParameters",
            "data": {
              "job": "java-practice-api",
              "number": 42,
              "status": "running",
              "progress": 12,
              "time": "Today, 14:05",
              "parameters": {
                "TARGET_ENV": "qa"
              },
              "stages": [
                {
                  "name": "Checkout",
                  "status": "running",
                  "duration": "",
                  "log": "Checking out main"
                },
                {
                  "name": "Build",
                  "status": "",
                  "duration": "",
                  "log": ""
                },
                {
                  "name": "Test",
                  "status": "",
                  "duration": "",
                  "log": ""
                },
                {
                  "name": "Package",
                  "status": "",
                  "duration": "",
                  "log": ""
                },
                {
                  "name": "Deploy QA",
                  "status": "",
                  "duration": "",
                  "log": ""
                }
              ]
            }
          }
        },
        {
          "title": "Follow Maven and test console output",
          "why": "Build execute avuthunnappudu developer console logs follow chesi Maven compile/test progress mariyu pipeline stage transitions ni observe chestadu.",
          "software": "jenkins",
          "action": {
            "action": "appendConsole",
            "data": {
              "job": "java-practice-api",
              "number": 42,
              "text": "[Pipeline] Build\\nmvn -B clean package -DskipTests\\nBUILD SUCCESS\\n[Pipeline] Test\\n42 unit tests passed\\nStudent API integration tests passed"
            }
          }
        },
        {
          "title": "Complete build #42 successfully",
          "why": "Unit mariyu integration tests pass ayyaka package archive mariyu QA deploy stages complete ayi Jenkins build SUCCESS avuthundi.",
          "software": "jenkins",
          "action": {
            "action": "setBuildStatus",
            "data": {
              "job": "java-practice-api",
              "number": 42,
              "status": "success",
              "progress": 100,
              "duration": "34 sec",
              "time": "Today, 14:05",
              "console": "Started by user developer\\nRunning on linux-java21-agent\\nCheckout completed\\nBUILD SUCCESS\\n42 unit tests passed\\nStudent API integration tests passed\\nArchived target/java-practice-1.0.0.jar\\nQA deployment completed\\nFinished: SUCCESS",
              "stages": [
                {
                  "name": "Checkout",
                  "status": "success",
                  "duration": "3s",
                  "log": "Checking out main\nCheckout completed."
                },
                {
                  "name": "Build",
                  "status": "success",
                  "duration": "13s",
                  "log": "mvn -B clean package -DskipTests\nBUILD SUCCESS"
                },
                {
                  "name": "Test",
                  "status": "success",
                  "duration": "11s",
                  "parallel": true,
                  "branches": [
                    {
                      "name": "Unit",
                      "status": "success",
                      "duration": "4s",
                      "log": "42 tests passed."
                    },
                    {
                      "name": "Integration",
                      "status": "success",
                      "duration": "11s",
                      "log": "Student API integration tests passed."
                    }
                  ],
                  "log": "All tests passed."
                },
                {
                  "name": "Package",
                  "status": "success",
                  "duration": "2s",
                  "log": "Archived target/java-practice-1.0.0.jar"
                },
                {
                  "name": "Deploy QA",
                  "status": "success",
                  "duration": "5s",
                  "log": "QA deployment completed."
                }
              ]
            }
          }
        },
        {
          "title": "Publish successful JUnit results",
          "why": "Jenkins build green ayina test evidence separate ga report avvali. JUnit totals and test status ni build record lo publish chestam.",
          "software": "jenkins",
          "action": {
            "action": "setTestResults",
            "data": {
              "job": "java-practice-api",
              "number": 42,
              "results": {
                "total": 43,
                "passed": 43,
                "failed": 0,
                "tests": [
                  {
                    "name": "getStudent_returns200",
                    "suite": "StudentApiIntegrationTest",
                    "status": "passed",
                    "duration": "0.31s"
                  },
                  {
                    "name": "studentModel_mapsFields",
                    "suite": "StudentServiceTest",
                    "status": "passed",
                    "duration": "0.02s"
                  }
                ]
              }
            }
          }
        },
        {
          "title": "Review successful test results",
          "why": "Build success badge matrame kakunda all 43 tests pass ayyaya ani Test Result view lo verify chestam.",
          "software": "jenkins",
          "action": {
            "action": "openTestResults",
            "data": {
              "job": "java-practice-api",
              "number": 42
            }
          }
        },
        {
          "title": "Archive the Java application artifact",
          "why": "Successful Maven package ni downstream deploy/release kosam Jenkins artifact ga preserve chestam.",
          "software": "jenkins",
          "action": {
            "action": "addArtifact",
            "data": {
              "job": "java-practice-api",
              "number": 42,
              "name": "target/java-practice-1.0.0.jar",
              "size": "18.4 MB",
              "description": "Java Practice application artifact"
            }
          }
        },
        {
          "title": "Inspect archived artifacts",
          "why": "Build output expected JAR create ayyindha ani Artifacts view lo verify chestam.",
          "software": "jenkins",
          "action": {
            "action": "openArtifacts",
            "data": {
              "job": "java-practice-api",
              "number": 42
            }
          }
        },
        {
          "title": "Inspect the source change attached to the job",
          "why": "CI result ni triggering code change tho correlate cheyyadaniki Jenkins Changes view lo JAVA-101 commit ni inspect chestam.",
          "software": "jenkins",
          "action": {
            "action": "openChanges",
            "data": {
              "job": "java-practice-api"
            }
          }
        },
        {
          "title": "Inspect the Jenkins workspace",
          "why": "Jenkins agent checkout lo Jenkinsfile, pom.xml mariyu Student source expected ga unnaya ani Workspace view lo verify chestam.",
          "software": "jenkins",
          "action": {
            "action": "openWorkspace",
            "data": {
              "job": "java-practice-api"
            }
          }
        },
        {
          "title": "Return to Student.java after CI succeeds",
          "why": "Jenkins pipeline green ayyaka developer malli IntelliJ ki return avuthadu. Code change nundi CI verification varaku developer journey continuity preserve avuthundi.",
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
      "title": "10: Power BI Desktop Feature-Rich Analytics Workflow",
      "steps": [
        {
          "title": "Open the Campus Performance Analytics PBIX",
          "why": "Blank report badulu already-developed campus dashboard ni open chesi realistic Power BI project madhyalo start chestam.",
          "software": "powerbi",
          "action": {
            "action": "openReport",
            "data": {
              "report": "Campus Performance Analytics"
            }
          }
        },
        {
          "title": "Inspect the populated Executive Overview page",
          "why": "Executive Overview lo KPI cards, department chart, attendance trend, slicer, donut mariyu matrix already populated unnayi.",
          "software": "powerbi",
          "action": {
            "action": "selectPage",
            "data": {
              "pageId": "page1"
            }
          }
        },
        {
          "title": "Open Get Data without destroying the report",
          "why": "Existing project lo new source add cheyyadam ela untundo Get Data surface ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openGetData",
            "data": {}
          }
        },
        {
          "title": "Select the SQL Server connector",
          "why": "Campus model source SQL Server kabatti connector selection state ni demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectConnector",
            "data": {
              "connector": "SQL Server"
            }
          }
        },
        {
          "title": "Inspect the existing JavaPracticeDb connection",
          "why": "Existing report source connection fields and Import mode ni realistic dialog lo inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "connectDataSource",
            "data": {
              "source": {
                "name": "JavaPracticeDb",
                "connector": "SQL Server"
              },
              "items": [
                {
                  "name": "Department"
                },
                {
                  "name": "Course"
                },
                {
                  "name": "Student"
                },
                {
                  "name": "Enrollment"
                },
                {
                  "name": "Attendance"
                },
                {
                  "name": "Calendar"
                }
              ]
            }
          }
        },
        {
          "title": "Open Navigator for the campus model",
          "why": "Navigator tree lo six source tables mariyu preview surface ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openNavigator",
            "data": {}
          }
        },
        {
          "title": "Preview the Student source table",
          "why": "Student table rows/columns Navigator preview lo ela kanipistayo chustam.",
          "software": "powerbi",
          "action": {
            "action": "previewNavigatorItem",
            "data": {
              "name": "Student"
            }
          }
        },
        {
          "title": "Close Navigator and keep the current model",
          "why": "Existing model ni disturb cheyyakunda Navigator close chestam.",
          "software": "powerbi",
          "action": {
            "action": "cancelNavigator",
            "data": {}
          }
        },
        {
          "title": "Inspect recent data sources",
          "why": "Power BI recent sources experience lo JavaPracticeDb source ni verify chestam.",
          "software": "powerbi",
          "action": {
            "action": "openRecentSources",
            "data": {}
          }
        },
        {
          "title": "Inspect data source settings",
          "why": "Credentials/source configuration entry point ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openDataSourceSettings",
            "data": {}
          }
        },
        {
          "title": "Return to Executive Overview",
          "why": "Populated dashboard canvas ki return ayi visual authoring features explore chestam.",
          "software": "powerbi",
          "action": {
            "action": "openReportView",
            "data": {}
          }
        },
        {
          "title": "Select the Average Score by Department chart",
          "why": "Visual select ayyaka resize handles, Visualizations pane mariyu formatting context active avuthayi.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "scoreByDept"
            }
          }
        },
        {
          "title": "Open the modern on-object Build visual menu",
          "why": "Selected chart meeda direct build/format affordance ni display chestam.",
          "software": "powerbi",
          "action": {
            "action": "openOnObjectBuild",
            "data": {
              "id": "scoreByDept"
            }
          }
        },
        {
          "title": "Open the Format visual surface",
          "why": "Selected chart formatting options ni Visualizations pane lo inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openFormatPane",
            "data": {
              "id": "scoreByDept"
            }
          }
        },
        {
          "title": "Show the selected visual as a data table",
          "why": "Chart underlying values ni table form lo inspect cheyyadam demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "showVisualTable",
            "data": {
              "id": "scoreByDept"
            }
          }
        },
        {
          "title": "Select the Semester slicer",
          "why": "Slicer visual ni select chesi report interactions demonstrate cheyyadaniki prepare chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "semesterSlicer"
            }
          }
        },
        {
          "title": "Filter the report to Spring 2026",
          "why": "Slicer selection cross-filter state ni set chestam.",
          "software": "powerbi",
          "action": {
            "action": "addSlicerSelection",
            "data": {
              "id": "semesterSlicer",
              "field": "Enrollment[semester]",
              "value": "Spring 2026"
            }
          }
        },
        {
          "title": "Apply a report-level 2026 filter",
          "why": "Filters pane lo report-level filtering concept ni demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "setReportFilter",
            "data": {
              "field": "Calendar[Year]",
              "value": "2026"
            }
          }
        },
        {
          "title": "Open the Selection pane",
          "why": "Canvas objects listing/visibility workflow ni Selection pane lo inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openSelectionPane",
            "data": {}
          }
        },
        {
          "title": "Create an Executive Snapshot bookmark",
          "why": "Current report state ni reusable bookmark ga store chestam.",
          "software": "powerbi",
          "action": {
            "action": "addBookmark",
            "data": {
              "id": "bmExecLive",
              "name": "Executive Snapshot - Live"
            }
          }
        },
        {
          "title": "Open the Bookmarks pane",
          "why": "Saved navigation/report states ni Bookmarks pane lo inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openBookmarksPane",
            "data": {}
          }
        },
        {
          "title": "Apply the Executive Snapshot bookmark",
          "why": "Stored report page/filter state ni restore chestam.",
          "software": "powerbi",
          "action": {
            "action": "applyBookmark",
            "data": {
              "id": "bmExecutive"
            }
          }
        },
        {
          "title": "Open the Student Performance page",
          "why": "Scatter chart, course comparison, student detail table mariyu risk slicer unna second report page ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectPage",
            "data": {
              "pageId": "page2"
            }
          }
        },
        {
          "title": "Select Average Score by Course",
          "why": "Course comparison visual ni select chesi visual-type and field-well operations demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "courseScores"
            }
          }
        },
        {
          "title": "Change the course chart to clustered bar",
          "why": "Same data ni different visual encoding lo show cheyyadam demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "setVisualType",
            "data": {
              "id": "courseScores",
              "type": "clusteredBar"
            }
          }
        },
        {
          "title": "Add course name to the axis field well",
          "why": "Visual field well binding ni explicitly add chestam.",
          "software": "powerbi",
          "action": {
            "action": "addFieldToWell",
            "data": {
              "id": "courseScores",
              "well": "x",
              "field": "Course[course_name]"
            }
          }
        },
        {
          "title": "Add Average Score to the values field well",
          "why": "Measure ni values well ki bind chesi visual construction pattern demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "addFieldToWell",
            "data": {
              "id": "courseScores",
              "well": "values",
              "field": "Measures[Average Score]"
            }
          }
        },
        {
          "title": "Apply conditional formatting to course scores",
          "why": "Data-driven formatting state ni selected visual meeda apply chestam.",
          "software": "powerbi",
          "action": {
            "action": "setConditionalFormatting",
            "data": {
              "id": "courseScores",
              "field": "Measures[Average Score]",
              "rule": "color scale"
            }
          }
        },
        {
          "title": "Add a report tooltip to the course chart",
          "why": "Hover context kosam tooltip field ni selected visual ki attach chestam.",
          "software": "powerbi",
          "action": {
            "action": "setVisualTooltip",
            "data": {
              "id": "courseScores",
              "fields": [
                "Course[course_name]",
                "Measures[Average Score]"
              ]
            }
          }
        },
        {
          "title": "Configure slicer-to-table interaction",
          "why": "Risk Status slicer Student Detail table ni filter cheyyela visual interaction set chestam.",
          "software": "powerbi",
          "action": {
            "action": "setInteraction",
            "data": {
              "source": "riskSlicer",
              "target": "studentTable",
              "mode": "filter"
            }
          }
        },
        {
          "title": "Drill down on course performance",
          "why": "Hierarchy-enabled visual navigation lo next detail level ki drill chestam.",
          "software": "powerbi",
          "action": {
            "action": "drillDown",
            "data": {
              "id": "courseScores"
            }
          }
        },
        {
          "title": "Drill back up",
          "why": "Previous hierarchy level ki return avutham.",
          "software": "powerbi",
          "action": {
            "action": "drillUp",
            "data": {
              "id": "courseScores"
            }
          }
        },
        {
          "title": "Add a trend line to Score vs Attendance",
          "why": "Scatter visual analytics pane concept ni trend line tho demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "addTrendLine",
            "data": {
              "id": "scoreScatter"
            }
          }
        },
        {
          "title": "Inspect the Analytics pane",
          "why": "Trend/forecast/constant-line tools ekkada untayo pane surface ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openAnalyticsPane",
            "data": {
              "id": "scoreScatter"
            }
          }
        },
        {
          "title": "Open the Visual Gallery page",
          "why": "Common Power BI chart/table/slicer/AI visual types one page lo side-by-side inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectPage",
            "data": {
              "pageId": "page4"
            }
          }
        },
        {
          "title": "Select the donut visual",
          "why": "Part-to-whole chart selection and context ni demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "g3"
            }
          }
        },
        {
          "title": "Select the scatter visual",
          "why": "Relationship/distribution visual type ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "g4"
            }
          }
        },
        {
          "title": "Select the funnel visual",
          "why": "Stage-conversion style visualization ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "g5"
            }
          }
        },
        {
          "title": "Select the gauge visual",
          "why": "Target/progress visualization ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "g6"
            }
          }
        },
        {
          "title": "Select the table visual",
          "why": "Tabular detail visual ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "g9"
            }
          }
        },
        {
          "title": "Select the matrix visual",
          "why": "Pivot-style matrix visual ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "g10"
            }
          }
        },
        {
          "title": "Select the decomposition tree",
          "why": "AI-assisted decomposition visual surface ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "g11"
            }
          }
        },
        {
          "title": "Select Key Influencers",
          "why": "AI explanatory visual surface ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectVisual",
            "data": {
              "id": "g12"
            }
          }
        },
        {
          "title": "Open Table view for Student",
          "why": "Semantic model lo raw Student rows/columns ni Table view lo inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openDataView",
            "data": {
              "table": "Student"
            }
          }
        },
        {
          "title": "Sort Student Name ascending",
          "why": "Table view grid lo column sorting behavior ni demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "sortDataColumn",
            "data": {
              "table": "Student",
              "column": "Student Name",
              "direction": "asc"
            }
          }
        },
        {
          "title": "Filter to At Risk students",
          "why": "Table view column filtering state ni risk_status meeda apply chestam.",
          "software": "powerbi",
          "action": {
            "action": "filterDataColumn",
            "data": {
              "table": "Student",
              "column": "risk_status",
              "value": "At Risk"
            }
          }
        },
        {
          "title": "Mark City as a geographic category",
          "why": "Field metadata lo City data category ni set chestam.",
          "software": "powerbi",
          "action": {
            "action": "setDataCategory",
            "data": {
              "table": "Student",
              "column": "city",
              "value": "City"
            }
          }
        },
        {
          "title": "Inspect Enrollment data",
          "why": "Fact-style Enrollment table grid ni Table view lo switch chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectDataTable",
            "data": {
              "table": "Enrollment"
            }
          }
        },
        {
          "title": "Set Score default summarization to Average",
          "why": "Numeric score field reporting default ni Sum badulu Average ga set chestam.",
          "software": "powerbi",
          "action": {
            "action": "setSummarization",
            "data": {
              "table": "Enrollment",
              "column": "score",
              "value": "Average"
            }
          }
        },
        {
          "title": "Open Model view with all six tables",
          "why": "Department, Course, Student, Enrollment, Attendance, Calendar relationship diagram ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openModelView",
            "data": {}
          }
        },
        {
          "title": "Open Manage Relationships",
          "why": "Five active one-to-many relationships list/dialog ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openManageRelationships",
            "data": {}
          }
        },
        {
          "title": "Create a Course hierarchy",
          "why": "Department-to-course drill hierarchy ni semantic model lo create chestam.",
          "software": "powerbi",
          "action": {
            "action": "createHierarchy",
            "data": {
              "id": "courseHierarchy2",
              "name": "Department > Course",
              "table": "Course",
              "levels": [
                "department_id",
                "course_name"
              ]
            }
          }
        },
        {
          "title": "Mark Calendar as the date table",
          "why": "Time intelligence kosam Calendar semantic role ni explicitly mark chestam.",
          "software": "powerbi",
          "action": {
            "action": "markDateTable",
            "data": {
              "table": "Calendar",
              "value": true
            }
          }
        },
        {
          "title": "Hide Student gender from report authors",
          "why": "Model field visibility setting ni demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "hideField",
            "data": {
              "table": "Student",
              "field": "gender",
              "value": true
            }
          }
        },
        {
          "title": "Confirm Import storage mode",
          "why": "Table storage mode behavior ni semantic model lo inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "setTableStorageMode",
            "data": {
              "table": "Enrollment",
              "mode": "Import"
            }
          }
        },
        {
          "title": "Create a Pass Rate DAX measure",
          "why": "Modeling workflow lo reusable measure ni create chestam.",
          "software": "powerbi",
          "action": {
            "action": "createMeasure",
            "data": {
              "id": "m_pass_rate",
              "name": "Pass Rate",
              "table": "Measures",
              "dax": "DIVIDE(CALCULATE(COUNTROWS(Enrollment), Enrollment[score] >= 70), COUNTROWS(Enrollment))",
              "format": "0.0%"
            }
          }
        },
        {
          "title": "Format Pass Rate as a percentage",
          "why": "Measure display formatting ni percentage style ki set chestam.",
          "software": "powerbi",
          "action": {
            "action": "formatMeasure",
            "data": {
              "name": "Pass Rate",
              "format": "0.0%"
            }
          }
        },
        {
          "title": "Open DAX Query View",
          "why": "Semantic model meeda DAX query authoring surface, Model explorer mariyu Results pane ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openDaxQueryView",
            "data": {}
          }
        },
        {
          "title": "Create a new DAX query tab",
          "why": "Multiple DAX query tabs workflow ni demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "newDaxQuery",
            "data": {
              "id": "dax2",
              "name": "At Risk Analysis"
            }
          }
        },
        {
          "title": "Type an At Risk DAX query",
          "why": "EVALUATE + SUMMARIZECOLUMNS query ni editor lo type chestam.",
          "software": "powerbi",
          "action": {
            "action": "typeDaxQuery",
            "data": {
              "text": "EVALUATE\nSUMMARIZECOLUMNS(\n    Student[risk_status],\n    \"Students\", [Total Students],\n    \"Average Score\", [Average Score]\n)"
            }
          }
        },
        {
          "title": "Run the DAX query",
          "why": "Query results grid lo risk status summary rows ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "runDaxQuery",
            "data": {
              "results": [
                [
                  "Risk Status",
                  "Students",
                  "Average Score"
                ],
                [
                  "At Risk",
                  2,
                  "76.0"
                ],
                [
                  "On Track",
                  4,
                  "88.0"
                ],
                [
                  "High Performer",
                  2,
                  "96.0"
                ]
              ]
            }
          }
        },
        {
          "title": "Open TMDL View",
          "why": "Semantic model metadata ni code-first TMDL editor lo inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openTmdlView",
            "data": {}
          }
        },
        {
          "title": "Script the Enrollment table to TMDL",
          "why": "Fact table metadata/measure definition ni TMDL script ga generate chestam.",
          "software": "powerbi",
          "action": {
            "action": "scriptTmdlObject",
            "data": {
              "table": "Enrollment"
            }
          }
        },
        {
          "title": "Preview TMDL changes",
          "why": "Apply cheyyaka mundu semantic model changes validation/preview workflow ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "previewTmdl",
            "data": {
              "text": "Preview ready: Enrollment model changes validated with 0 errors."
            }
          }
        },
        {
          "title": "Apply the TMDL script",
          "why": "Validated TMDL metadata changes ni semantic model ki apply chestam.",
          "software": "powerbi",
          "action": {
            "action": "applyTmdl",
            "data": {}
          }
        },
        {
          "title": "Open Power Query Editor with existing queries",
          "why": "Six existing queries, preview grid, formula bar mariyu Applied Steps unna real transformation workspace ni open chestam.",
          "software": "powerbi",
          "action": {
            "action": "openPowerQuery",
            "data": {
              "query": "Enrollment"
            }
          }
        },
        {
          "title": "Select the Enrollment query",
          "why": "Fact query transformation history and preview ni focus chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectQuery",
            "data": {
              "query": "Enrollment"
            }
          }
        },
        {
          "title": "Show column quality indicators",
          "why": "Valid/error/empty data quality diagnostics ni query preview context lo enable chestam.",
          "software": "powerbi",
          "action": {
            "action": "toggleColumnQuality",
            "data": {
              "value": true
            }
          }
        },
        {
          "title": "Show column distribution",
          "why": "Distinct/value distribution profiling surface ni enable chestam.",
          "software": "powerbi",
          "action": {
            "action": "toggleColumnDistribution",
            "data": {
              "value": true
            }
          }
        },
        {
          "title": "Profile the Score column",
          "why": "Score field distinct/unique/error statistics ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "profileColumn",
            "data": {
              "query": "Enrollment",
              "column": "score",
              "distinct": 10,
              "unique": 8,
              "empty": 0,
              "error": 0
            }
          }
        },
        {
          "title": "Add a Performance Group conditional column",
          "why": "Power Query Add Column workflow lo score-based classification ni add chestam.",
          "software": "powerbi",
          "action": {
            "action": "addConditionalColumn",
            "data": {
              "query": "Enrollment",
              "name": "Performance Group",
              "condition": {
                "column": "score",
                "operator": ">=",
                "value": 90,
                "then": "Excellent",
                "else": "Standard"
              }
            }
          }
        },
        {
          "title": "Group enrollment rows by semester",
          "why": "Power Query Group By transformation ni fact dataset meeda demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "groupBy",
            "data": {
              "query": "Enrollment",
              "columns": [
                "semester"
              ],
              "aggregation": "Count Rows"
            }
          }
        },
        {
          "title": "Close and Apply the query work",
          "why": "Power Query changes ni semantic model ki commit chesi report authoring environment ki return avutham.",
          "software": "powerbi",
          "action": {
            "action": "closeAndApply",
            "data": {}
          }
        },
        {
          "title": "Return to Executive Overview after modeling",
          "why": "Transformed/modelled data tho populated dashboard ni malli inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectPage",
            "data": {
              "pageId": "page1"
            }
          }
        },
        {
          "title": "Open Performance Analyzer",
          "why": "Report visual render timings inspect cheyyadaniki Optimize workflow ni open chestam.",
          "software": "powerbi",
          "action": {
            "action": "openPerformanceAnalyzer",
            "data": {}
          }
        },
        {
          "title": "Start performance recording",
          "why": "Visual query/render timing capture ni start chestam.",
          "software": "powerbi",
          "action": {
            "action": "startPerformanceRecording",
            "data": {}
          }
        },
        {
          "title": "Refresh all dashboard visuals",
          "why": "Recording active unna appudu visuals ni refresh chesi timing events collect chestam.",
          "software": "powerbi",
          "action": {
            "action": "refreshVisuals",
            "data": {
              "durationBase": 31
            }
          }
        },
        {
          "title": "Stop performance recording",
          "why": "Captured timing results ni freeze chestam.",
          "software": "powerbi",
          "action": {
            "action": "stopPerformanceRecording",
            "data": {}
          }
        },
        {
          "title": "Copy a visual DAX query",
          "why": "Performance Analyzer nundi underlying DAX query copy workflow ni demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "copyPerformanceQuery",
            "data": {
              "query": "EVALUATE SUMMARIZECOLUMNS(Course[course_name], \"Average Score\", [Average Score])"
            }
          }
        },
        {
          "title": "Open Mobile layout",
          "why": "Phone-specific report layout authoring surface ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openMobileLayout",
            "data": {}
          }
        },
        {
          "title": "Position the Total Students KPI for mobile",
          "why": "Desktop visual ni mobile canvas position list lo place chestam.",
          "software": "powerbi",
          "action": {
            "action": "setMobileVisualPosition",
            "data": {
              "id": "kpiStudents",
              "x": 0,
              "y": 0,
              "w": 320,
              "h": 100
            }
          }
        },
        {
          "title": "Publish the Campus Performance report",
          "why": "Desktop nundi Power BI Service publish workflow ni start chestam.",
          "software": "powerbi",
          "action": {
            "action": "publishReport",
            "data": {}
          }
        },
        {
          "title": "Choose the Campus Analytics workspace",
          "why": "Report destination workspace ni select chestam.",
          "software": "powerbi",
          "action": {
            "action": "selectWorkspace",
            "data": {
              "workspace": "Campus Analytics"
            }
          }
        },
        {
          "title": "Complete publishing",
          "why": "PBIX/report semantic model publication success state ni demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "completePublish",
            "data": {}
          }
        },
        {
          "title": "Open the published report in Power BI Service",
          "why": "Published artifact service-side view ni inspect chestam.",
          "software": "powerbi",
          "action": {
            "action": "openPowerBIService",
            "data": {}
          }
        },
        {
          "title": "Export the report as PDF",
          "why": "Report export workflow ni PDF format tho demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "exportReport",
            "data": {
              "format": "PDF"
            }
          }
        },
        {
          "title": "Share the report to Microsoft Teams",
          "why": "Collaboration/share workflow ni Teams destination tho demonstrate chestam.",
          "software": "powerbi",
          "action": {
            "action": "shareReport",
            "data": {
              "channel": "Microsoft Teams"
            }
          }
        },
        {
          "title": "Return to the full Executive Overview dashboard",
          "why": "Feature tour end lo populated Power BI report canvas ki return ayi complete project state ni leave chestam.",
          "software": "powerbi",
          "action": {
            "action": "openReportView",
            "data": {}
          }
        }
      ]
    },
    {
      "title": "11: Git, GitHub & GitHub Actions Workflow",
      "subtitle": "Verify the integrated source-control and CI simulators in one realistic Java developer flow.",
      "steps": [
        {
          "title": "Open the Java Practice repository in Git",
          "why": "Developer local repository ni Git lo open chestadu. Working tree, current branch, remotes, staged changes mariyu commit history ikkada manage chestam.",
          "software": "git",
          "action": {
            "action": "openRepository",
            "data": {
              "name": "Java-Practice",
              "path": "C:\\Users\\developer\\Java-Practice",
              "branch": "main"
            }
          }
        },
        {
          "title": "Review the Student.java diff",
          "why": "Commit cheyyadaniki mundu exact source changes ni diff lo review chestam. Added and removed lines ni verify chesi accidental changes avoid chestam.",
          "software": "git",
          "action": {
            "action": "showDiff",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Stage Student.java for commit",
          "why": "Reviewed file ni staging area ki move chestam. Git lo commit ki include kavalsina exact changes ni staging separate chestundi.",
          "software": "git",
          "action": {
            "action": "stageFile",
            "data": {
              "path": "src/Student.java"
            }
          }
        },
        {
          "title": "Inspect local Git commit history",
          "why": "Local repository history lo previous commits, hashes, branches mariyu project progression ni verify chestam.",
          "software": "git",
          "action": {
            "action": "openHistory",
            "data": {}
          }
        },
        {
          "title": "Open the Java Practice repository on GitHub",
          "why": "Local Git work remote collaboration ki GitHub lo kanipistundi. Repository files, branches, commits, issues, pull requests mariyu settings remote side lo manage chestam.",
          "software": "github",
          "action": {
            "action": "openRepository",
            "data": {
              "name": "Java-Practice"
            }
          }
        },
        {
          "title": "Review pull request number 2",
          "why": "Feature branch ni main branch tho merge cheyyadaniki mundu pull request lo discussion, checks, reviewers mariyu changed files ni inspect chestam.",
          "software": "github",
          "action": {
            "action": "openPullRequest",
            "data": {
              "number": 2
            }
          }
        },
        {
          "title": "Inspect repository security",
          "why": "GitHub Security area lo dependency alerts, code scanning, secret scanning mariyu repository security posture ni review cheyyachu.",
          "software": "github",
          "action": {
            "action": "openSecurity",
            "data": {}
          }
        },
        {
          "title": "Open GitHub Actions",
          "why": "Repository automation ni GitHub Actions lo inspect chestam. Workflow YAML, triggers, jobs, runners, secrets, caches mariyu environments ikkada manage chestam.",
          "software": "github_actions",
          "action": {
            "action": "openActions",
            "data": {}
          }
        },
        {
          "title": "Inspect successful Java CI run 42",
          "why": "CI run lo jobs and individual steps expand chesi checkout, Java setup, Maven verification, logs, annotations mariyu artifacts successful ga complete ayyayo verify chestam.",
          "software": "github_actions",
          "action": {
            "action": "openRun",
            "data": {
              "id": "42"
            }
          }
        },
        {
          "title": "Inspect GitHub Actions secrets and variables",
          "why": "CI/CD credentials ni source code lo hard-code cheyyakunda repository secrets use chestam. Non-sensitive configuration values kosam Actions variables separate ga maintain chestam.",
          "software": "github_actions",
          "action": {
            "action": "openSecrets",
            "data": {}
          }
        }
      ]
    },
    {
      "title": "12: MySQL Workbench SQL Development & Database Engineering",
      "steps": [
        {
          "title": "Open the MySQL Workbench Home screen",
          "why": "Saved connections, Models mariyu Migration launch areas ekkada untayo Home lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showHome",
            "data": {}
          }
        },
        {
          "title": "Inspect the Local instance MySQL80 connection",
          "why": "Existing localhost connection card ni realistic Workbench Home lo identify chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "highlight",
            "data": {
              "target": {
                "type": "connection",
                "id": "local-mysql"
              }
            }
          }
        },
        {
          "title": "Open the full connection setup dialog",
          "why": "Parameters, SSL, Advanced, Remote Management, System Profile tabs unna real connection editor ni open chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openConnectionDialog",
            "data": {}
          }
        },
        {
          "title": "Inspect Standard TCP/IP connection parameters",
          "why": "Hostname, port, user, default schema mariyu connection method fields ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openConnectionParameters",
            "data": {}
          }
        },
        {
          "title": "Inspect SSL connection settings",
          "why": "Workbench SSL tab lo certificates mariyu SSL mode options ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openConnectionSsl",
            "data": {}
          }
        },
        {
          "title": "Inspect Advanced connection settings",
          "why": "Timeout, SQL mode mariyu extra connector parameters ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openConnectionAdvanced",
            "data": {}
          }
        },
        {
          "title": "Connect to Local instance MySQL80",
          "why": "Saved connection nundi java_practice schema ki active SQL development session start chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "connect",
            "data": {
              "id": "local-mysql"
            }
          }
        },
        {
          "title": "Open a new SQL query tab",
          "why": "Multiple SQL editor tabs workflow ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openSQLTab",
            "data": {
              "id": "sql-demo",
              "title": "analysis_demo.sql"
            }
          }
        },
        {
          "title": "Type a student performance query",
          "why": "Workbench SQL editor lo join query type chesi schema objects use chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "typeSql",
            "data": {
              "queryId": "sql-demo",
              "sql": "SELECT\n    s.student_name,\n    c.course_name,\n    e.score,\n    e.grade\nFROM student s\nJOIN enrollment e ON e.student_id = s.student_id\nJOIN course c ON c.course_id = e.course_id\nWHERE e.score >= 80\nORDER BY e.score DESC;"
            }
          }
        },
        {
          "title": "Open SQL code completion",
          "why": "Table/column suggestions popup ela kanipistundo SQL editor lo demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showAutocomplete",
            "data": {
              "items": [
                "student",
                "student_name",
                "course",
                "course_name",
                "enrollment",
                "score",
                "grade"
              ],
              "selected": 1
            }
          }
        },
        {
          "title": "Execute the current statement",
          "why": "Current query ni Workbench lightning action tho run chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "executeCurrent",
            "data": {
              "sql": "SELECT student performance...",
              "response": "5 row(s) returned",
              "duration": "0.014 sec",
              "result": {
                "id": "r-demo",
                "title": "Result Grid",
                "columns": [
                  "student_name",
                  "course_name",
                  "score",
                  "grade"
                ],
                "rows": [
                  {
                    "student_name": "Maya Chen",
                    "course_name": "Java Programming",
                    "score": 97,
                    "grade": "A"
                  },
                  {
                    "student_name": "Asha Patel",
                    "course_name": "Java Programming",
                    "score": 94,
                    "grade": "A"
                  },
                  {
                    "student_name": "Sofia Garcia",
                    "course_name": "Data Visualization",
                    "score": 95,
                    "grade": "A"
                  },
                  {
                    "student_name": "Isha Rao",
                    "course_name": "GIS Applications",
                    "score": 90,
                    "grade": "A"
                  },
                  {
                    "student_name": "Noah Williams",
                    "course_name": "Database Systems",
                    "score": 86,
                    "grade": "B"
                  }
                ],
                "editable": true
              }
            }
          }
        },
        {
          "title": "Pin the result grid",
          "why": "Multiple query runs madhya important result set ni pin chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "pinResult",
            "data": {
              "id": "r-demo",
              "pinned": true
            }
          }
        },
        {
          "title": "Sort the result grid by score",
          "why": "Result grid client-side sorting behavior ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "sortResult",
            "data": {
              "column": "score",
              "direction": "desc"
            }
          }
        },
        {
          "title": "Filter the result grid for Java",
          "why": "Result set filtering control ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "filterResult",
            "data": {
              "text": "Java"
            }
          }
        },
        {
          "title": "Edit a result cell",
          "why": "Editable result grid lo value modification state ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "editCell",
            "data": {
              "id": "r-demo",
              "row": 0,
              "column": "grade",
              "value": "A+"
            }
          }
        },
        {
          "title": "Apply result-grid changes",
          "why": "Workbench Apply workflow tho editable result changes commit path lo place chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "applyGridChanges",
            "data": {}
          }
        },
        {
          "title": "Show Action Output",
          "why": "Executed statements, response mariyu duration history ni Action Output lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "setBottomTab",
            "data": {
              "tab": "output"
            }
          }
        },
        {
          "title": "Open Text Output",
          "why": "Action/query messages ni plain text output surface lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showTextOutput",
            "data": {}
          }
        },
        {
          "title": "Open SQL History",
          "why": "Previous statements/history workflow ni dedicated history surface lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showHistoryOutput",
            "data": {}
          }
        },
        {
          "title": "Generate EXPLAIN output",
          "why": "Optimizer access type, key mariyu estimated rows ni tabular EXPLAIN lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "explainQuery",
            "data": {}
          }
        },
        {
          "title": "Open Visual EXPLAIN",
          "why": "Execution plan ni graphical Workbench surface lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showVisualExplain",
            "data": {}
          }
        },
        {
          "title": "Inspect query statistics",
          "why": "Duration, rows examined mariyu temp/sort information ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showQueryStatistics",
            "data": {}
          }
        },
        {
          "title": "Open query profiler",
          "why": "Statement execution stages and percentages ni profiler surface lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showQueryProfiler",
            "data": {}
          }
        },
        {
          "title": "Save the query as a snippet",
          "why": "Reusable SQL snippet library workflow ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "saveSnippet",
            "data": {
              "id": "sn-demo",
              "name": "High Performing Students",
              "sql": "SELECT * FROM enrollment WHERE score >= 90 ORDER BY score DESC;"
            }
          }
        },
        {
          "title": "Open the Snippets sidebar",
          "why": "Saved snippets ni right sidebar lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showSnippets",
            "data": {}
          }
        },
        {
          "title": "Return to SQL Context Help",
          "why": "Keyword-specific SQL help pane ni restore chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showContextHelp",
            "data": {}
          }
        },
        {
          "title": "Start an explicit transaction",
          "why": "Auto-commit outside controlled transaction workflow ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "startTransaction",
            "data": {}
          }
        },
        {
          "title": "Create a transaction savepoint",
          "why": "Partial rollback point ni Workbench session lo create chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "createSavepoint",
            "data": {
              "name": "before_update"
            }
          }
        },
        {
          "title": "Execute an UPDATE inside the transaction",
          "why": "Student risk status update ni staged transaction lo execute chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "executeCurrent",
            "data": {
              "sql": "UPDATE student SET risk_status='On Track' WHERE student_id=2;",
              "affectedRows": 1
            }
          }
        },
        {
          "title": "Rollback to the savepoint",
          "why": "Transaction lo later changes matrame rollback cheyyadam demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "rollbackToSavepoint",
            "data": {
              "name": "before_update"
            }
          }
        },
        {
          "title": "Commit the transaction",
          "why": "Remaining staged changes ni database ki commit chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "commit",
            "data": {}
          }
        },
        {
          "title": "Inspect the java_practice schema tree",
          "why": "Navigator lo tables, views, procedures, functions mariyu events structure ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showSchemas",
            "data": {}
          }
        },
        {
          "title": "Select the student table",
          "why": "Navigator lo student object ni select chesi Info/DDL context activate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "selectObject",
            "data": {
              "path": "schemas/java_practice/tables/student"
            }
          }
        },
        {
          "title": "Open the student table context menu",
          "why": "Select Rows, Alter Table, Export, SQL generation, Drop actions unna object menu ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openObjectContext",
            "data": {
              "path": "schemas/java_practice/tables/student"
            }
          }
        },
        {
          "title": "Open Table Inspector",
          "why": "Rows, engine, indexes mariyu storage information ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openTableInspector",
            "data": {
              "path": "schemas/java_practice/tables/student",
              "rows": 8,
              "dataLength": "16 KiB",
              "indexLength": "16 KiB"
            }
          }
        },
        {
          "title": "Open the native Table Editor Columns tab",
          "why": "Real Workbench-style table editor lo column datatypes/PK/NN/AI/default properties ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openTableEditor",
            "data": {
              "path": "schemas/java_practice/tables/student",
              "tab": "Columns"
            }
          }
        },
        {
          "title": "Open the Table Editor Indexes tab",
          "why": "PRIMARY and secondary indexes configuration surface ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openTableEditorTab",
            "data": {
              "path": "schemas/java_practice/tables/student",
              "tab": "Indexes"
            }
          }
        },
        {
          "title": "Open the Table Editor Foreign Keys tab",
          "why": "Referenced table/column mariyu update/delete rules ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openTableEditorTab",
            "data": {
              "path": "schemas/java_practice/tables/enrollment",
              "tab": "Foreign Keys"
            }
          }
        },
        {
          "title": "Open the Table Editor Triggers tab",
          "why": "Table trigger editor/source area ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openTableEditorTab",
            "data": {
              "path": "schemas/java_practice/tables/student",
              "tab": "Triggers"
            }
          }
        },
        {
          "title": "Open Partitioning options",
          "why": "RANGE/HASH/LIST partition design controls ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openTableEditorTab",
            "data": {
              "path": "schemas/java_practice/tables/enrollment",
              "tab": "Partitioning"
            }
          }
        },
        {
          "title": "Open Table Options",
          "why": "Engine, charset, collation, row format mariyu comments ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openTableEditorTab",
            "data": {
              "path": "schemas/java_practice/tables/student",
              "tab": "Options"
            }
          }
        },
        {
          "title": "Inspect the student object DDL",
          "why": "Workbench object DDL view lo CREATE TABLE script ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showObjectDDL",
            "data": {
              "path": "schemas/java_practice/tables/student"
            }
          }
        },
        {
          "title": "Generate SELECT SQL from the student table",
          "why": "Navigator object nundi SELECT statement generate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "generateSql",
            "data": {
              "path": "schemas/java_practice/tables/student",
              "kind": "select",
              "run": false
            }
          }
        },
        {
          "title": "Show student table data",
          "why": "Select Rows-style result grid lo current table rows ni display chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showTableData",
            "data": {
              "title": "student — Select Rows - Limit 1000",
              "columns": [
                "student_id",
                "student_name",
                "email",
                "city",
                "risk_status"
              ],
              "rows": [
                {
                  "student_id": 1,
                  "student_name": "Asha Patel",
                  "email": "asha@example.edu",
                  "city": "Austin",
                  "admission_year": 2024,
                  "risk_status": "On Track"
                },
                {
                  "student_id": 2,
                  "student_name": "Ravi Kumar",
                  "email": "ravi@example.edu",
                  "city": "Round Rock",
                  "admission_year": 2024,
                  "risk_status": "At Risk"
                },
                {
                  "student_id": 3,
                  "student_name": "Maya Chen",
                  "email": "maya@example.edu",
                  "city": "Cedar Park",
                  "admission_year": 2025,
                  "risk_status": "High Performer"
                },
                {
                  "student_id": 4,
                  "student_name": "Noah Williams",
                  "email": "noah@example.edu",
                  "city": "Leander",
                  "admission_year": 2025,
                  "risk_status": "On Track"
                },
                {
                  "student_id": 5,
                  "student_name": "Sofia Garcia",
                  "email": "sofia@example.edu",
                  "city": "Austin",
                  "admission_year": 2024,
                  "risk_status": "High Performer"
                }
              ],
              "editable": true
            }
          }
        },
        {
          "title": "Open the Table Data Import Wizard",
          "why": "CSV source, destination schema/table mariyu mapping steps unna wizard ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openImportWizard",
            "data": {
              "file": "C:\\data\\new_students.csv",
              "schema": "java_practice",
              "table": "student"
            }
          }
        },
        {
          "title": "Run the import",
          "why": "Educational import execution state ni Action Output lo record chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "importData",
            "data": {
              "file": "C:\\data\\new_students.csv",
              "table": "student",
              "rows": 25
            }
          }
        },
        {
          "title": "Open the Table Data Export Wizard",
          "why": "Result/table export source, output file and format settings ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openExportWizard",
            "data": {
              "table": "student",
              "file": "C:\\data\\students_export.csv"
            }
          }
        },
        {
          "title": "Run the export",
          "why": "CSV export completion state ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "exportData",
            "data": {
              "file": "C:\\data\\students_export.csv",
              "rows": 8
            }
          }
        },
        {
          "title": "Open Server Status",
          "why": "Server state, uptime, threads, directories mariyu enabled features ni administration surface lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openServerStatus",
            "data": {}
          }
        },
        {
          "title": "Open Client Connections",
          "why": "Active MySQL sessions, users, databases mariyu commands ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openClientConnections",
            "data": {}
          }
        },
        {
          "title": "Open Users and Privileges",
          "why": "Accounts, login, roles, schema privileges mariyu account limits surface ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openUsersPrivileges",
            "data": {}
          }
        },
        {
          "title": "Inspect Server Variables",
          "why": "sql_mode, isolation, autocommit mariyu server settings ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showServerVariables",
            "data": {}
          }
        },
        {
          "title": "Inspect Server Logs",
          "why": "Workbench server log viewer lo messages ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showServerLogs",
            "data": {}
          }
        },
        {
          "title": "Open Startup / Shutdown",
          "why": "MySQL Windows service control and startup log surface ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openServiceControl",
            "data": {}
          }
        },
        {
          "title": "Open the Options File editor",
          "why": "my.ini networking/security/InnoDB options editor ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openOptionsFile",
            "data": {}
          }
        },
        {
          "title": "Open Performance Dashboard",
          "why": "Network, MySQL, InnoDB graphs/gauges mariyu live metrics ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openPerformanceDashboard",
            "data": {}
          }
        },
        {
          "title": "Open Performance Reports",
          "why": "High Cost SQL and schema/wait reports browser ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openPerformanceReports",
            "data": {}
          }
        },
        {
          "title": "Open Performance Schema metrics",
          "why": "Performance Schema-based instrumentation surface ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openPerformanceSchema",
            "data": {}
          }
        },
        {
          "title": "Inspect InnoDB Status",
          "why": "Buffer pool/history diagnostic text ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showInnoDBStatus",
            "data": {}
          }
        },
        {
          "title": "Open the Campus Analytics EER model",
          "why": "Five-table model diagram, catalog palette and relationships ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openModel",
            "data": {
              "name": "Campus Analytics Model"
            }
          }
        },
        {
          "title": "Create/open the EER Diagram canvas",
          "why": "Workbench data-modeling canvas toolbar and table cards ni display chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "createEERDiagram",
            "data": {
              "name": "Campus Analytics Model"
            }
          }
        },
        {
          "title": "Zoom the EER model to 125 percent",
          "why": "Large schema diagrams lo zoom behavior ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "setModelZoom",
            "data": {
              "zoom": 125
            }
          }
        },
        {
          "title": "Open the Model Navigator/Catalog",
          "why": "Tables and model object palette ni side surface lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openModelNavigator",
            "data": {}
          }
        },
        {
          "title": "Reverse engineer the live schema",
          "why": "java_practice database metadata nundi EER tables/relationships reconstruct cheyyadam demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "reverseEngineer",
            "data": {
              "name": "Reverse Engineered java_practice"
            }
          }
        },
        {
          "title": "Forward engineer the model",
          "why": "EER model nundi CREATE SQL generation workflow ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "forwardEngineer",
            "data": {
              "script": "Generated CREATE TABLE statements for 5 tables"
            }
          }
        },
        {
          "title": "Synchronize model with the database",
          "why": "Model vs live database difference comparison/apply flow ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "synchronizeModel",
            "data": {
              "changes": "1 column difference"
            }
          }
        },
        {
          "title": "Compare schemas",
          "why": "Model/database object differences ni comparison grid lo inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "compareSchemas",
            "data": {
              "differences": [
                {
                  "object": "student.updated_at",
                  "source": "Campus Analytics Model",
                  "target": "java_practice",
                  "difference": "Default value differs"
                }
              ]
            }
          }
        },
        {
          "title": "Open the Migration Wizard",
          "why": "Source-to-MySQL migration multi-step Workbench wizard ni open chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openMigrationWizard",
            "data": {
              "objects": 24
            }
          }
        },
        {
          "title": "Configure the migration source",
          "why": "SQL Server source DBMS/host configuration step ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "configureMigrationSource",
            "data": {
              "source": {
                "dbms": "Microsoft SQL Server",
                "host": "legacy-campus-db"
              }
            }
          }
        },
        {
          "title": "Configure the migration target",
          "why": "Target MySQL localhost connection ni configure chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "configureMigrationTarget",
            "data": {
              "target": {
                "dbms": "MySQL",
                "host": "localhost:3306"
              }
            }
          }
        },
        {
          "title": "Run schema and data migration",
          "why": "Object/data migration summary and final report state ni demonstrate chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "runMigration",
            "data": {
              "objects": 24,
              "step": 7,
              "status": "Migration completed successfully"
            }
          }
        },
        {
          "title": "Open Workbench Preferences",
          "why": "SQL Editor, Administration, Modeling, Fonts/Colors and SSH preferences navigation ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openPreferences",
            "data": {
              "page": "SQL Editor"
            }
          }
        },
        {
          "title": "Inspect Modeling preferences",
          "why": "Default storage engine/charset and model placement behavior ni inspect chestam.",
          "software": "mysqlworkbench",
          "action": {
            "action": "openPreferences",
            "data": {
              "page": "Modeling"
            }
          }
        },
        {
          "title": "Return to the populated SQL workspace",
          "why": "Feature tour end lo real query/result/schema workspace state ki return avutham.",
          "software": "mysqlworkbench",
          "action": {
            "action": "showSchemas",
            "data": {}
          }
        }
      ]
    }
  ]
};
