package InnerClass;

public class OuterStatic {
    private static String message = "This is Outer static class";
    double r = 10.9;

    static class Inner {
        void display() {
            System.out.println(message);
        }
    }

    public static void main(String a[]){
        OuterStatic.Inner inner = new OuterStatic.Inner();
        inner.display();
    }

    OuterStatic o = new OuterStatic();

    OuterStatic o1 = new OuterStatic();

}
