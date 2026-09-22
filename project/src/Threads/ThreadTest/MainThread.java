package Threads.ThreadTest;

public class MainThread {
    public static void main(String h[]){ //Main Thread
        MyThread mythreat = new MyThread(); //User THread
        mythreat.start();
        try {
            Thread.sleep(10000);//10seconds
        } catch(InterruptedException e) {
            e.printStackTrace();//complete stack
        }
        mythreat.stopThread();
      /*  try {
            mythreat.join();//waiting for the user thread to complete
            System.out.println("Main Thread continues...");
        } catch(InterruptedException e) {
            e.printStackTrace();//complete stack
        }*/

        System.out.println(mythreat.isAlive());

       // mythreat.run();
    }
}
