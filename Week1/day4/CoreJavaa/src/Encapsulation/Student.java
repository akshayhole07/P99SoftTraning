package Encapsulation;

public class Student {
    private int rollNo;
    private String name;
    private int Age;

    public Student(int roll, String name, int age){
        this.Age = age;
        this.name =name;
        this.rollNo = roll;
    }

    public Student(){}
    //write getter and setter method for rollNo, name and Age
    public int getRollNo() {
        return rollNo;
    }
    public void setRollNo(int rollNo) {
        this.rollNo = rollNo;
    }
    public int getAge() {
        return Age;
    }
    public void setAge(int Age){
        this.Age = Age;
    }

    public String getName() {
        return name;
    }
    public void setName(String name){
        this.name = name;
    }

   public static void main(String[] args) {

    }
}