package Files;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class BufferedWriterAppendExample
{
    public static void main(String a[]) {
        String fileName = "C:\\Users\\Poanselvi\\Desktop\\data1.txt";

        try(BufferedWriter writer = new BufferedWriter(new FileWriter(fileName, true))){
            writer.newLine();
            writer.write("Appending new line to the existing file");
            writer.newLine();

            System.out.println("Appended data has been written");
        } catch(IOException e){
            e.printStackTrace();
        }
    }
}
