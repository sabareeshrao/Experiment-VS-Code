package Files;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

//Try with resource - java 7
public class BufferedWriterTryWithResource {
    public static void main(String a[]) throws IOException {
        String fileName = "C:\\Users\\Poanselvi\\Desktop\\data1.txt";
       // FileWriter fw = new FileWriter(fileName);
       // BufferedWriter writer = new BufferedWriter(fw);

        try(BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))){
            writer.write("Java File I/O");
            writer.newLine();
            writer.write("Line 2: BufferedWriter example");
            writer.newLine();
            writer.write("Line 3: Auto close");
            System.out.println("Data written");
        } catch(IOException e){
            e.printStackTrace();
        }
    }
}
