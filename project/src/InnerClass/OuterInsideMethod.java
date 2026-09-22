package InnerClass;

public class OuterInsideMethod {
    void show(){
        String localVar = "Hello from local variable";

        class Inner {
            void display() {
                System.out.println(localVar);
            }
        }

        Inner inner = new Inner();
        inner.display();
    }

    /*void show1(){
        System.out.println("show1");
    }*/

    public static void main(String a[]) {
        new OuterInsideMethod().show();
    }
}
