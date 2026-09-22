package Collections;

import java.util.*;
import java.util.stream.Collectors;

public class ListExample {
    //Vector , HashTable  - obsolete
    //Set -> HashSet
    //Map - HashMap , LinkedHashMap , TreeMap
    //List - ArrayList , LinkedList
    //Queue - FIFO , PriorityQueue
    //Stack - LIFO
    public static void main(String a[]){
       // String[] name = new String[5];
      //  List<String> namesa = new ArrayList<>();
        List<String> names = new LinkedList<>();
        Employee e1 = new Employee(5, "ii", 19876);
       //How to add the elemnet
        names.add("Ace"); //0th
        names.add("Beta");//1st
        names.add("charlie");//2nd

      //  System.out.println("First Element "+ names.getFirst());
        System.out.println("First Element "+ names.get(0));
         //How to remove the element
        names.remove(1);

        int[] listWithSize = new int[45];//not collection

        List<String> oldList = Arrays.asList("Bhama", "Renu");
        names.addAll(oldList);//4th Bhama 5th Renu
        names.add("Peter");//6th

        names.set(4, "Alice");
        // [Ace, charlie , Bhama, renu, Peter ] - [0..4]
       // [Ace, charlie , Bhama, renu, Alice ]
        System.out.println("after removal" + names);
//How to process the elements in the list
        for(String name: names){
            System.out.println("Name"+ name);
        }

      /*  for(int i=0;i<names.toArray().length;i++){
            System.out.println(names.get(i));
        }*/
       //applying filter in the list
        List<String> sortedNames = names.stream()

                .filter( nam -> nam.startsWith("b"))
                .collect(Collectors.toList());


        Set<String> sortedNamesq = names.stream()
                .filter( nam -> nam.startsWith("b"))
                .sorted()//first condition
                .collect(Collectors.toSet());

        System.out.println("sortedNames"+ sortedNames);
    }
}
