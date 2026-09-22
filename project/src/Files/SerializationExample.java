package Files;

import java.io.*;

class Person implements Serializable {
    private static final long serialVersionUID = -1;
    private String name;//instance variables
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String toString() {
        return "Person{name='" + this.name + "', age = " + this.age + '}';
    }
}

public class SerializationExample {
    public static void main(String l[]) {
          Person person = new Person("Bob", 30);
          String fileName = "C:\\Users\\Poanselvi\\Desktop\\person.ser";

          //Serialization
          try(ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(fileName))) {
                out.writeObject(person);
//System.out.println("Object serialized" + person);

          } catch(IOException e) {
              e.printStackTrace();
          }

          //Deserialization
        try(ObjectInputStream in = new ObjectInputStream(new FileInputStream(fileName))) {
            Person deserializeObject = (Person)in.readObject();
            System.out.println("Object deserialized" + deserializeObject);

        } catch(IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
