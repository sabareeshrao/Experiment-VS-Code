package Files;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.List;

public class CopyFileExample1 {
    public static void main(String a[]) {
        Path source = Paths.get("C:\\Users\\Poanselvi\\Desktop\\data1.txt");
        Path destination = Paths.get("C:\\Users\\Poanselvi\\Desktop\\data2.txt");

        //file already available , clears the content of the target file
        //copy the data from source
        try {
            List<String> allLines = Files.readAllLines(source);
            Files.write(destination, allLines);
            System.out.println("copied successfully");
        }catch(IOException e){
            e.printStackTrace();
        }
    }
}
