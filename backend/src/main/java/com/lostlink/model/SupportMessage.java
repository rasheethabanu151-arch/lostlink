package com.lostlink.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity @Table(name = "support_messages") @Getter @Setter
public class SupportMessage {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @ManyToOne(optional = false) private User user;
  @Column(length = 1000, nullable = false) private String message;
  @Column(length = 1000) private String reply;
  private String status = "OPEN";
  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime repliedAt;
}
