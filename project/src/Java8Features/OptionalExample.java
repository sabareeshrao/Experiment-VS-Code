package Java8Features;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class OptionalExample {
    public static void main(String a[]) {
       // List<String> list = Arrays.asList("apple", "bannana", "cherry", "papaya");
        List<String> list = Arrays.asList();

        System.out.println( "result..." +list.stream().findAny());
        /*Optional<String> any = list.stream().findAny();
        if(any.isPresent()) {
            System.out.println("Any" + any);
        }*/

        String any = String.valueOf(list.stream().findAny());
        System.out.println("Any" + any);

       // List<String> v = Arrays.asList("product1", "" , "product2");
        /* Optional<String> y = null;
         if(y.isPresent()) {
             System.out.println(y.get().toLowerCase());
         }*/
      //  String any = String.valueOf(list.stream().findAny());

      //  Optional<String> s = null;
       // System.out.println(s.isPresent());

     //   System.out.println("Any " + any.orElse("none"));

       // System.out.println("Any " + any.trim());

    }
}
