package com.example.taskapi.service;

import com.example.taskapi.model.Task;
import java.util.List;

public class TaskService {

    public List<Task> findAll() {
        return List.of(
            new Task(1, "Learn cumulative playback"),
            new Task(2, "Test IntelliJ simulation")
        );
    }
}
