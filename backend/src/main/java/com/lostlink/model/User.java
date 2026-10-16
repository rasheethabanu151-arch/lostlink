package com.lostlink.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity @Table(name = "users") @Getter @Setter
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(unique = true, nullable = false) private String username;
  @Column(unique = true, nullable = false) private String email;
  @Column(unique = true, nullable = false) private String contact;
  private String location;
  @Column(nullable = false) private String passwordHash;
  private int failedLogins;
  private LocalDateTime lockedUntil;
}
