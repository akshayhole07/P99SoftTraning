package Task;

public class Circle implements Shape {
    double radius;

    public Circle(String color, double radius) {
         this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}
