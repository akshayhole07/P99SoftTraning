-- 1. Stored Procedures

-- Definition and purpose
-- Basic syntax and structure
-- Input/Output parameters
-- Control statements
-- Use cases
-- Assignment:

-- Create a procedure to insert data
-- Create a procedure for delete with validation
-- Create a procedure to fetch data using input parameters
use p99soft;

--create a sample table for demonstration
CREATE TABLE Persons (  
    ID INT PRIMARY KEY AUTO_INCREMENT,  
    Name VARCHAR(50),  
    Age INT  
);


--implementation of stored procedures in MySQL
-- Create a procedure with input parameters to insert data
CREATE PROCEDURE InsertPerson(
    IN personName VARCHAR(50),
    IN personAge INT
)
BEGIN
    INSERT INTO Persons (Name, Age)
    VALUES (personName, personAge);
END;

-- Call the procedure to insert a record


CALL InsertPerson('John Doe', 30);

SELECT * FROM Persons;

-- Create a procedure with input parameters to delete data with validation
CREATE PROCEDURE DeletePerson(
    IN personID INT
)
BEGIN
    DECLARE personExists INT;
    
    -- Check if the person exists
    SELECT COUNT(*) INTO personExists
    FROM Persons
    WHERE ID = personID;
    
    IF personExists > 0 THEN
        DELETE FROM Persons
        WHERE ID = personID;
    ELSE
        SELECT 'Person not found' AS Message;
    END IF;

END;

-- Call the procedure to delete a record
CALL DeletePerson(1);


-- Create a procedure to fetch data using input parameters
CREATE PROCEDURE GetPersonsByAge(
    IN minAge INT,
    IN maxAge INT
)
BEGIN
    SELECT * FROM Persons
    WHERE Age BETWEEN minAge AND maxAge;
END;

-- Call the procedure to fetch records
CALL GetPersonsByAge(20, 40);

