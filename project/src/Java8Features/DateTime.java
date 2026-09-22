package Java8Features;

import java.time.LocalDate;
import java.time.Month;
import java.time.Period;
import java.util.Date;

public class DateTime {
    public static void main(String a[]){
        LocalDate today = LocalDate.now(); //current timestamp
        LocalDate birthday = LocalDate.of(1990, Month.APRIL, 18);
        System.out.println("birthday" + birthday);
        Period age = Period.between(birthday, today);
       // System.out.println(" Test " + Period..ofDays(345));
       // Period age = Period.between(today, birthday);
        System.out.println("Age" + age);
    }
}
