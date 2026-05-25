package polymorphism;

/**
 * Main class to demonstrate Method Overriding in Polymorphism
 * This class shows how different child classes override parent class methods
 * with different implementations
 */
public class PolymorphismDemo {

    public static void main(String[] args) {
        System.out.println("===== METHOD OVERRIDING DEMONSTRATION =====\n");


        System.out.println("1. Parent class (Calculator) object:");
        Calculator calc1 = new Calculator();
        System.out.println("   Result of add(5, 10): " + calc1.add(5, 10));
        System.out.println("   Result of subtract(10, 5): " + calc1.subtract(10, 5));
        System.out.println("   Result of multiply(5, 3): " + calc1.multiply(5, 3));


        System.out.println("\n2. Addition class (extends Calculator) - overrides add and subtract:");
        Calculator calc2 = new Addition();
        System.out.println("   Result of add(5, 10): " + calc2.add(5, 10));
        System.out.println("   Result of subtract(10, 5): " + calc2.subtract(10, 5));
        System.out.println("   Result of multiply(5, 3): " + calc2.multiply(5, 3));


        System.out.println("\n3. Subtraction class (extends Calculator) - overrides add and subtract:");
        Calculator calc3 = new Subtraction();
        System.out.println("   Result of add(20, 5): " + calc3.add(20, 5));
        System.out.println("   Result of subtract(20, 5): " + calc3.subtract(20, 5));


        System.out.println("\n4. Multiplication class (extends Calculator) - overrides add and multiply:");
        Calculator calc4 = new Multiplication();
        System.out.println("   Result of add(5, 10): " + calc4.add(5, 10));
        System.out.println("   Result of multiply(5, 3): " + calc4.multiply(5, 3));


        System.out.println("\n5. Polymorphic behavior using Calculator array:");
        Calculator[] calculators = {calc1, calc2, calc3, calc4};
        int a = 10, b = 5;

        System.out.println("\n   Calling add(" + a + ", " + b + ") on all calculators:");
        for (int i = 0; i < calculators.length; i++) {
            int result = calculators[i].add(a, b);
            System.out.println("   Calculator[" + i + "] result: " + result);
        }
    }
}

