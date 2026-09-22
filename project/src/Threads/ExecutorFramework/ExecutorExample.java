package Threads.ExecutorFramework;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ExecutorExample {
    public static void main(String a[]){

        //Executors e1 = new Executors();
        //Thread t1 = new THread();

        ExecutorService executor = Executors.newFixedThreadPool(5); //Thread Pool , 3 threads
       // Executors.newCachedThreadPool();
        for(int i=1;i<=5;i++){
            int taskId = i;
            executor.submit(() -> {
                System.out.println("Task" + taskId + "running" + Thread.currentThread().getName());
                try{
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }System.out.println("Task " + taskId + "is completed");
            });
        }

        executor.shutdown();
    }
}
