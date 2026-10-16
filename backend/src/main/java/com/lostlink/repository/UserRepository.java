package com.lostlink.repository;
import com.lostlink.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
  boolean existsByUsername(String username);
  boolean existsByEmail(String email);
  boolean existsByContact(String contact);
  Optional<User> findByUsername(String username);
  Optional<User> findByEmail(String email);
}
