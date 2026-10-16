package com.lostlink.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity @Table(name = "claim_attempts", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "postId"}))
@Getter @Setter
public class ClaimAttempt {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private Long userId;
  private Long postId;
  private int failures;
  private LocalDateTime lockedUntil;
}
