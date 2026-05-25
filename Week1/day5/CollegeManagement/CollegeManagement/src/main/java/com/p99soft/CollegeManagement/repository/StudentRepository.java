package com.p99soft.CollegeManagement.repository;

import com.p99soft.CollegeManagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

}
