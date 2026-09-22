package Threads.ExecutorFramework;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

public class CompletableFutureExample {
    public static void main(String a[]){

       /* CompletableFuture<String> completableFuture = CompletableFuture.supplyAsync(() -> {
            System.out.println("Task running on " + Thread.currentThread().getName());
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            return "Hello from completablefuture";
        });*/
        //Chaining
        /*CompletableFuture<Void> completableFuture = CompletableFuture.supplyAsync(() -> 5)
                .thenApply(y -> y * 2)
                .thenApply(n -> n +5)
                .thenAccept(res -> System.out.println("Double the value " + res));*/
        //run async
        CompletableFuture<Void> completableFuture = CompletableFuture.runAsync(() -> {
                System.out.println("Task running on " + Thread.currentThread().getName());
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

    });


            //completableFuture.get();
            completableFuture.thenRun(() -> {
                System.out.println("Task completed ");
            });

            //completableFuture.join();

    }
}
