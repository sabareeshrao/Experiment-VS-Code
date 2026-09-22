package Java8Features;

import java.util.Arrays;
import java.util.List;

public class lambdaexpession {
    public static void main(String a[]) {
        List<String> names = Arrays.asList("Lasya", "Selvi", "Mark", "Daisy");

        //Before Java 8
       /* for (String name : names) {
            System.out.println("name" + name);
        }*/

        //JAVA 8 - lambda
        names.forEach(name -> System.out.println(name));
    }
}
