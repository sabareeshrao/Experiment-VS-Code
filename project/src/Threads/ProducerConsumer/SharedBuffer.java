package Threads.ProducerConsumer;

import java.util.LinkedList;
import java.util.Queue;

public class SharedBuffer {
    Queue<Integer> queue = new LinkedList<>();
   // private final Object lock = new Object();
    int capacity = 5;
     public synchronized void produce(int item) throws InterruptedException {
        while(queue.size() == capacity) {
            wait();
        }
        queue.add(item);
        System.out.println("Produced item:" + item);
        notify();
    }

    public synchronized int consume() throws InterruptedException {
        //synchronized (lock) {
        while(queue.isEmpty()){
            wait();
        }
        int item = queue.poll();
        System.out.println("consumed item:" + item);
        notify();
        return item;
    }

}
