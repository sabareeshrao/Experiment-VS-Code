package Threads.ProducerConsumer;

public class ProducerConsumerMain {
   public static void main(String a[]){
       SharedBuffer sb = new SharedBuffer();//produce  consume

       Thread producer = new Thread(new Producer(sb));
       Thread consumer = new Thread(new Consumer(sb));

       producer.start();
       consumer.start();
   }
}
