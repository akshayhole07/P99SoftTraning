package Encapsulation;

public class Use {
     public static void main(String[] args) {
        Student s1 = new Student();
        s1.setRollNo(101);
        s1.setName("John");
        s1.setAge(20);

        System.out.println("Roll No: " + s1.getRollNo());
        System.out.println("Name: " + s1.getName());
        System.out.println("Age: " + s1.getAge());
    }
}