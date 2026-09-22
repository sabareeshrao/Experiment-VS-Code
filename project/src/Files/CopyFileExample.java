package Files;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

public class CopyFileExample {
    public static void main(String a[]) {
       Path source = Paths.get("C:\\Users\\Poanselvi\\Desktop\\data1.txt");
       Path destination = Paths.get("C:\\Users\\Poanselvi\\Desktop\\data2.txt");
       try {
           Files.copy(source, destination, StandardCopyOption.COPY_ATTRIBUTES);
           System.out.println("Copied successfully");
       } catch (IOException e) {
           throw new RuntimeException(e);
       }
    }
}
