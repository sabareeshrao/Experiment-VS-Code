package Files;

import java.nio.file.*;
import java.io.*;

public class ReplaceWordExample {
    public static void main(String ar[]) {
        Path path = Paths.get("C:\\Users\\Poanselvi\\Desktop\\data1.txt");
        try {
            String content = Files.readString(path);//.readAllLines, readString, writeString,
            String updatedContent = content.replaceAll("\\bline\\b", "line---");
            Files.writeString(path, updatedContent);

            System.out.println("Word is replaced successfully");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
