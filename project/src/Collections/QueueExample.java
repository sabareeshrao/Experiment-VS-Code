package Collections;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.PriorityQueue;
import java.util.Queue;

public class QueueExample {
    public static void main(String a[]) {
        //Queue<Integer> pq = new PriorityQueue<>();
        Deque<String> pq = new ArrayDeque<>();
       /* pq.add(200);
        pq.add(500);
        pq.add(300);
        pq.add(100);*/
        pq.addFirst("D");
        pq.addLast("B");
        pq.addLast("C");
        pq.addFirst("A");

        while(!pq.isEmpty()) {
            System.out.println("Printing queue values" + pq.poll());
        }
    }
}
