package com.lostlink.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
  private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
  private final SecretKey key;
  public JwtService(@Value("${jwt.secret}") String secret) {
    if (secret.length() < 32) {
      logger.error("JWT_SECRET must be at least 32 characters long");
      throw new IllegalArgumentException("JWT_SECRET must be at least 32 characters long");
    }
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
  }
  public String generate(String username) { return generate(username, "USER"); }
  public String generate(String username, String role) {
    return Jwts.builder().subject(username).claim("role", role).issuedAt(new Date())
      .expiration(new Date(System.currentTimeMillis() + 24L * 60 * 60 * 1000))
      .signWith(key).compact();
  }
  public String extractUsername(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
  }
  public String extractRole(String token) {
    Object r = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get("role");
    return r == null ? "USER" : r.toString();
  }
}
