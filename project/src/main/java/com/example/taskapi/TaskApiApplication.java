package com.example.taskapi;

import com.example.taskapi.controller.TaskController;
import com.example.taskapi.model.Task;
import com.example.taskapi.service.TaskService;

public class TaskApiApplication {

    public static void main(String[] args) {
        TaskService service = new TaskService();
        TaskController controller = new TaskController(service);

        System.out.println("Task API ready.");

        for (Task task : controller.getTasks()) {
            System.out.println(task.getId() + " - " + task.getTitle());
        }
    }
}
