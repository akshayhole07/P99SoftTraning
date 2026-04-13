package com.p99soft.CollegeManagement.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

     private String name;

     private String email;

     private String course;

}
