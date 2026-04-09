package Task;

public class Rectangle implements Shape {
    double length;
    double width;

    public Rectangle(String color, double length, double width) {
        this.length = length;
        this.width = width;
    }

    @Override
    public double calculateArea() {
        return length * width;
    }
}
