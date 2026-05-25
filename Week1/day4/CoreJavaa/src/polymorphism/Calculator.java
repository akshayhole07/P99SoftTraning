package polymorphism;

public class Calculator {
    // Parent class methods to be overridden
    public int add(int a, int b) {
        System.out.println("Calculator: Adding integers");
        return a + b;
    }

    public double add(double a, double b) {
        System.out.println("Calculator: Adding doubles");
        return (a + b);
    }

    public int subtract(int a, int b) {
        System.out.println("Calculator: Subtracting integers");
        return a - b;
    }

    public int multiply(int a, int b) {
        System.out.println("Calculator: Multiplying integers");
        return a * b;
    }

    public static void main(String[] args) {
        Calculator c1 = new Calculator();
        int sum1 = c1.add(5, 10);
        double sum2 = c1.add(5.5, 10.5);
        int diff = c1.subtract(10, 5);
        int product = c1.multiply(5, 3);

        System.out.println("Sum of integers: " + sum1);
        System.out.println("Sum of doubles: " + sum2);
        System.out.println("Difference: " + diff);
        System.out.println("Product: " + product);
    }
}
