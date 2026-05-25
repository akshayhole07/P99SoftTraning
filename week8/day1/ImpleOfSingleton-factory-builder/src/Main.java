import singleton.Logger;
import factory.Notification;
import factory.NotificationFactory;
import builder.User;
import builder.UserBuilder;

/**
 * Main class demonstrating three design patterns:
 * - Singleton Pattern (Logger)
 * - Factory Pattern (Notification System)
 * - Builder Pattern (User)
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Design Patterns Demonstration ===\n");
        
        // ===== Singleton Pattern: Logger =====
        System.out.println("--- Singleton Pattern: Logger ---");
        
        // Get Logger instance multiple times
        Logger logger1 = Logger.getInstance();
        Logger logger2 = Logger.getInstance();
        
        // Verify both references point to the same instance
        System.out.println("logger1 == logger2: " + (logger1 == logger2));
        
        // Log some messages
        logger1.log("Application started");
        logger2.log("This message is logged through the same instance");
        logger1.log("Singleton pattern demonstration complete");
        
        System.out.println();
        
        // ===== Factory Pattern: Notification System =====
        System.out.println("--- Factory Pattern: Notification System ---");
        
        // Create different notification types using the factory
        Notification emailNotification = NotificationFactory.createNotification("EMAIL");
        Notification smsNotification = NotificationFactory.createNotification("SMS");
        Notification pushNotification = NotificationFactory.createNotification("PUSH");
        
        // Send notifications
        emailNotification.send("Welcome to our service!");
        smsNotification.send("Your verification code is 123456");
        pushNotification.send("You have a new message");
        
        // Demonstrate error handling for unknown type
        try {
            Notification unknown = NotificationFactory.createNotification("UNKNOWN");
        } catch (IllegalArgumentException e) {
            System.out.println("Expected error: " + e.getMessage());
        }
        
        System.out.println();
        
        // ===== Builder Pattern: User =====
        System.out.println("--- Builder Pattern: User ---");
        
        // Build user with all optional fields
        User user1 = new UserBuilder("john_doe", "john@example.com")
                .age(30)
                .phoneNumber("555-1234")
                .address("123 Main St, Springfield")
                .build();
        System.out.println("User with all fields: " + user1);
        
        // Build user with only required fields
        User user2 = new UserBuilder("jane_smith", "jane@example.com")
                .build();
        System.out.println("User with required fields only: " + user2);
        
        // Build user with some optional fields
        User user3 = new UserBuilder("bob_jones", "bob@example.com")
                .age(25)
                .phoneNumber("555-5678")
                .build();
        System.out.println("User with some optional fields: " + user3);
        
        System.out.println();
        
        // Final log message
        Logger.getInstance().log("All design patterns demonstrated successfully");
        System.out.println("\n=== Demonstration Complete ===");
    }
}
