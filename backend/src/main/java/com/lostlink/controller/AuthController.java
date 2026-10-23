package com.lostlink.controller;
import com.lostlink.dto.AuthDtos;
import com.lostlink.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class AuthController {
  private final AuthService auth;
  private final JdbcTemplate jdbcTemplate;

  @PostMapping("/auth/register")
  public Map<String, String> register(@Valid @RequestBody AuthDtos.RegisterRequest r) {
    auth.register(r);
    return Map.of("message", "Registered successfully");
  }

  @PostMapping("/auth/login")
  public Map<String, String> login(@Valid @RequestBody AuthDtos.LoginRequest r) {
    return auth.login(r);
  }

  @GetMapping("/health")
  public Map<String, String> health() { return Map.of("status", "ok"); }

  @GetMapping("/health/db")
  public Map<String, String> databaseHealth() {
    jdbcTemplate.queryForObject("SELECT 1", Integer.class);
    return Map.of("status", "ok");
  }
}
