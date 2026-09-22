package Threads.ExecutorFramework;

import java.util.concurrent.*;

public class CallableExample {
    public static void main(String a[]) {
        ExecutorService executor = Executors.newFixedThreadPool(3);
        Callable<String> task = () -> {
            System.out.println("Task running on" + Thread.currentThread().getName());
            Thread.sleep(2000);
            return "Task Completed";
        };

        try {
            Future<String> future = executor.submit(task);
            String result = future.get();
            System.out.println("result from callable---" + result);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        } finally {
            executor.shutdown();

    }
}
}
