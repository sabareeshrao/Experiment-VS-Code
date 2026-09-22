package Threads.ThreadTest;

import java.lang.*;

public class MyThread extends Thread{
    private boolean running = true;
    // @Override
     public void run(){ //task
         while(running) {
             System.out.println("Is working..");
             try {
                 Thread.sleep(20000);//20 seconds
             } catch (InterruptedException e) {
                 throw new RuntimeException(e);
             }
             System.out.println("Finished working..");
         }
     }

     public void stopThread(){
         running = false;
     }
}


