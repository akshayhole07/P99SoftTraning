package com.p99soft.CollegeManagement.controller;

import com.p99soft.CollegeManagement.dto.StudentDto;
import com.p99soft.CollegeManagement.entity.Student;
import com.p99soft.CollegeManagement.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/api/students")

public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/create")
    public StudentDto createStudent(@RequestBody Student student) {
        return studentService.createStudent(student);
    }

    @GetMapping("/get")
    public List<Student> getAllStudents(){
        return studentService.getAllStudents();

    }

    @GetMapping("/get/{id}")
    public StudentDto getStudentById(@PathVariable long id) {
        return  studentService.getStudentById(id);
    }

    @PutMapping("/update/{id}")
    public Student updateStudent(@RequestBody Student student, @PathVariable long id) {
       return studentService.updateStudent(student,id);
    }
    @DeleteMapping("/delete/{id}")
    public String deleteStudent(@PathVariable long id) {
        studentService.deleteStudent(id);
        return "Student with id " + id + " has been deleted.";
    }

}
