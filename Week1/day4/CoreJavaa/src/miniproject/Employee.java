package miniproject;

public class Employee {
    public long id ;
    public String name;
    public double salary;
    public  Employee(long id, String name, double salary){
        this.id = id;
        this.name = name;
        this.salary = salary;
    }

//    @Override
//    public String toString() {
//        return "Employee{" +
//                "id=" + id +
//                ", name='" + name + '\'' +
//                ", salary=" + salary +
//                '}';
//    }
}
