package Threads.ProducerConsumer;

public class Consumer implements Runnable{
    SharedBuffer buffer ;

   public Consumer(SharedBuffer buffer){
        this.buffer = buffer;
    }

    @Override
    public void run(){
        try {
            while(true) {
                buffer.consume();
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
