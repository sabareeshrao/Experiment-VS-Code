package Generics;

public class BoundedExample {
    public static void main(String a[]) {
        Calculator<Integer> calc = new Calculator<>(5);
        System.out.println("Calculate square for integer " + calc.square());

        Calculator<Double> calcDouble = new Calculator<>(5.5);
        System.out.println("Calculate square for integer " + calcDouble.square());

      //  Calculator<String> calcString = new Calculator<>("Hi");
    }
}
