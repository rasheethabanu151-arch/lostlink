package com.lostlink.controller;
import com.lostlink.dto.AuthDtos;
import com.lostlink.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class AuthController {
  private final AuthService auth;

  @PostMapping("/auth/register")
  public Map<String, String> register(@Valid @RequestBody AuthDtos.RegisterRequest r) {
    auth.register(r);
    return Map.of("message", "Registered successfully");
  }

  @PostMapping("/auth/login")
  public Map<String, String> login(@Valid @RequestBody AuthDtos.LoginRequest r) {
    return Map.of("token", auth.login(r));
  }

  @GetMapping("/health")
  public Map<String, String> health() { return Map.of("status", "ok"); }
}
