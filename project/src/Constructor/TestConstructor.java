package Constructor;

//import Collections.Employee;



import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class TestConstructor {
    final int instanVar = 90 ;

    TestConstructor(){
        System.out.println("Empty constrcutor");
    }

    TestConstructor(int param1) {
        super();
        System.out.println("constrcutor with one paramete");
    }

    public void main(String a[]) {


        TestConstructor tc = new TestConstructor();//default constructor Java
        TestConstructor tc1 = new TestConstructor(234);
        System.out.println(this.instanVar+6);
        int[] array = new int[] {3, 4};
      //  System.out.println("array element" + array[3]);
        String test = null;
        try {
            test = test.concat("er");//NPE
          int x =  8 / 0; //Arithmetic

          // FileReader f = new FileReader("tt");
        } catch(ArithmeticException e){
            System.out.println("Exception is captured");
        } catch(NullPointerException npe){
            System.out.println("NullpointerException is captured");
        }
           try {
               exception();
           } catch(IOException e){
               System.out.println("Message" + e.getMessage());
               System.out.println("StackTrace" + e.getStackTrace());
               System.out.println("Cause" + e.getCause());
           } finally {
               System.out.println("IN finally block");
           }
        System.out.println("After Exception");
       // instanVar = 89;

    }

    public void exception() throws IOException {
        try{
            FileReader f = new FileReader("tt");
        } catch(IOException e){
            throw new IOException("Exception occured in file reading part");
        }
    }

}
