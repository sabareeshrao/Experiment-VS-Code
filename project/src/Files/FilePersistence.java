package Files;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class FilePersistence {

    public static void main(String a[]) throws IOException {
        String name = "C:\\Users\\Poanselvi\\Desktop\\data.txt";
        //String name = "data.txt";
        FileWriter filewriter  = new FileWriter(name, true);
       // writer.write("Hello, This is file excercise class");

        BufferedWriter writer = new BufferedWriter(filewriter);
        writer.write("Hello, Java");
        writer.newLine();
        writer.write("This is using BufferedWriter");
        writer.close();

        System.out.println("File write has been completed");

    }
}
