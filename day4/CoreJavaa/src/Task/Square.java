package Task;

public class Square implements Shape {
    double side;

    public Square(String color, double side) {
         this.side = side;
    }

    @Override
    public double calculateArea() {
        return side * side;
    }
}
