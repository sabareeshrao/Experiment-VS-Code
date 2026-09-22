package Generics;

//public class Calculator<T extends Number> {
public class Calculator<T extends Number> {
    private T value;

    public Calculator(T value){
        this.value = value;
    }

    public double square() {
        return value.doubleValue() * value.doubleValue();
    }
}
