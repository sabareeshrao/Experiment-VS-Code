package Generics;

import java.util.ArrayList;

public class GenericsExample1 {
public static void main(String a[]) {
    ArrayList<String> list = new ArrayList<>();
    list.add("Hello");
    //list.add(123);

    //retrieval
    String target = list.get(0);
    System.out.println(target);
}
}
