package Reflection;

public class Person {
    private String name;
    private int age;

    public Person() {

    }

    public Person(String name, int age){
        this.name = name;
        this.age = age;
    }

    private void sayHello(){
        System.out.println("Hello name " + this.name);
    }
}
