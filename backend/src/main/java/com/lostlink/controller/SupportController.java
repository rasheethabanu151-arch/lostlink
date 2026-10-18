package com.lostlink.controller;
import com.lostlink.model.SupportMessage;
import com.lostlink.model.User;
import com.lostlink.repository.SupportMessageRepository;
import com.lostlink.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;

@RestController @RequestMapping("/api/support") @RequiredArgsConstructor
public class SupportController {
  private final SupportMessageRepository messages;
  private final UserRepository users;

  public record SendRequest(
    @NotBlank(message = "Please type your message")
    @Size(max = 1000, message = "Message is too long (max 1000 characters)") String message) {}
  public record MyMessage(Long id, String message, String reply, String status,
                          LocalDateTime createdAt, LocalDateTime repliedAt) {}

  private User me(Authentication auth) {
    return users.findByUsername(auth.getName())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required"));
  }
  private static MyMessage view(SupportMessage m) {
    return new MyMessage(m.getId(), m.getMessage(), m.getReply(), m.getStatus(), m.getCreatedAt(), m.getRepliedAt());
  }

  @PostMapping
  public MyMessage send(@Valid @RequestBody SendRequest r, Authentication auth) {
    User u = me(auth);
    if (messages.countByUserIdAndStatus(u.getId(), "OPEN") >= 5)
      throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
        "You already have 5 messages waiting for a reply. Please wait for the support team to respond.");
    SupportMessage m = new SupportMessage();
    m.setUser(u);
    m.setMessage(r.message().trim());
    return view(messages.save(m));
  }

  @GetMapping("/mine")
  public List<MyMessage> mine(Authentication auth) {
    return messages.findByUserIdOrderByCreatedAtDesc(me(auth).getId()).stream().map(SupportController::view).toList();
  }
}
