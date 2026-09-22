package Files;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class BufferedWriterArrayExample {
    public static void main(String a[]){
        String[] lines = {"Python", "C++", "JavScript", "R"};
        String fileName = "C:\\Users\\Poanselvi\\Desktop\\languages.txt";

        try(BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
            for(String line: lines){
                writer.write(line);
                writer.newLine();
            }

        } catch(IOException e){
            e.printStackTrace();
        }
    }
}

//Student 5 students - age , name , marks
//xlsx
