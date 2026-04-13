package com.p99soft.CollegeManagement.service.Impl;

import com.p99soft.CollegeManagement.repository.StudentRepository;
import com.p99soft.CollegeManagement.service.PersonService;
import com.p99soft.CollegeManagement.service.StudentService;
import org.springframework.stereotype.Service;

@Service
public class PersonImpl implements PersonService {
    private final StudentRepository studentRepository;
    private final StudentService studentService;

    public PersonImpl(StudentRepository studentRepository, StudentService studentService) {
        this.studentRepository = studentRepository;
        this.studentService = studentService;
    }

}
