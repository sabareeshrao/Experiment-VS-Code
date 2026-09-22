package polymorphism;

public class ScientificCalculator extends Calculator{
    @Override
    public int add(int number1, int number2) throws ArithmeticException{
        System.out.println("Inside Sc addition");
       // int num = number1/0;
        return number1 + number2 ;
    }

    public static void main(String a[]) throws Exception {
        Calculator c = new Calculator();
      //  c.add(5, 6); //calculator
        c.add(9.0, 12.0);

        ScientificCalculator sc = new ScientificCalculator();
        sc.add(4,3); //scientific caluclator

        Calculator calc = new ScientificCalculator();
        calc.add(5, 4);
       // ScientificCalculator calc1 = new Calculator();
       // calc.add(23, 21);

        Calculator calc1 = new Calculator();
      //  calc1.add(23, 21);

    }

    public static void main(int a[]){}
}


