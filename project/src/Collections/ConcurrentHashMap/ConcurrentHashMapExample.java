package Collections.ConcurrentHashMap;

import java.util.ArrayList;
import java.util.List;

public class ConcurrentHashMapExample {
    public static void main(String h[]){
        List<String> list = new ArrayList<>(List.of("A", "B", "C"));

        list.get(2);
        for(String a: list){
            if(a.equals("A")){
                list.remove(a);
            }
        }
    }
}

//CopyOnWriteArrayList
//ConcurrentHashMap
