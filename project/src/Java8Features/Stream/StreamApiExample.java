package Java8Features.Stream;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamApiExample {
    public static void main(String a[]){
        List<Integer> numbers = Arrays.asList(2,5,6,3,10);
        List<Integer> evenNumbers;

       /* for(int i=0;i<numbers.size();i++){
            if(i%2 == 0){
                System.out.println("The number is even");
            }
        }*/
        int c = 98;
        String s = "56";
        int y = Integer.parseInt(s);

        evenNumbers = numbers
                .stream()
                .filter( numf -> numf % 2 == 0)
                .toList();
                //.collect(Collectors.toList());

        System.out.println("even Numbers" + evenNumbers);
    }
}
