package Generics;

import java.util.ArrayList;

public class GenericsExample {
    public static void main(String as[]) {
        ArrayList list = new ArrayList();
        list.add("Hello");//string
        list.add(123);//int

        String target = (String)list.get(0);//auto boxing
        int number = (int)list.get(1);

        System.out.println("target " + target + "number" + number  );
    }
}
