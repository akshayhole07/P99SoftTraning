package miniproject;

import java.util.ArrayList;
import java.util.Scanner;

public class EmployeeManager {
    private static ArrayList<Employee> employees = new ArrayList<>();  // FIX: Initialize here


     public static Employee addEmployee( String name , double salary){
         int id = employees.size()+1;
        Employee e = new Employee(id, name, salary);
        employees.add(e);
        return e;
    }
    public static void deleteEmployee(int  i){
         try {
             if (i < 0 || i >= employees.size()+1) {
                 throw new EmployeeNotFoundException("Employee Employee with id:"+(i)+" not present in database");
             }
             Employee e = employees.get(i-1);
             System.out.print("Deleting Employee:");
             System.out.println(" ID:"+e.id+", Name: "+e.name+", salary: "+e.salary);
             employees.remove(i-1);
         }catch (EmployeeNotFoundException e){
             System.out.println(e.getLocalizedMessage());
         }
    }
    public static void displayEmployee(){
        for (Employee e : employees) {
            System.out.println("Employee ID:"+e.id+", Name: "+e.name+", salary: "+e.salary);
        }
    }


    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
         //use switch case to add , delete and display employee
        while(true) {
            System.out.println("Employee Management System");
            System.out.println("1. Add Employee");
            System.out.println("2. Delete Employee");
            System.out.println("3. Display Employees");
            int n = sc.nextInt();
            switch (n) {
                case 1:

                    sc.nextLine(); // Consume newline
                    System.out.println("Enter Employee Name:");
                    String name = sc.nextLine();
                    System.out.println("Enter Employee Salary:");
                    double salary = sc.nextDouble();
                    addEmployee( name, salary);
                    break;
                case 2:

                        System.out.println("Enter Employee Index to Delete:");
                        int index = sc.nextInt();
                        deleteEmployee(index);


                    break;

                case 3:
                    displayEmployee();
                    break;
                default:
                    System.out.println("Invalid option");

            }
        }

    }
}
