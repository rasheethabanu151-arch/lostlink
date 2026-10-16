package com.lostlink.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
  private final SecretKey key;
  public JwtService(@Value("${jwt.secret}") String secret) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
  }
  public String generate(String username) {
    return Jwts.builder().subject(username).issuedAt(new Date())
      .expiration(new Date(System.currentTimeMillis() + 24L * 60 * 60 * 1000))
      .signWith(key).compact();
  }
  public String extractUsername(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
  }
}
