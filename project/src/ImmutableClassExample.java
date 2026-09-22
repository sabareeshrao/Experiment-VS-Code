import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

public final class ImmutableClassExample {
    //String , float , double , int, boolean , BigInteger , Integer, Double , Boolean
    //primitive type , Wrapper class

     private final String studentName;//instance variables
     private final List<String> members;

     public ImmutableClassExample(String studentName, List<String> members){
         this.studentName = studentName;
         this.members = members;
     }

     public String getStudentName(){
         return studentName;
     }

     public List<String> getMembers() {
         return Collections.unmodifiableList(members);
     }

     public static void main(String a[]){
         List<String> devs = new ArrayList<>(List.of("Ali", "Bobby"));
         ImmutableClassExample xx = new ImmutableClassExample("Apoo", devs);
         devs.add("Charlie");//LIst only
         xx.getMembers().add("Den");
         System.out.println("xx" + xx.getMembers());
         System.out.println("devs" + devs);
     }

}
/*
//immutable - Usuage
final Class Student{
   final String name;
   final  int age;
    final int marks;

    public Student(String name, int age, int marks) {
        this.name = name;
        this.age = age;
        this.marks = marks ;
    }
    getName(){
       retun this.name;
    }

    getAge() {
        return this.age;
    }
        }
        main() {
            Student s = new Student("lasya", 16, 95);
            Student s1 = new Student("lasyqwytrwqa", 16, 95);
            // Student s1 = new Student("lasya", 16, 95);
            HashMap<Student,Integer> -> student , marks
                //While modifying ,     s -> 98
            HashMap<Integer,Student> -> age , student

        }

*/