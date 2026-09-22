package Collections;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

class Student {
    String name;
    int marks;

    Student(String name , int marks) {
        this.name = name;
        this.marks = marks;

    }

}

//{name: lasya, marks: 98}
//{name: selvi, marks:95}
public class StudentExample {
    public static void main(String a[]){
        List<Student> studentList = new ArrayList<>();
        studentList.add(new Student("Alice", 80));
        studentList.add(new Student("Bob", 96));
        studentList.add(new Student("Charlie", 60));
        studentList.sort((a1, b1) -> a1.marks - b1.marks) ;//lambda expression
        //System.out.println(studentList);
        for(Student s : studentList){
            System.out.println(s.name + "mark" + s.marks);
        }
    }
}




