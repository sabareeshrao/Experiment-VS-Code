package Threads.Wait;

import Threads.TwoThreads.MyThread;

public class ThreadExample {
    public static void main(String h[]) throws InterruptedException {
        ShareObject s1 = new ShareObject();
        Thread t1 = new Thread(() -> s1.doWait(), "Thread1");
        Thread t2 = new Thread(() -> s1.doWait(), "Thread2");
        Thread t3 = new Thread(() -> s1.doNotify(), "Thread 3");

        t1.start();//run
        t2.start();//run
        System.out.println("t1 is alive" + t1.isAlive());
        System.out.println("t2 is alive" + t2.isAlive());
        Thread.sleep(1000);
        t3.start();
/*

        try {
            t1.join();//waiting for the user thread 1 to complete
            t2.join();//waiting for the user thread 2 to complete

            System.out.println("Main Thread continues...");
        } catch(InterruptedException e) {
            e.printStackTrace();//complete stack
        }

*/
       // System.out.println("Main Thread finished");
    }
}
