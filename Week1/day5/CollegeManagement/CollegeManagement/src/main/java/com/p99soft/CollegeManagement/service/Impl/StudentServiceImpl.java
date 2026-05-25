package com.p99soft.CollegeManagement.service.Impl;

import com.p99soft.CollegeManagement.dto.StudentDto;
import com.p99soft.CollegeManagement.entity.Student;
import com.p99soft.CollegeManagement.repository.StudentRepository;
import com.p99soft.CollegeManagement.service.PersonService;
import com.p99soft.CollegeManagement.service.StudentService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j

public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;

    private final PersonService personService;

    public StudentServiceImpl(StudentRepository studentRepository, @Lazy PersonService personService) {
        this.studentRepository = studentRepository;
        this.personService = personService;
    }


    @Override
    public StudentDto createStudent(Student student) {
        studentRepository.save(student);
        return new ModelMapper().map(student, StudentDto.class);
    }

    @Override
    public List<Student> getAllStudents() {
        List<Student> list =  studentRepository.findAll();
        log.info("List of students: {}", list);
        return list;
    }

    @Override
    public StudentDto getStudentById(long id) {
        Student student = studentRepository.findById(id).orElse(null);
        log.info("Student with id {}: {}", id, student);
        return new ModelMapper().map(student, StudentDto.class);
    }

    @Override
    public Student updateStudent(Student student,long id) {
        Student student1 = studentRepository.findById(id).orElse(null);
        Student updatedStudent = null;
        if (student1 != null) {
            student1.setName(student.getName());
            student1.setEmail(student.getEmail());
            student1.setCourse(student.getCourse());
            updatedStudent = studentRepository.save(student1);
        }
        return updatedStudent;
     }

    @Override
    public void deleteStudent(long id) {
        studentRepository.deleteById(id);
    }
}
