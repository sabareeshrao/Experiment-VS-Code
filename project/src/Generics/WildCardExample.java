package Generics;

import java.util.ArrayList;
import java.util.List;

public class WildCardExample {
    public static void printNumbers(List<? extends Number> list){
        for(Number n: list){
            System.out.println(n);
        }
    }

    public static void addIntegers(List<? super Integer> list){
        list.add(10);
    }

    public static void main(String a[]) {
        List<Integer> intList = List.of(1, 2, 3);
        printNumbers(intList);

        List<Number> numList  = new ArrayList<>();
        addIntegers(numList);
        System.out.println("numList" + numList);
    }
}
