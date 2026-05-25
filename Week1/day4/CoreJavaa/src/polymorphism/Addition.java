package polymorphism;

public class Addition extends Calculator {


    @Override
    public int add(int a, int b) {
        System.out.println("Addition: Overriding add method for integers - adding with bonus +10");
        return a + b + 10;  // Adding a bonus to demonstrate method overriding
    }


    @Override
    public double add(double a, double b) {
        System.out.println("Addition: Overriding add method for doubles - adding with bonus +5.5");
        return a + b + 5.5;  // Adding a bonus to demonstrate method overriding
    }


    @Override
    public int subtract(int a, int b) {
        System.out.println("Addition: Overriding subtract method - subtracting with bonus multiplier *2");
        return (a - b) * 2;  // Multiplying by 2 to demonstrate method overriding
    }

    public static void main(String[] args) {

        Calculator calc = new Addition();

        int sum = calc.add(5, 10);
        double doubleSum = calc.add(5.5, 10.5);
        int diff = calc.subtract(10, 5);
        int product = calc.multiply(5, 3);  // This will use parent class method

        System.out.println("\n--- Results from Addition (Child Class) ---");
        System.out.println("Sum of integers: " + sum);
        System.out.println("Sum of doubles: " + doubleSum);
        System.out.println("Difference: " + diff);
        System.out.println("Product: " + product);
    }
}
