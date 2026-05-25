package com.p99soft.CollegeManagement.service;


import com.p99soft.CollegeManagement.dto.StudentDto;
import com.p99soft.CollegeManagement.entity.Student;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface StudentService {
    public StudentDto createStudent(Student student);
    public List<Student> getAllStudents();
    public StudentDto getStudentById(long id);
    public Student updateStudent(Student student,long id);
    public void deleteStudent(@PathVariable long id);
}
