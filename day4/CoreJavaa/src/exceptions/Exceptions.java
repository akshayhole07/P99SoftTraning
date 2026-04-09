package exceptions;

public class Exceptions {


    static void main(){
        try {
            int a = 12 / 0;
        } catch (ArithmeticException e) {
            System.out.println(e.getLocalizedMessage());
        } catch (Exception e) {
            System.out.println(e.getLocalizedMessage());
        } finally {
            System.out.println("finally ");
        }

        try {
            int age = 0;
            if (age < 18) {
                throw new InvalidAgeException("Age must be at least 18 to register.");
            }
        } catch (InvalidAgeException e) {
            System.out.println(e.getLocalizedMessage());
        }

    }
}
