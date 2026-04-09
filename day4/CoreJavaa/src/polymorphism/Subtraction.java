package polymorphism;

public class Subtraction extends Calculator {


    @Override
    public int add(int a, int b) {
        System.out.println("Subtraction: Overriding add method - actually performing subtraction instead");
        return a - b;
    }


    @Override
    public int subtract(int a, int b) {
        System.out.println("Subtraction: Overriding subtract method - adding instead of subtracting");
        return a + b;
    }

    public static void main(String[] args) {
        Calculator calc = new Subtraction();

        int result1 = calc.add(20, 5);
        int result2 = calc.subtract(20, 5);

        System.out.println("\n--- Results from Subtraction (Child Class) ---");
        System.out.println("Add result: " + result1);
        System.out.println("Subtract result: " + result2);
    }
}

