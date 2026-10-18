package com.lostlink.controller;
import com.lostlink.model.*;
import com.lostlink.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.*;

@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
public class AdminController {
  private final UserRepository users;
  private final PostRepository posts;
  private final ClaimAttemptRepository attempts;
  private final SupportMessageRepository messages;

  public record PostRow(Long id, String title, String type, String category, String location,
                        String status, String owner, String claimedBy, LocalDateTime createdAt) {}
  public record AttemptRow(String user, String post, int failures, LocalDateTime lockedUntil) {}
  public record MsgRow(Long id, String username, String email, String message, String reply,
                       String status, LocalDateTime createdAt, LocalDateTime repliedAt) {}
  public record ReplyRequest(
    @NotBlank(message = "Please type a reply")
    @Size(max = 1000, message = "Reply is too long (max 1000 characters)") String reply) {}

  private static boolean is(String a, String b) { return a != null && a.equalsIgnoreCase(b); }

  @GetMapping("/stats")
  public Map<String, Object> stats() {
    List<Post> all = posts.findAll();
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("users", users.findAll().stream().filter(u -> !"ADMIN".equals(u.getRole())).count());
    m.put("lostPosts", all.stream().filter(p -> is(p.getType(), "LOST")).count());
    m.put("foundPosts", all.stream().filter(p -> is(p.getType(), "FOUND")).count());
    m.put("claimed", all.stream().filter(p -> is(p.getStatus(), "CLAIMED")).count());
    m.put("failedClaimUsers", attempts.findAll().stream().filter(a -> a.getFailures() > 0).count());
    m.put("openMessages", messages.countByStatus("OPEN"));
    m.put("totalMessages", messages.count());
    return m;
  }

  @GetMapping("/posts")
  public List<PostRow> allPosts() {
    return posts.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(p -> new PostRow(
      p.getId(), p.getTitle(), p.getType(), p.getCategory(), p.getLocation(), p.getStatus(),
      p.getOwner().getUsername(),
      p.getClaimedBy() == null ? null : p.getClaimedBy().getUsername(),
      p.getCreatedAt())).toList();
  }

  @GetMapping("/claim-attempts")
  public List<AttemptRow> claimAttempts() {
    return attempts.findAll().stream().filter(a -> a.getFailures() > 0).map(a -> new AttemptRow(
      users.findById(a.getUserId()).map(User::getUsername).orElse("?"),
      posts.findById(a.getPostId()).map(Post::getTitle).orElse("(deleted post)"),
      a.getFailures(), a.getLockedUntil())).toList();
  }

  @GetMapping("/messages")
  public List<MsgRow> allMessages() {
    return messages.findAllByOrderByCreatedAtDesc().stream().map(m -> new MsgRow(
      m.getId(), m.getUser().getUsername(), m.getUser().getEmail(), m.getMessage(), m.getReply(),
      m.getStatus(), m.getCreatedAt(), m.getRepliedAt())).toList();
  }

  @PostMapping("/messages/{id}/reply")
  public Map<String, String> reply(@PathVariable Long id, @Valid @RequestBody ReplyRequest r) {
    SupportMessage m = messages.findById(id)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found"));
    m.setReply(r.reply().trim());
    m.setStatus("REPLIED");
    m.setRepliedAt(LocalDateTime.now());
    messages.save(m);
    return Map.of("message", "Reply sent");
  }
}
