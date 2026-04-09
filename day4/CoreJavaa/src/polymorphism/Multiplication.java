package polymorphism;

public class Multiplication extends Calculator {


    @Override
    public int multiply(int a, int b) {
        System.out.println("Multiplication: Overriding multiply method - multiplying with bonus factor *3");
        return (a * b) * 3;  // Multiplying by 3 to demonstrate override
    }


    @Override
    public int add(int a, int b) {
        System.out.println("Multiplication: Overriding add method - performing multiplication instead");
        return a * b;  // Multiply instead of add
    }

    public static void main(String[] args) {
        Calculator calc = new Multiplication();

        int sum = calc.add(5, 10);
        int product = calc.multiply(5, 3);

        System.out.println("\n--- Results from Multiplication (Child Class) ---");
        System.out.println("Add result (actually multiplying): " + sum);
        System.out.println("Product result (with factor *3): " + product);
    }
}

