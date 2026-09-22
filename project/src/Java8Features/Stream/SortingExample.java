package Java8Features.Stream;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class SortingExample {
    public static void main(String a[]) {
        List<Integer> numbers = Arrays.asList(11, 3, 22, 3, 4, 5);

        int[] arr = new int[5];
        arr[0] = 1;
        Integer c = 5;
        //arr[1], arr[2], arr[3], arr[4]
        //arr[5] = 3;
        float[] floatArr = new float[7];

        List<Integer> arrNumbers = new ArrayList<>();

        //int (primitive) , Integer (Wrapper class)

        //for
        //while
        // do ..while
       /* for(int i = 0;i<numbers.size();i++){
            //numbers.get(i);
           // sorting logic
        }*/

        List<Integer> sortedNumbers = numbers
                .stream()
               .sorted()
                .distinct()
                .collect(Collectors.toList());



        System.out.println("sortedNumbers" + sortedNumbers);

    }
}
