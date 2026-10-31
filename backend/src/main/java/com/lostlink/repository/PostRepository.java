package com.lostlink.repository;
import com.lostlink.model.Post;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select p from Post p where p.id = :id")
  Optional<Post> findByIdForUpdate(@Param("id") Long id);

  List<Post> findTop50ByStatusOrderByCreatedAtDesc(String status);
  List<Post> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
  List<Post> findByStatusAndType(String status, String type);
}
