window.LESSONS = [
  {
    "id": 1,
    "title": "Create the application entry point",
    "summary": "Start with a single Java class and a main method.",
    "activeFile": "src/main/java/com/example/taskapi/TaskApiApplication.java",
    "explanation": "Every Java application needs an entry point. In this first lesson the repository contains only the application class.",
    "terminal": "$ mkdir -p src/main/java/com/example/taskapi\n$ touch src/main/java/com/example/taskapi/TaskApiApplication.java\n\n✓ Project skeleton created.",
    "files": {
      "src/main/java/com/example/taskapi/TaskApiApplication.java": "package com.example.taskapi;\n\npublic class TaskApiApplication {\n\n    public static void main(String[] args) {\n        System.out.println(\"Task API starting...\");\n    }\n}"
    }
  },
  {
    "id": 2,
    "title": "Add the Task model",
    "summary": "Introduce the first domain object.",
    "activeFile": "src/main/java/com/example/taskapi/model/Task.java",
    "explanation": "The Task class represents data in our tiny application. Notice that Lesson 1's application file still exists — lessons are cumulative.",
    "terminal": "$ mkdir -p src/main/java/com/example/taskapi/model\n$ touch src/main/java/com/example/taskapi/model/Task.java\n\n✓ Task model added.",
    "files": {
      "src/main/java/com/example/taskapi/TaskApiApplication.java": "package com.example.taskapi;\n\npublic class TaskApiApplication {\n\n    public static void main(String[] args) {\n        System.out.println(\"Task API starting...\");\n    }\n}",
      "src/main/java/com/example/taskapi/model/Task.java": "package com.example.taskapi.model;\n\npublic class Task {\n\n    private final long id;\n    private final String title;\n\n    public Task(long id, String title) {\n        this.id = id;\n        this.title = title;\n    }\n\n    public long getId() {\n        return id;\n    }\n\n    public String getTitle() {\n        return title;\n    }\n}"
    }
  },
  {
    "id": 3,
    "title": "Create the service layer",
    "summary": "Add simple business logic and in-memory data.",
    "activeFile": "src/main/java/com/example/taskapi/service/TaskService.java",
    "explanation": "The service layer owns application logic. It now creates and returns tasks while the model and application entry point remain available.",
    "terminal": "$ mkdir -p src/main/java/com/example/taskapi/service\n$ touch src/main/java/com/example/taskapi/service/TaskService.java\n\n✓ Service layer added.",
    "files": {
      "src/main/java/com/example/taskapi/TaskApiApplication.java": "package com.example.taskapi;\n\npublic class TaskApiApplication {\n\n    public static void main(String[] args) {\n        System.out.println(\"Task API starting...\");\n    }\n}",
      "src/main/java/com/example/taskapi/model/Task.java": "package com.example.taskapi.model;\n\npublic class Task {\n\n    private final long id;\n    private final String title;\n\n    public Task(long id, String title) {\n        this.id = id;\n        this.title = title;\n    }\n\n    public long getId() {\n        return id;\n    }\n\n    public String getTitle() {\n        return title;\n    }\n}",
      "src/main/java/com/example/taskapi/service/TaskService.java": "package com.example.taskapi.service;\n\nimport com.example.taskapi.model.Task;\nimport java.util.List;\n\npublic class TaskService {\n\n    public List<Task> findAll() {\n        return List.of(\n            new Task(1, \"Learn cumulative playback\"),\n            new Task(2, \"Test fullscreen mode\")\n        );\n    }\n}"
    }
  },
  {
    "id": 4,
    "title": "Add the controller",
    "summary": "Expose tasks through a simple controller class.",
    "activeFile": "src/main/java/com/example/taskapi/controller/TaskController.java",
    "explanation": "The controller depends on TaskService. In a real Spring application this layer would expose HTTP endpoints; here we keep the trial intentionally dependency-free.",
    "terminal": "$ mkdir -p src/main/java/com/example/taskapi/controller\n$ touch src/main/java/com/example/taskapi/controller/TaskController.java\n\n✓ Controller layer added.",
    "files": {
      "src/main/java/com/example/taskapi/TaskApiApplication.java": "package com.example.taskapi;\n\npublic class TaskApiApplication {\n\n    public static void main(String[] args) {\n        System.out.println(\"Task API starting...\");\n    }\n}",
      "src/main/java/com/example/taskapi/model/Task.java": "package com.example.taskapi.model;\n\npublic class Task {\n\n    private final long id;\n    private final String title;\n\n    public Task(long id, String title) {\n        this.id = id;\n        this.title = title;\n    }\n\n    public long getId() {\n        return id;\n    }\n\n    public String getTitle() {\n        return title;\n    }\n}",
      "src/main/java/com/example/taskapi/service/TaskService.java": "package com.example.taskapi.service;\n\nimport com.example.taskapi.model.Task;\nimport java.util.List;\n\npublic class TaskService {\n\n    public List<Task> findAll() {\n        return List.of(\n            new Task(1, \"Learn cumulative playback\"),\n            new Task(2, \"Test fullscreen mode\")\n        );\n    }\n}",
      "src/main/java/com/example/taskapi/controller/TaskController.java": "package com.example.taskapi.controller;\n\nimport com.example.taskapi.model.Task;\nimport com.example.taskapi.service.TaskService;\nimport java.util.List;\n\npublic class TaskController {\n\n    private final TaskService taskService;\n\n    public TaskController(TaskService taskService) {\n        this.taskService = taskService;\n    }\n\n    public List<Task> getTasks() {\n        return taskService.findAll();\n    }\n}"
    }
  },
  {
    "id": 5,
    "title": "Wire everything together",
    "summary": "Connect controller and service and run the finished trial.",
    "activeFile": "src/main/java/com/example/taskapi/TaskApiApplication.java",
    "explanation": "The final lesson wires the objects together. This state contains every file created across all five lessons — exactly how a later lesson should look.",
    "terminal": "$ javac $(find src -name \"*.java\")\n$ java com.example.taskapi.TaskApiApplication\n\nTask API ready.\n1 - Learn cumulative playback\n2 - Test fullscreen mode\n\n✓ BUILD SUCCESS",
    "files": {
      "src/main/java/com/example/taskapi/TaskApiApplication.java": "package com.example.taskapi;\n\nimport com.example.taskapi.controller.TaskController;\nimport com.example.taskapi.model.Task;\nimport com.example.taskapi.service.TaskService;\n\npublic class TaskApiApplication {\n\n    public static void main(String[] args) {\n        TaskService service = new TaskService();\n        TaskController controller = new TaskController(service);\n\n        System.out.println(\"Task API ready.\");\n\n        for (Task task : controller.getTasks()) {\n            System.out.println(task.getId() + \" - \" + task.getTitle());\n        }\n    }\n}",
      "src/main/java/com/example/taskapi/model/Task.java": "package com.example.taskapi.model;\n\npublic class Task {\n\n    private final long id;\n    private final String title;\n\n    public Task(long id, String title) {\n        this.id = id;\n        this.title = title;\n    }\n\n    public long getId() {\n        return id;\n    }\n\n    public String getTitle() {\n        return title;\n    }\n}",
      "src/main/java/com/example/taskapi/service/TaskService.java": "package com.example.taskapi.service;\n\nimport com.example.taskapi.model.Task;\nimport java.util.List;\n\npublic class TaskService {\n\n    public List<Task> findAll() {\n        return List.of(\n            new Task(1, \"Learn cumulative playback\"),\n            new Task(2, \"Test fullscreen mode\")\n        );\n    }\n}",
      "src/main/java/com/example/taskapi/controller/TaskController.java": "package com.example.taskapi.controller;\n\nimport com.example.taskapi.model.Task;\nimport com.example.taskapi.service.TaskService;\nimport java.util.List;\n\npublic class TaskController {\n\n    private final TaskService taskService;\n\n    public TaskController(TaskService taskService) {\n        this.taskService = taskService;\n    }\n\n    public List<Task> getTasks() {\n        return taskService.findAll();\n    }\n}"
    }
  }
];
