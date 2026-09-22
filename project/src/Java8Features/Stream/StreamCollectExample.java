package Java8Features.Stream;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamCollectExample {
    public static void main(String a[]){
        List<String> names = Arrays.asList("Aly", "Bobie", "Charles");

        String joined = names
                .stream()
                .collect(Collectors.joining(" - "));

        System.out.println(" Joined String" + joined);
    }
}
