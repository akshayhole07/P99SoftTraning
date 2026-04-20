-- Show databases
SHOW DATABASES;

-- Create and use database
CREATE DATABASE p99soft;
USE p99soft;

-- Create student table
CREATE TABLE student(
    id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    CONSTRAINT age_check CHECK (age >= 18 AND age <= 30)
);

-- Insert data
INSERT INTO student (id, name, age)
VALUES (2, 'Akshay', 22);

-- Replace (MySQL supports REPLACE)
REPLACE INTO student (id, name, age)
VALUES (1, 'Rohit', 21);

-- View data
SELECT * FROM student;

-- Insert another record
INSERT INTO student (id, name, age)
VALUES (4, 'Chaitanya', 22);

-- Describe table
DESC student;

-- Create course table
CREATE TABLE course (
    id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- Create enrollment table (many-to-many)
CREATE TABLE enrollment (
    student_id INT,
    course_id INT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (course_id) REFERENCES course(id)
);

-- Insert into course
INSERT INTO course (id, name)
VALUES 
(1, 'Mathematics'), 
(2, 'Physics');

-- Insert into enrollment
INSERT INTO enrollment (student_id, course_id)
VALUES 
(1, 1), 
(1, 2), 
(2, 1);

-- //use inner join to get student and their courses
SELECT s.name AS student_name, c.name AS course_name
FROM student s  
INNER JOIN enrollment e ON s.id = e.student_id
INNER JOIN course c ON e.course_id = c.id;


