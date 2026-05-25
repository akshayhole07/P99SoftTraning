package builder;

public class UserBuilder {
    private final String username;
    private final String email;
    private Integer age;
    private String phoneNumber;
    private String address;
    
    public UserBuilder(String username, String email) {
        this.username = username;
        this.email = email;
    }
    
    public UserBuilder age(int age) {
        this.age = age;
        return this;
    }
    
    public UserBuilder phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }
    
    public UserBuilder address(String address) {
        this.address = address;
        return this;
    }
    
    public User build() {
        return new User(username, email, age, phoneNumber, address);
    }
}
