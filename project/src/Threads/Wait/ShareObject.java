package Threads.Wait;

public class ShareObject {
    public synchronized void doWait() {
        System.out.println(Thread.currentThread().getName() + "is waiting");
        try {
            wait();//THread - wait
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        System.out.println(Thread.currentThread().getName() + "resumes");
    }

    public synchronized void doNotify() {
        System.out.println(Thread.currentThread().getName() + "notifying");
        notifyAll();//Current thread
    }
}
