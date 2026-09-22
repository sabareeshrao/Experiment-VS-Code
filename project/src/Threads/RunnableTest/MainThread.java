package Threads.RunnableTest;

import Threads.ThreadTest.MyThread;

public class MainThread {
    public static void main(String h[]){
        Thread t1 = new Thread(new MyRunnable());

        //Thread tt = new Thread(new Runnable())
        t1.start(); //run()

    }
}
