package Threads.TwoThreads;

public class ThreadExample {
    public static void main(String h[]){
        MyThread t1 = new MyThread("Thread 1");
        MyThread t2 = new MyThread("Thread 2");

        t1.start();//run
        t2.start();//run

        try {
            t1.join();//waiting for the user thread 1 to complete
            t2.join();//waiting for the user thread 2 to complete

            System.out.println("Main Thread continues...");
        } catch(InterruptedException e) {
            e.printStackTrace();//complete stack
        }

        System.out.println("Main Thread finished");
    }
}
