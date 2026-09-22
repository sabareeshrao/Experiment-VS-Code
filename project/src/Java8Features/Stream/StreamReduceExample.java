package Java8Features.Stream;

import java.util.Arrays;
import java.util.List;

public class StreamReduceExample {
    public static void main(String a[]) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

        int sum = numbers.stream()
                .reduce(0, Integer::sum);//Method reference

        System.out.println("Sum " + sum);

    }
}
