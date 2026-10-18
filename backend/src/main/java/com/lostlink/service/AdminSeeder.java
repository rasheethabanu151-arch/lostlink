package com.lostlink.service;
import com.lostlink.model.User;
import com.lostlink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor @Slf4j
public class AdminSeeder implements ApplicationRunner {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  @Value("${ADMIN_EMAIL:}") private String adminEmail;
  @Value("${ADMIN_PASSWORD:}") private String adminPassword;

  @Override
  public void run(ApplicationArguments args) {
    if (adminEmail.isBlank() || adminPassword.isBlank()) {
      log.info("ADMIN_EMAIL / ADMIN_PASSWORD not set - admin account not created");
      return;
    }
    String email = adminEmail.trim().toLowerCase();
    User u = users.findByEmail(email).orElseGet(() -> {
      User n = new User();
      n.setUsername(users.existsByUsername("admin") ? "admin" + (System.currentTimeMillis() % 10000) : "admin");
      n.setEmail(email);
      n.setContact("0000000000");
      n.setLocation("Admin");
      return n;
    });
    u.setRole("ADMIN");
    if (u.getPasswordHash() == null || !encoder.matches(adminPassword, u.getPasswordHash()))
      u.setPasswordHash(encoder.encode(adminPassword));
    users.save(u);
    log.info("Admin account ready: {}", email);
  }
}
