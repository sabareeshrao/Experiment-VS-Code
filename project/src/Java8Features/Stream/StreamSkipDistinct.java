package Java8Features.Stream;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamSkipDistinct {
    public static void main(String a[]) {
        List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 4, 6, 7, 10);
        List<Integer> result = numbers.stream()
                .distinct() //unique (1,2,3,4,6,7,10)
                .skip(1) //(2,3,4,6,7,10)
                .limit(4) //(2,3,4,6)
                .collect(Collectors.toList());

        System.out.println("Distinct Elements " + result);

    }
}
