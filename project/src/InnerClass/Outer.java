package InnerClass;

public class Outer {
    private String message = "This is Outer";

    class Inner {
        void display() {
            System.out.println(message);
        }
    }

    public static void main(String a[]){
        Outer outer = new Outer();
        Outer.Inner inner = outer.new Inner();
        inner.display();
    }
}
