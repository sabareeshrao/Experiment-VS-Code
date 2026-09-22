package polymorphism;

import java.math.BigInteger;
import java.lang.*;
import java.time.*;


public class Calculator {

    public int add(int a, int b) throws Exception{
         System.out.println("Inside Int add");
         return a + b;
    }

    public double add(double a, double b) {
        System.out.println("Inside Double add");
        return a + b;
    } //Overloading

    public double add(double a, double b, int c) {
        System.out.println("Inside Double add");
        return a + b ;
    } //Overloading
//datatypes - int , float , double , String
    //Compiler -   javac - bytecode
    //java

}
