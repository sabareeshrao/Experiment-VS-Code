package Collections;

import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

public class IteratorExample {
    public static void main(String a[]){
        List<String> list = Arrays.asList("Red", "Blue", "Green");
        //Similar to loop
        /*Iterator<String> it = list.iterator();
        while(it.hasNext()) {
            String color = it.next();
            System.out.println("Color" + color);
        }*/
  // Processing  ->
        Iterator<String> listItertor = list.listIterator();
        while(listItertor.hasNext()) {
            String color = listItertor.next();
            if(color.equals("Red")) {
                listItertor.remove();//adding
            }
            System.out.println("Color" + color);
        }
    }
}
