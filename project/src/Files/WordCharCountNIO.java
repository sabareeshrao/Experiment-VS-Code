package Files;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.stream.Stream;
import java.nio.file.Files;

public class WordCharCountNIO {
   /* public static void main(String a1[]) throws IOException {
        // String name = "C:\\Users\\Poanselvi\\Desktop\\data.txt";
       // File file = new File("C:\\Users\\Poanselvi\\Desktop\\data1.txt");
        Path path = Paths.get("C:\\Users\\Poanselvi\\Desktop\\data1.txt");
        //Files - copy , readLInes , lines, write
        try(Stream<String> lines = Files.lines(path)) {
            //anonymous block
            lines.map(line -> Arrays.stream(
                    new long[] {
                    line.trim().isEmpty() ? 0 : line.trim().split("\\s+").length, line.length()
            }))
                    .reduce(new long[2], (a, b) -> new Long[] { a[0] + b[0], a[1] + b[1] });
        } catch(IOException e){
            e.printStackTrace();
        }
    }*/

}
