package Java8Features.Stream;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class StreamMap {
    public static void main(String a[]) {
        List<String> names = Arrays.asList("john", "peter", "annish");
        List<String> uppercaseNames = names
                .stream()
                .map(String::toUpperCase)
                //Method Reference
                .collect(Collectors.toList());

        //Class c = new Class(); c.methodnmae();
        //Class.staticmethod();

       /* device -> database -> medium voltage
        REST API -> COntroller(java)  -> Service (java) -> repo(java) -> database
                 java List<String> .strem().filter() <- db*/

        System.out.println("Names in Upper case" + uppercaseNames);

        List<Integer> salaryList = new ArrayList<>();
        salaryList.add(1800);
        salaryList.add(100);
        salaryList.add(800);
        System.out.println("Salary " + salaryList.stream().sorted().findFirst());

    }

}
