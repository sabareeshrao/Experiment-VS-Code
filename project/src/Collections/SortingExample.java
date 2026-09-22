package Collections;

import java.util.Arrays;
import java.util.List;
import java.util.*;

public class SortingExample {
  public static void main(String a[]) {
      List<Integer> numbers = Arrays.asList(5, 3, 2, 13);
      List<Integer> numbersSecondaryList = Arrays.asList(5, 3);
      Collections.sort(numbers, Collections.reverseOrder());
      System.out.println(" Min Number " + Collections.min(numbers));
      System.out.println(" Man Number " + Collections.max(numbers));
      System.out.println("Index sublist" + Collections.indexOfSubList(numbers, numbersSecondaryList));

      System.out.println(numbers);
  }
}
