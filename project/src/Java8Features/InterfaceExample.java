package Java8Features;

public interface InterfaceExample {
    default void start() {
        System.out.println("Test Java 8 ");
    }

    static void stop() {
        System.out.println("Stopped");
    }
}

class ConcreteClass implements InterfaceExample {

    public static void main(String a[]) {
        InterfaceExample ie = new ConcreteClass();
      //  InterfaceExample ie = new InterfaceExample();
        ie.start();


        InterfaceExample ie1 = new ConcreteClass();
        ie1.start();

        InterfaceExample ie2 = new ConcreteClass();
        ie2.start();

        InterfaceExample.stop();

       // ConcreteClass.test();
        test(); //inside the class


    }

    static void test() {
        System.out.println("Test static in concrete class");
    }
}

class Subclass extends ConcreteClass{

   // ConcreteClass.test();
}