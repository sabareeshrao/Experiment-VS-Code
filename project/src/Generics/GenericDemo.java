package Generics;

public class GenericDemo {
    public static void main(String y[]){
        Box<String>  stringBox = new Box<>();
        stringBox.set("Hello Generics");
        System.out.println(stringBox.get());

        Box<Integer> intBox = new Box<>();
        intBox.set(123);
        System.out.println(intBox.get());

    }
}
