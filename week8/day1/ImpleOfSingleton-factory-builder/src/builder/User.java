package builder;

public class User {
    private final String username;
    private final String email;
    private final Integer age;
    private final String phoneNumber;
    private final String address;
    
    User(String username, String email, Integer age, String phoneNumber, String address) {
        this.username = username;
        this.email = email;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }
    
    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", age=" + age +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}
