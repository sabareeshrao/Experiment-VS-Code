package Threads.ProducerConsumer;

public class Producer implements Runnable{
    SharedBuffer buffer ;

    public Producer(SharedBuffer buffer){
        this.buffer = buffer;
    }

    @Override
    public void run() {
        int  i =0;
        while(true){
            try {
                buffer.produce(i++);//null.produce(i++)
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
