package singleton;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Logger class implementing the Singleton pattern.
 * Ensures only one instance exists throughout the application.
 * Writes log messages to both console and a file.
 */
public class Logger {
    private static Logger instance;
    private static final String LOG_FILE = "application.log";
    
    /**
     * Private constructor to prevent external instantiation.
     * This enforces the singleton pattern by making it impossible
     * to create instances using 'new Logger()'.
     */
    private Logger() {
        // Private constructor prevents instantiation
    }
    
    /**
     * Returns the single instance of Logger.
     * Creates the instance on first call (lazy initialization).
     * 
     * @return the singleton Logger instance
     */
    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }
    
    /**
     * Logs a message to both console and file.
     * Writes to System.out and appends to application.log file.
     * 
     * @param message the message to log
     */
    public void log(String message) {
        // Write to console
        System.out.println(message);
        
        // Append to file
        try (FileWriter fileWriter = new FileWriter(LOG_FILE, true);
             PrintWriter printWriter = new PrintWriter(fileWriter)) {
            printWriter.println(message);
        } catch (IOException e) {
            System.err.println("Error writing to log file: " + e.getMessage());
        }
    }
}
