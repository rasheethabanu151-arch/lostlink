package com.lostlink.repository;
import com.lostlink.model.ClaimAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClaimAttemptRepository extends JpaRepository<ClaimAttempt, Long> {
  Optional<ClaimAttempt> findByUserIdAndPostId(Long userId, Long postId);
  void deleteByPostId(Long postId);
}
