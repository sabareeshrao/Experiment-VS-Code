package Collections.ConcurrentHashMap;


import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class CopyOnArrayListExample {
    public static void main(String h[]){
        CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>(List.of("A", "B", "C"));
        for(String s: list) {
            if(s.equals("B")) {
                list.remove(s);
            }
        }
        System.out.println("list" + list);
    }
}
