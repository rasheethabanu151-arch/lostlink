package com.lostlink.service;
import com.lostlink.dto.AuthDtos;
import com.lostlink.model.User;
import com.lostlink.repository.UserRepository;
import com.lostlink.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.Map;

@Service @RequiredArgsConstructor
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;

  public void register(AuthDtos.RegisterRequest r) {
    String email = r.email().trim().toLowerCase();
    if (users.existsByUsername(r.username())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
    if (users.existsByEmail(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    if (users.existsByContact(r.contact())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Contact already registered");
    User u = new User();
    u.setUsername(r.username());
    u.setEmail(email);
    u.setContact(r.contact());
    u.setLocation(r.location());
    u.setPasswordHash(encoder.encode(r.password()));
    users.save(u);
  }

  public Map<String, String> login(AuthDtos.LoginRequest r) {
    User u = users.findByEmail(r.email().trim().toLowerCase())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    if (u.getLockedUntil() != null && u.getLockedUntil().isAfter(LocalDateTime.now()))
      throw new ResponseStatusException(HttpStatus.LOCKED, "Account locked. Try again later");
    if (!encoder.matches(r.password(), u.getPasswordHash())) {
      u.setFailedLogins(u.getFailedLogins() + 1);
      if (u.getFailedLogins() >= 5) { u.setLockedUntil(LocalDateTime.now().plusMinutes(15)); u.setFailedLogins(0); }
      users.save(u);
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }
    u.setFailedLogins(0);
    u.setLockedUntil(null);
    users.save(u);
    return Map.of("token", jwt.generate(u.getUsername()), "username", u.getUsername(), "email", u.getEmail(), "contact", u.getContact());
  }
}
