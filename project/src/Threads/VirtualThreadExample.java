package Threads;


//OS threads
//JVM
public class VirtualThreadExample {

    public static void main(String[] args) throws Exception {

        Runnable task = () -> {
            System.out.println(
                    "Running on: " + Thread.currentThread()
            );

            try {
                Thread.sleep(2000); // Simulate I/O operation
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            System.out.println(
                    "Completed by: " + Thread.currentThread()
            );
        };

        Thread thread = Thread.startVirtualThread(task);

        thread.join();

        System.out.println("Main thread completed");
    }
}