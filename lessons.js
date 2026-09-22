window.COURSE = {
  "title": "Task API Developer Playback",
  "subtitle": "Experimental Java project — stage progress outside, line-by-line developer steps inside.",
  "package": {
    "apps": {
      "intellij_idea": {
        "project": {
          "name": "Task API",
          "sdk": "Java 21",
          "languageLevel": "21"
        },
        "tree": [],
        "files": {},
        "problems": [],
        "breakpoints": [],
        "runConfigurations": [],
        "maven": {
          "project": "task-api",
          "profile": "default",
          "status": "Not loaded"
        },
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
      }
    }
  },
  "stages": [
    {
      "title": "1: Project Foundation",
      "subtitle": "Create the Maven project and reveal Maven only when it becomes relevant.",
      "steps": [
        {
          "title": "Create the Java project",
          "why": "A real developer first establishes the project identity, JDK, and language level before writing application code.",
          "action": {
            "action": "newProject",
            "data": {
              "name": "Task API",
              "sdk": "Java 21",
              "languageLevel": "21"
            }
          }
        },
        {
          "title": "Create pom.xml",
          "why": "Maven needs pom.xml at the project root. We create the file before typing any XML into it.",
          "action": {
            "action": "createFile",
            "data": {
              "path": "pom.xml",
              "language": "xml",
              "content": ""
            }
          }
        },
        {
          "title": "Type the opening project tag",
          "why": "The root <project> element tells Maven that the file is a Maven Project Object Model.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "pom.xml",
              "position": "end",
              "code": "<project>\n"
            }
          }
        },
        {
          "title": "Add the model version",
          "why": "modelVersion declares which POM model Maven should interpret. Maven 3 projects normally use 4.0.0.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "pom.xml",
              "position": "end",
              "code": "    <modelVersion>4.0.0</modelVersion>\n"
            }
          }
        },
        {
          "title": "Add project coordinates",
          "why": "groupId, artifactId, and version uniquely identify the build artifact. These coordinates are how Maven refers to the project.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "pom.xml",
              "position": "end",
              "code": "    <groupId>com.example</groupId>\n    <artifactId>task-api</artifactId>\n    <version>1.0.0</version>\n"
            }
          }
        },
        {
          "title": "Close the Maven project",
          "why": "The closing tag completes a valid minimal POM.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "pom.xml",
              "position": "end",
              "code": "</project>\n"
            }
          }
        },
        {
          "title": "Reveal the Maven tool window",
          "why": "The Maven window appears only now because the project has become Maven-aware. Earlier stages do not need that IDE feature.",
          "action": {
            "action": "enableFeature",
            "data": {
              "feature": "maven"
            }
          }
        },
        {
          "title": "Reload the Maven project",
          "why": "Reloading makes IntelliJ re-read pom.xml and update its Maven model.",
          "action": {
            "action": "reloadMavenProject",
            "data": {}
          }
        }
      ]
    },
    {
      "title": "2: Application Bootstrap",
      "subtitle": "Build the entry point one line at a time.",
      "steps": [
        {
          "title": "Create the application package",
          "why": "Packages organize Java classes and prevent naming collisions. The folder structure mirrors the package name.",
          "action": {
            "action": "createPackage",
            "data": {
              "name": "com.example.taskapi",
              "path": "src/main/java/com/example/taskapi"
            }
          }
        },
        {
          "title": "Create TaskApiApplication.java",
          "why": "We create an empty source file first, just as a developer would create a class from the Project tool window.",
          "action": {
            "action": "createFile",
            "data": {
              "path": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "language": "java",
              "content": ""
            }
          }
        },
        {
          "title": "Type the package declaration",
          "why": "The package line must match the directory so Java and the IDE know the class belongs to com.example.taskapi.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "position": "end",
              "code": "package com.example.taskapi;\n\n"
            }
          }
        },
        {
          "title": "Declare the application class",
          "why": "The public class gives us the top-level application type. The file name and public class name must match.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "position": "end",
              "code": "public class TaskApiApplication {\n"
            }
          }
        },
        {
          "title": "Add the main method",
          "why": "main(String[] args) is the JVM entry point. Java starts execution here.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "position": "end",
              "code": "\n    public static void main(String[] args) {\n"
            }
          }
        },
        {
          "title": "Add the first executable line",
          "why": "This print statement gives immediate feedback that the application can reach the main method.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "position": "end",
              "code": "        System.out.println(\"Task API starting...\");\n"
            }
          }
        },
        {
          "title": "Close the method and class",
          "why": "The two closing braces finish the main method and then the class.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "position": "end",
              "code": "    }\n}\n"
            }
          }
        }
      ]
    },
    {
      "title": "3: Domain Model",
      "subtitle": "Introduce Task as the data that moves through the program.",
      "steps": [
        {
          "title": "Create the model package",
          "why": "Keeping domain classes in a model package separates data representation from application behavior.",
          "action": {
            "action": "createPackage",
            "data": {
              "name": "com.example.taskapi.model",
              "path": "src/main/java/com/example/taskapi/model"
            }
          }
        },
        {
          "title": "Create Task.java",
          "why": "Task becomes our first domain class.",
          "action": {
            "action": "createFile",
            "data": {
              "path": "src/main/java/com/example/taskapi/model/Task.java",
              "language": "java",
              "content": ""
            }
          }
        },
        {
          "title": "Declare the Task package",
          "why": "This line places Task in the model namespace and must match its folder.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/model/Task.java",
              "position": "end",
              "code": "package com.example.taskapi.model;\n\n"
            }
          }
        },
        {
          "title": "Declare the Task class",
          "why": "The class groups the ID and title that belong to one task.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/model/Task.java",
              "position": "end",
              "code": "public class Task {\n"
            }
          }
        },
        {
          "title": "Add immutable fields",
          "why": "private final keeps the fields encapsulated and prevents reassignment after construction.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/model/Task.java",
              "position": "end",
              "code": "\n    private final long id;\n    private final String title;\n"
            }
          }
        },
        {
          "title": "Add the constructor",
          "why": "The constructor requires callers to provide a complete Task when the object is created.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/model/Task.java",
              "position": "end",
              "code": "\n    public Task(long id, String title) {\n        this.id = id;\n        this.title = title;\n    }\n"
            }
          }
        },
        {
          "title": "Add getters and finish the class",
          "why": "Getters expose read access without making the fields public.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/model/Task.java",
              "position": "end",
              "code": "\n    public long getId() {\n        return id;\n    }\n\n    public String getTitle() {\n        return title;\n    }\n}\n"
            }
          }
        }
      ]
    },
    {
      "title": "4: Service & Controller",
      "subtitle": "Add behavior, then expose that behavior through another layer.",
      "steps": [
        {
          "title": "Create the service package",
          "why": "The service package will hold application logic instead of placing that logic in the UI/controller layer.",
          "action": {
            "action": "createPackage",
            "data": {
              "name": "com.example.taskapi.service",
              "path": "src/main/java/com/example/taskapi/service"
            }
          }
        },
        {
          "title": "Create TaskService.java",
          "why": "The service becomes the place that produces task data for callers.",
          "action": {
            "action": "createFile",
            "data": {
              "path": "src/main/java/com/example/taskapi/service/TaskService.java",
              "language": "java",
              "content": ""
            }
          }
        },
        {
          "title": "Type service package and imports",
          "why": "TaskService needs the Task type and Java List type, so we import exactly those dependencies.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/service/TaskService.java",
              "position": "end",
              "code": "package com.example.taskapi.service;\n\nimport com.example.taskapi.model.Task;\nimport java.util.List;\n\n"
            }
          }
        },
        {
          "title": "Add the findAll method",
          "why": "findAll returns a list of domain objects. This keeps task creation out of the controller.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/service/TaskService.java",
              "position": "end",
              "code": "public class TaskService {\n\n    public List<Task> findAll() {\n        return List.of(\n            new Task(1, \"Learn cumulative playback\"),\n            new Task(2, \"Test IntelliJ simulation\")\n        );\n    }\n}\n"
            }
          }
        },
        {
          "title": "Create the controller package",
          "why": "The controller package separates the entry/API-facing layer from the service implementation.",
          "action": {
            "action": "createPackage",
            "data": {
              "name": "com.example.taskapi.controller",
              "path": "src/main/java/com/example/taskapi/controller"
            }
          }
        },
        {
          "title": "Create TaskController.java",
          "why": "The controller will depend on TaskService rather than creating task data itself.",
          "action": {
            "action": "createFile",
            "data": {
              "path": "src/main/java/com/example/taskapi/controller/TaskController.java",
              "language": "java",
              "content": ""
            }
          }
        },
        {
          "title": "Type controller package and imports",
          "why": "Imports make the controller dependencies explicit: Task, TaskService, and List.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/controller/TaskController.java",
              "position": "end",
              "code": "package com.example.taskapi.controller;\n\nimport com.example.taskapi.model.Task;\nimport com.example.taskapi.service.TaskService;\nimport java.util.List;\n\n"
            }
          }
        },
        {
          "title": "Add constructor injection",
          "why": "Passing TaskService into the constructor makes the dependency visible and keeps the controller easy to test.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/controller/TaskController.java",
              "position": "end",
              "code": "public class TaskController {\n\n    private final TaskService taskService;\n\n    public TaskController(TaskService taskService) {\n        this.taskService = taskService;\n    }\n"
            }
          }
        },
        {
          "title": "Add getTasks and close the class",
          "why": "The controller delegates to the service instead of duplicating business logic.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/controller/TaskController.java",
              "position": "end",
              "code": "\n    public List<Task> getTasks() {\n        return taskService.findAll();\n    }\n}\n"
            }
          }
        }
      ]
    },
    {
      "title": "5: Wire, Run & Developer Tools",
      "subtitle": "Only now reveal Run, Terminal, Git, Debug, Tests, and Problems as the workflow reaches them.",
      "steps": [
        {
          "title": "Return to the application class",
          "why": "We go back to the entry point because it now needs to connect the new service and controller.",
          "action": {
            "action": "openFile",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java"
            }
          }
        },
        {
          "title": "Import the new application types",
          "why": "Imports are added only after those classes actually exist.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "marker": "public class TaskApiApplication",
              "position": "before",
              "code": "import com.example.taskapi.controller.TaskController;\nimport com.example.taskapi.model.Task;\nimport com.example.taskapi.service.TaskService;\n\n"
            }
          }
        },
        {
          "title": "Create TaskService in main",
          "why": "The entry point creates the service that contains the application logic.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "marker": "        System.out.println(\"Task API starting...\");",
              "position": "before",
              "code": "        TaskService service = new TaskService();\n"
            }
          }
        },
        {
          "title": "Inject the service into the controller",
          "why": "The controller receives the service through its constructor instead of constructing it internally.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "marker": "        System.out.println(\"Task API starting...\");",
              "position": "before",
              "code": "        TaskController controller = new TaskController(service);\n\n"
            }
          }
        },
        {
          "title": "Change the startup message",
          "why": "Now that wiring is complete, the message should describe the ready state rather than the starting state.",
          "action": {
            "action": "replaceCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "find": "Task API starting...",
              "replace": "Task API ready."
            }
          }
        },
        {
          "title": "Print every task returned by the controller",
          "why": "The loop proves the layers work together: main calls controller, controller calls service, and Task data comes back.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/main/java/com/example/taskapi/TaskApiApplication.java",
              "marker": "        System.out.println(\"Task API ready.\");",
              "position": "after",
              "code": "\n\n        for (Task task : controller.getTasks()) {\n            System.out.println(task.getId() + \" - \" + task.getTitle());\n        }"
            }
          }
        },
        {
          "title": "Reveal Run controls",
          "why": "Run controls were hidden earlier because there was nothing useful to execute. The feature appears only when the project is ready to run.",
          "action": {
            "action": "enableFeature",
            "data": {
              "feature": "run"
            }
          }
        },
        {
          "title": "Create a run configuration",
          "why": "A run configuration tells IntelliJ which main class to launch.",
          "action": {
            "action": "createApplicationConfig",
            "data": {
              "name": "Task API",
              "mainClass": "com.example.taskapi.TaskApiApplication"
            }
          }
        },
        {
          "title": "Run the application",
          "why": "The Run tool window now becomes useful and shows the simulated process output.",
          "action": {
            "action": "runConfiguration",
            "data": {
              "name": "Task API",
              "console": "Task API ready.\n1 - Learn cumulative playback\n2 - Test IntelliJ simulation\n\nProcess finished with exit code 0"
            }
          }
        },
        {
          "title": "Reveal the Terminal tool",
          "why": "Terminal is introduced only when the workflow reaches command-line work.",
          "action": {
            "action": "enableFeature",
            "data": {
              "feature": "terminal"
            }
          }
        },
        {
          "title": "Open the integrated terminal",
          "why": "The terminal is part of the developer workflow, but it did not need to occupy the UI during earlier coding steps.",
          "action": {
            "action": "openTerminal",
            "data": {}
          }
        },
        {
          "title": "Type a command in the terminal",
          "why": "This shows that the simulation can animate terminal commands separately from editor typing.",
          "action": {
            "action": "typeTerminal",
            "data": {
              "command": "git status --short",
              "output": "A  pom.xml\nA  src/main/java/com/example/taskapi/TaskApiApplication.java\nA  src/main/java/com/example/taskapi/model/Task.java\nA  src/main/java/com/example/taskapi/service/TaskService.java\nA  src/main/java/com/example/taskapi/controller/TaskController.java"
            }
          }
        },
        {
          "title": "Reveal Git",
          "why": "Git controls appear when version-control work begins, not from the first line of code.",
          "action": {
            "action": "enableFeature",
            "data": {
              "feature": "git"
            }
          }
        },
        {
          "title": "Open Local Changes",
          "why": "The Git view now shows files created or modified during the simulated development session.",
          "action": {
            "action": "openGitToolWindow",
            "data": {}
          }
        },
        {
          "title": "Reveal Debug",
          "why": "Debug becomes available only in the verification stage.",
          "action": {
            "action": "enableFeature",
            "data": {
              "feature": "debug"
            }
          }
        },
        {
          "title": "Reveal Tests",
          "why": "Testing tools are introduced after the runnable application exists.",
          "action": {
            "action": "enableFeature",
            "data": {
              "feature": "tests"
            }
          }
        },
        {
          "title": "Reveal Problems",
          "why": "The Problems view is now available for inspections and compile issues.",
          "action": {
            "action": "enableFeature",
            "data": {
              "feature": "problems"
            }
          }
        },
        {
          "title": "Run a small verification test",
          "why": "The test panel demonstrates how later stages can activate specialized IntelliJ features without cluttering earlier stages.",
          "action": {
            "action": "runJUnit",
            "data": {
              "total": 2,
              "passed": 2,
              "failed": 0,
              "tests": [
                {
                  "name": "controllerReturnsTasks",
                  "status": "PASS"
                },
                {
                  "name": "serviceReturnsTasks",
                  "status": "PASS"
                }
              ]
            }
          }
        }
      ]
    }
  ]
};
