package Reflection;

public class Reflection {
    public static void main(String a[]){
        Person person = new Person();
        Class<?> cls = person.getClass();
        System.out.println("Class name"+ cls.getName());
        System.out.println("Pkg name"+ cls.getPackageName());

    }
}
