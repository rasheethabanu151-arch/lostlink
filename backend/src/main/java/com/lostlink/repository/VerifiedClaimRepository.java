package com.lostlink.repository;

import com.lostlink.model.VerifiedClaim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VerifiedClaimRepository extends JpaRepository<VerifiedClaim, Long> {
  Optional<VerifiedClaim> findByOriginalPostId(Long originalPostId);
  List<VerifiedClaim> findByClaimantIdOrderByVerifiedAtDesc(Long claimantId);
  List<VerifiedClaim> findByFinderIdOrderByVerifiedAtDesc(Long finderId);
}
