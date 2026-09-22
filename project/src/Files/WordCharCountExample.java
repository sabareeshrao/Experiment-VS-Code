package Files;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class WordCharCountExample {
    public static void main(String a[]) throws IOException {
       // String name = "C:\\Users\\Poanselvi\\Desktop\\data.txt";
        File file = new File("C:\\Users\\Poanselvi\\Desktop\\data1.txt");
        int wordCount = 0;
        int lineCount = 0;

        int i = 3;
        System.out.println(i);    //  3
        System.out.println(i++);  //  3
        System.out.println(i);    // "4"
        System.out.println(++i);  //  5
        System.out.println(i);    // "5"
        System.out.println(++i);  // "6"
        System.out.println(i++);  // "6"
        System.out.println(i);    // "7"


        try(BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) { //line
                String[] words = line.trim().split("\\s+"); //by space
                wordCount = wordCount + words.length ;
                ++lineCount;
               // lineCount++;
            }
            System.out.println("wordCount" + wordCount);
            System.out.println("lineCount" + lineCount);
        } catch(IOException e){
            e.printStackTrace();
        }
    }
}
