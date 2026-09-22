package Files;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Scanner;

public class UserInputDateTimeExample {
    public static void main(String a1[]){
        Scanner scanner = new Scanner(System.in);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        System.out.println("Entest your input (type 'exit' to quit:");

        while(true) {//indefinite loop
            System.out.println("> ");
            String input =  scanner.nextLine();
            if("exit".equalsIgnoreCase(input))
                break; //break the loop
            // break and continue


            String timestamp = LocalDateTime.now().format(formatter);
            System.out.println("[" + timestamp + "] user input : " + input);
        }
        scanner.close();

    }
}
