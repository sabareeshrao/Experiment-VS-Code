package Collections;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class MapExample {
    //Key , Value
    //Lasya , 21
    public static void main(String a[]) {
        Map<String, Integer> ageMap = new TreeMap<>();
        Map<Integer, String> salaryMap  = new HashMap<>();
        Map<Integer, Integer> markMap  = new HashMap<>();

       // Map<Boolean, Boolean> markMap  = new HashMap<>();

        ageMap.put("Alice", 25);
        ageMap.put("Charlie", 25);
        ageMap.put("Bob", 26);
        ageMap.put("Bob", 27);

        salaryMap.put(1000, "four digit salary");
        salaryMap.put(10000, "five digit salary");
        salaryMap.put(100000, "six digit salary");

        markMap.put(21, 95);
        markMap.put(22, 65);
        markMap.put(23, 35);


       // for(String name: names)
        //Get / retrieve the value
        for(Map.Entry<String, Integer> entry: ageMap.entrySet()){
            System.out.println("entry.getKey" + entry.getKey());
            System.out.println("entry.getValue" + entry.getValue());
        }

       /* for(Map.Entry<Integer, String> entry: salaryMap.entrySet()){
            System.out.println("entry.getKey" + entry.getKey());
            System.out.println("entry.getValue" + entry.getValue());
        }

        //remove an entry
        ageMap.remove("Alice");

        for(Map.Entry<String, Integer> entry: ageMap.entrySet()){
            System.out.println("entry.getKey" + entry.getKey());
            System.out.println("entry.getValue" + entry.getValue());
        }*/

    }
}
