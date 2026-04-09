package inheritance;


class Dog extends Animal {
    public void bark() {
        System.out.println("Dog is barking");
    }
}
public class Animal {
    public void eat() {
        System.out.println("Animal is eating");
    }
    public void sleep() {
        System.out.println("Animal is sleeping");
    }




static void main() {
    Dog dog = new Dog();
    dog.eat(); // Inherited method
    dog.sleep(); // Inherited method
    dog.bark(); // Dog's own method
}
}