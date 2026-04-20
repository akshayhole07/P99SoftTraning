-- . Triggers

-- What is trigger 
-- Types of triggers 
-- Difference from stored procedures
-- Use cases 
-- Advantages and limitations

-- Assignment:

-- Create a trigger to log inserted records
-- Create a trigger to prevent the invalid insert
-- Create a trigger for restrict delete
-- Create a trigger to update another table automatically audit updates

use p99soft;
-- Create a sample table for demonstration
CREATE TABLE Employees (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50),
    Salary DECIMAL(10, 2)
);

-- Create a trigger to log inserted records
CREATE TABLE EmployeeLog (
    LogID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT,
    Action VARCHAR(50),
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER AfterEmployeeInsert
AFTER INSERT ON Employees   
FOR EACH ROW
BEGIN

    INSERT INTO EmployeeLog (EmployeeID, Action)
    VALUES (NEW.ID, 'Inserted');
END;

-- Insert a record to see the trigger in action
INSERT INTO Employees (Name, Salary) VALUES ('Akshay', 50000.00);
SELECT * FROM EmployeeLog;

-- Create a trigger to prevent invalid insert (e.g., Salary must be positive)
CREATE TRIGGER BeforeEmployeeInsert
BEFORE INSERT ON Employees
FOR EACH ROW
BEGIN

    IF NEW.Salary <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Salary must be positive';
    END IF;
END;
-- Try to insert an invalid record
INSERT INTO Employees (Name, Salary) VALUES ('Rohit', -1000.00);


-- Create a trigger for restrict delete (e.g., prevent deletion if Salary > 40000)
CREATE TRIGGER BeforeEmployeeDelete
BEFORE DELETE ON Employees
FOR EACH ROW
BEGIN

    IF OLD.Salary > 40000 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete employee with salary greater than 40000';
    END IF;
END;
-- Try to delete a record that violates the condition
DELETE FROM Employees WHERE Name = 'Akshay';

-- Create a trigger to update another table automatically (e.g., audit updates)
CREATE TABLE EmployeeAudit (
    AuditID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT,
    OldSalary DECIMAL(10, 2),
    NewSalary DECIMAL(10, 2),
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER AfterEmployeeUpdate
AFTER UPDATE ON Employees
FOR EACH ROW
BEGIN

    IF OLD.Salary != NEW.Salary THEN
        INSERT INTO EmployeeAudit (EmployeeID, OldSalary, NewSalary)
        VALUES (OLD.ID, OLD.Salary, NEW.Salary);
    END IF;
END;

-- Update a record to see the trigger in action
UPDATE Employees SET Salary = 55000.00 WHERE Name = 'Akshay';
SELECT * FROM EmployeeAudit;