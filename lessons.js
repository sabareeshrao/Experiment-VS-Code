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
      "title": "2: PostgreSQL / pgAdmin Developer Workflow",
      "subtitle": "21-step IntelliJ → pgAdmin → IntelliJ PostgreSQL workflow with schema creation, data verification, filtering, EXPLAIN, and indexing.",
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
          "title": "Open pgAdmin for the Java Practice database",
          "why": "PostgreSQL database work kosam developer pgAdmin ki switch avuthadu. Project timeline same ga untundi, active software matrame maruthundi.",
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
          "why": "SQL correct database context lo execute avvali. Anduke Object Explorer lo java_practice database ni select chestam.",
          "software": "pgadmin",
          "action": {
            "action": "selectTree",
            "data": {
              "path": "Servers/Local PostgreSQL/Databases/java_practice"
            }
          }
        },
        {
          "title": "Open the PostgreSQL Query Tool",
          "why": "DDL, INSERT, SELECT laanti SQL commands rayadaniki pgAdmin Query Tool ni open chestam.",
          "software": "pgadmin",
          "action": {
            "action": "openQueryTool",
            "data": {
              "title": "Query Tool"
            }
          }
        },
        {
          "title": "Write the student table DDL",
          "why": "Student Java model ni PostgreSQL table ga represent cheyyadaniki roll_no, attendance, marks array, name columns create chestunnam.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "CREATE TABLE public.student (\n    roll_no INTEGER PRIMARY KEY,\n    is_present BOOLEAN NOT NULL,\n    marks REAL[],\n    name VARCHAR(100) NOT NULL\n);"
            }
          }
        },
        {
          "title": "Execute CREATE TABLE",
          "why": "DDL execute chesthe public schema lo student table create avuthundi. Success message database command accept chesindani confirm chestundi.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "message": "CREATE TABLE",
              "statusText": "student table created"
            }
          }
        },
        {
          "title": "Refresh Object Explorer after schema change",
          "why": "Database object create chesina taruvatha pgAdmin Browser refresh cheyyadam normal workflow. Appudu kotha student table tree lo kanipisthundi.",
          "software": "pgadmin",
          "action": {
            "action": "refreshTree",
            "data": {
              "statusText": "Object Explorer refreshed"
            }
          }
        },
        {
          "title": "Inspect the new public.student table",
          "why": "Created table ni tree lo select chesi columns correct ga vachaya ani developer quick ga verify chestadu.",
          "software": "pgadmin",
          "action": {
            "action": "selectTree",
            "data": {
              "path": "Servers/Local PostgreSQL/Databases/java_practice/Schemas/public/Tables/student"
            }
          }
        },
        {
          "title": "Write sample student INSERT statements",
          "why": "Application integration test kosam realistic sample rows database lo insert chestam. Ravi mariyu Anita records later SELECT verification ki use avuthayi.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "INSERT INTO public.student (roll_no, is_present, marks, name)\nVALUES\n    (101, TRUE, ARRAY[86.5, 91.0, 88.5], 'Ravi'),\n    (102, TRUE, ARRAY[79.0, 84.5, 88.0], 'Anita');"
            }
          }
        },
        {
          "title": "Execute the INSERT",
          "why": "INSERT execute ayyaka rendu rows PostgreSQL virtual table state lo store avuthayi. Developer affected-row result ni verify chestadu.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "message": "INSERT 0 2",
              "statusText": "2 rows inserted",
              "rows": [
                [
                  101,
                  true,
                  "{86.5,91,88.5}",
                  "Ravi"
                ],
                [
                  102,
                  true,
                  "{79,84.5,88}",
                  "Anita"
                ]
              ]
            }
          }
        },
        {
          "title": "Write a SELECT for all students",
          "why": "Inserted data expected ga store ayyinda ani verify cheyyadaniki student table meeda SELECT query run chestam.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "SELECT roll_no, is_present, marks, name\nFROM public.student\nORDER BY roll_no;"
            }
          }
        },
        {
          "title": "Execute the student SELECT",
          "why": "SELECT result lo database rows application expectations tho match avuthunnaya ani developer verify chestadu.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "message": "SELECT 2",
              "statusText": "2 rows returned",
              "showTab": "data",
              "result": {
                "columns": [
                  "roll_no",
                  "is_present",
                  "marks",
                  "name"
                ],
                "rows": [
                  [
                    101,
                    true,
                    "{86.5,91,88.5}",
                    "Ravi"
                  ],
                  [
                    102,
                    true,
                    "{79,84.5,88}",
                    "Anita"
                  ]
                ]
              }
            }
          }
        },
        {
          "title": "Inspect Data Output",
          "why": "pgAdmin Data Output grid lo columns mariyu row values visually inspect chestam. Idi backend debugging lo common database verification step.",
          "software": "pgadmin",
          "action": {
            "action": "showResultTab",
            "data": {
              "tab": "data"
            }
          }
        },
        {
          "title": "Write a filtered SELECT for student 101",
          "why": "Specific backend record ni troubleshoot cheyyadaniki roll_no 101 meeda filtered query rayadam normal debugging workflow.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "SELECT roll_no, is_present, marks, name\nFROM public.student\nWHERE roll_no = 101;"
            }
          }
        },
        {
          "title": "Execute the filtered SELECT",
          "why": "Filtered result Ravi record matrame return chesthunda ani verify chestam. Application API response tho database row ni compare cheyyadaniki idi useful.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "message": "SELECT 1",
              "statusText": "1 row returned",
              "showTab": "data",
              "result": {
                "columns": [
                  "roll_no",
                  "is_present",
                  "marks",
                  "name"
                ],
                "rows": [
                  [
                    101,
                    true,
                    "{86.5,91,88.5}",
                    "Ravi"
                  ]
                ]
              }
            }
          }
        },
        {
          "title": "Inspect the PostgreSQL EXPLAIN plan",
          "why": "Query performance behavior ardham chesukodaniki developer EXPLAIN plan ni chustadu. Small table lo sequential scan normal ga untundi.",
          "software": "pgadmin",
          "action": {
            "action": "showExplain",
            "data": {
              "statusText": "EXPLAIN plan generated",
              "plan": [
                {
                  "node": "Seq Scan",
                  "detail": "public.student"
                },
                {
                  "node": "Filter",
                  "detail": "roll_no = 101"
                }
              ]
            }
          }
        },
        {
          "title": "Write an index for roll_no lookups",
          "why": "Repeated student ID lookups optimize cheyyadaniki roll_no meeda index create chestam. Real project lo query patterns batti indexes add chestaru.",
          "software": "pgadmin",
          "action": {
            "action": "typeSql",
            "data": {
              "replace": true,
              "sql": "CREATE INDEX idx_student_roll_no\nON public.student (roll_no);"
            }
          }
        },
        {
          "title": "Execute CREATE INDEX",
          "why": "Index create ayyaka PostgreSQL filtered lookups ki index structure use cheyyagaladu. Simulator Object Explorer kuda new index state ni preserve chestundi.",
          "software": "pgadmin",
          "action": {
            "action": "executeQuery",
            "data": {
              "message": "CREATE INDEX",
              "statusText": "idx_student_roll_no created"
            }
          }
        },
        {
          "title": "Refresh Object Explorer after index creation",
          "why": "Index schema change Browser tree lo kanipinchadaniki Object Explorer ni refresh chestam.",
          "software": "pgadmin",
          "action": {
            "action": "refreshTree",
            "data": {
              "statusText": "Object Explorer refreshed after index creation"
            }
          }
        },
        {
          "title": "Inspect idx_student_roll_no in the table tree",
          "why": "Indexes folder lo idx_student_roll_no visible ga unda ani verify chesi database optimization change successful ani confirm chestam.",
          "software": "pgadmin",
          "action": {
            "action": "selectTree",
            "data": {
              "path": "Servers/Local PostgreSQL/Databases/java_practice/Schemas/public/Tables/student/Indexes/idx_student_roll_no"
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
    }
  ]
};
