package Collections;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

 class Employee {
    int id;
    String name;
    int sal;

    //public Employee() {}

   // public , private , protected , default

    protected Employee(int id, String name, int sal) {
        this.id = id;
        this.name = name;
        this.sal = sal;
    }

    public static void main (String a[]){
        Employee e1 = new Employee(1,"aa", 10000);
        Employee e2 = new Employee(2,"bb", 20000);
        Employee e3 = new Employee(3,"cc", 15000);

        List<Employee> employeeList = new ArrayList<>();
        employeeList.add(e1);
        employeeList.add(e2);
        employeeList.add(e3);

/*        Optional<Employee> e = employeeList.stream().filter(e11 -> e11.getSal() > 10000).findFirst();
        if(e.isPresent()) {
            System.out.println("First Employee" + e.get().getName());
        }*/
//Java8 stream
        List<Employee> sortedList =  employeeList.stream()
                .filter(e11 -> e11.getSal() > 10000)
                .sorted(Comparator.comparing(Employee::getSal).reversed())
                .toList();

        for(Employee sorted: sortedList){
            System.out.println("Sorted ...." + sorted.getName());
        }


      /*  Employee e = employeeList.stream().filter(e11 -> e11.getSal() > 10000).findFirst();

            System.out.println("First Employee" + e.getName());*/

    }

    private int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSal() {
        return sal;
    }

    public void setSal(int sal) {
        this.sal = sal;
    }
}
