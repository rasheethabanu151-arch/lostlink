package com.lostlink.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "verified_claims", uniqueConstraints = {
  @UniqueConstraint(columnNames = "original_post_id")
})
@Getter
@Setter
public class VerifiedClaim {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "original_post_id", nullable = false)
  private Long originalPostId;

  @Column(nullable = false)
  private String itemTitle;

  @Column(nullable = false)
  private String itemCategory;

  @Column(nullable = false)
  private String itemLocation;

  @Column(nullable = false)
  private Long finderId;

  @Column(nullable = false)
  private String finderName;

  @Column(nullable = false, length = 20)
  private String finderContact;

  @Column(nullable = false)
  private Long claimantId;

  @Column(nullable = false)
  private String claimantName;

  @Column(nullable = false)
  private LocalDateTime verifiedAt;

  @Column(nullable = false, length = 20)
  private String status;
}
