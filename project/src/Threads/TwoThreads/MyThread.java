package Threads.TwoThreads;

public class MyThread extends Thread{
    private String name;

    MyThread(String name){
        this.name = name;
    }

    public void run(){
        for(int i=1;i<=5;i++){
            System.out.println(name + "count" + i);
            try {
                Thread.sleep(1000);
            } catch(InterruptedException ex){
                ex.printStackTrace();
            }
        }
        System.out.println(name + "Finished");
    }


}
