package Inheritance;

public class Dog extends Animal{
    public void sound() {
        System.out.println("bark");
    }

    public static void main(String a[]) {
        Dog c = new Dog();
        c.sound();
        c.eat();

    }
}
