package Inheritance;

public class Cat extends Animal{
    public void sound() {
        System.out.println("meow");
    }

    public static void main(String a[]) {
        Cat c = new Cat();
        c.sound();
        c.eat();

    }
}
