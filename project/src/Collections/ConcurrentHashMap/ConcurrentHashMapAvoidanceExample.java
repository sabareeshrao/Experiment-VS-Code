package Collections.ConcurrentHashMap;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentHashMapAvoidanceExample {
    public static void main(String h[]){
        ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
       // HashMap<String, Integer> map = new HashMap<>();
        map.put("A", 1);
        map.put("B", 2);
        map.put("C", 3);

        System.out.println( "Value " + map.get("C"));

        map.putIfAbsent("B", 4);//
        //map.putIfAbsent("A", 4);
       // map.computeIfAbsent("A", val -> Integer.valueOf(val + 19));
        map.computeIfPresent("A", (keyE, valE) -> valE + 10);

        /*for(Map.Entry<String, Integer> map1: map.entrySet()) {
            if(map1.getKey().equals("A")) {
                map.remove(map1.getKey());
            }
        }*/
        for(Map.Entry<String, Integer> map1: map.entrySet()) {
            System.out.println("Key"+ map1.getKey() + "Value" + map1.getValue());
        }

      /*  for(String map1: map.keySet()) {
            if(map1.equals("A")) {
                map.remove(map1);
            }
        }

        for(Integer number: map.values()) {
            if(number.equals(1)) {
                //map.remove(map1);
            }
        } */

    }
}
