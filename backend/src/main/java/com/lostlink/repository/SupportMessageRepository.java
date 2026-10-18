package com.lostlink.repository;
import com.lostlink.model.SupportMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {
  List<SupportMessage> findByUserIdOrderByCreatedAtDesc(Long userId);
  List<SupportMessage> findAllByOrderByCreatedAtDesc();
  long countByStatus(String status);
  long countByUserIdAndStatus(Long userId, String status);
}
