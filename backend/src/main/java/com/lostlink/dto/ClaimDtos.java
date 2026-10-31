package com.lostlink.dto;

import java.time.LocalDateTime;

public class ClaimDtos {
  public record ClaimView(
    Long id,
    Long originalPostId,
    String itemTitle,
    String itemCategory,
    String itemLocation,
    Long finderId,
    String finderName,
    String finderContact,
    Long claimantId,
    String claimantName,
    LocalDateTime verifiedAt,
    String status
  ) {}
}
