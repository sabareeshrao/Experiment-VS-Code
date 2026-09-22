package Files;

import java.io.*;

public class BufferedReaderExample
{

    public static void main(String a[]){
        String fileName = "C:\\Users\\Poanselvi\\Desktop\\languages.txt";

        try(BufferedReader reader = new BufferedReader(new FileReader(fileName))) {
            String line;
            System.out.println("content.");
           /* String line1 = reader.readLine();
            System.out.println(line1);
            String line2 = reader.readLine();
            System.out.println(line2);
            String line3 = reader.readLine();
            System.out.println(line3);
            String line4 = reader.readLine();
            System.out.println(line4);
            String line5 = reader.readLine();
            System.out.println(line5);*/
            while((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch(IOException e){
            e.printStackTrace();
        }
    }
}
