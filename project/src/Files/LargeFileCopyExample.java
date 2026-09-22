package Files;

import java.io.IOException;
import java.nio.channels.FileChannel;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

public class LargeFileCopyExample {

    public static void main(String a[]){
        Path source = Paths.get("C:\\Users\\Poanselvi\\Desktop\\file.dat");
        Path destination = Paths.get("C:\\Users\\Poanselvi\\Desktop\\file1.dat");

        try(FileChannel inChannel = FileChannel.open(source, StandardOpenOption.READ)) {
            FileChannel outChannel = FileChannel.open(destination,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.WRITE,
                    StandardOpenOption.TRUNCATE_EXISTING) ;
                long size = inChannel.size();//size of the first big file
                long position = 0;//int , float , long, char , double , boolean , short

                while (position < size) {
                    //Byte transfer
                    long byteTransferred = inChannel.transferTo(position, Math.min(32 * 1024 * 1024, size - position), outChannel);
                    position  += byteTransferred; //position = position + byteTransferred;

                }

                System.out.println("File copied succesfully");

        } catch(IOException e){
           // e.printStackTrace();
            System.out.println("Exception " + e.getMessage());
        }

    }
}
