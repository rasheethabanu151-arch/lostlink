package com.lostlink.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity @Table(name = "posts") @Getter @Setter
public class Post {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @ManyToOne(optional = false) private User owner;
  @ManyToOne private User claimedBy;
  private String title;
  private String category;
  private String location;
  @Column(length = 500) private String description;
  private String status = "OPEN";
  @Column(nullable = false, length = 20)
  private String type = "FOUND";
  private LocalDateTime createdAt = LocalDateTime.now();
}
