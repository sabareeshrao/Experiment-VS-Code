package Files;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class MergeExample {
    public static void main(String a[]) {
        Path source = Paths.get("C:\\Users\\Poanselvi\\Desktop\\data1.txt");
        Path destination = Paths.get("C:\\Users\\Poanselvi\\Desktop\\data2.txt");
        Path merged = Paths.get("C:\\Users\\Poanselvi\\Desktop\\merged.txt");

        try{
            List<String> alllines1 = Files.readAllLines(source);
            List<String> alllines2 = Files.readAllLines(destination);

           // alllines1.addAll(alllines2);
            alllines2.addAll(alllines1);

            Files.write(merged, alllines2);

            System.out.println("Merged successfully");

        } catch(IOException e){
            e.printStackTrace();
        }
    }

}
