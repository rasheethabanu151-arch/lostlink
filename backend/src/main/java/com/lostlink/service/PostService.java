package com.lostlink.service;
import com.lostlink.dto.PostDtos.*;
import com.lostlink.model.*;
import com.lostlink.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor
public class PostService {
  private final PostRepository posts;
  private final QuestionRepository questions;
  private final UserRepository users;
  private final ClaimAttemptRepository attempts;
  private final PasswordEncoder encoder;

  private static String norm(String s) { return s == null ? "" : s.trim().toLowerCase(); }

  private User user(String username) {
    return users.findByUsername(username)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login required"));
  }

  @Transactional
  public Long create(String username, CreatePostRequest r) {
    User owner = user(username);
    long basic = r.questions().stream().filter(q -> q.type().equalsIgnoreCase("BASIC")).count();
    long unique = r.questions().stream().filter(q -> q.type().equalsIgnoreCase("UNIQUE")).count();
    if (basic < 1 || unique < 1)
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Add at least one basic and one unique question");
    Post p = new Post();
    p.setOwner(owner);
    p.setTitle(r.title());
    p.setCategory(r.category());
    p.setLocation(r.location());
    p.setDescription(r.description());
    posts.save(p);
    for (QuestionInput qi : r.questions()) {
      boolean inOptions = qi.options().stream().anyMatch(o -> norm(o).equals(norm(qi.correctAnswer())));
      if (!inOptions)
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Correct answer must be one of the options");
      Question q = new Question();
      q.setPost(p);
      q.setType(qi.type().toUpperCase());
      q.setText(qi.text());
      q.setOptions(new ArrayList<>(qi.options()));
      q.setAnswerHash(encoder.encode(norm(qi.correctAnswer())));
      questions.save(q);
    }
    return p.getId();
  }

  public List<PostSummary> list(String username) {
    return posts.findTop50ByStatusOrderByCreatedAtDesc("OPEN").stream()
      .map(p -> new PostSummary(p.getId(), p.getTitle(), p.getCategory(), p.getLocation(),
        p.getDescription(), p.getCreatedAt(), p.getOwner().getUsername().equals(username)))
      .toList();
  }

  @Transactional
  public void delete(String username, Long postId) {
    User u = user(username);
    Post p = posts.findById(postId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    if (!p.getOwner().getId().equals(u.getId()))
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only the finder can delete this post");
    attempts.deleteByPostId(postId);
    questions.deleteAll(questions.findByPostId(postId));
    posts.delete(p);
  }

  public List<QuestionView> questionsFor(Long postId) {
    posts.findById(postId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    List<QuestionView> out = new ArrayList<>();
    for (Question q : questions.findByPostId(postId)) {
      List<String> opts = new ArrayList<>(q.getOptions());
      Collections.shuffle(opts);
      out.add(new QuestionView(q.getId(), q.getType(), q.getText(), opts));
    }
    out.sort(Comparator.comparingInt(v -> v.type().equals("BASIC") ? 0 : 1));
    return out;
  }

  @Transactional
  public Map<String, Object> claim(String username, Long postId, ClaimRequest req) {
    User user = user(username);
    Post post = posts.findById(postId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    if (post.getOwner().getId().equals(user.getId()))
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot claim your own post");
    ClaimAttempt a = attempts.findByUserIdAndPostId(user.getId(), postId).orElseGet(() -> {
      ClaimAttempt n = new ClaimAttempt();
      n.setUserId(user.getId());
      n.setPostId(postId);
      return n;
    });
    if (a.getLockedUntil() != null && a.getLockedUntil().isAfter(LocalDateTime.now()))
      throw new ResponseStatusException(HttpStatus.LOCKED, "Too many attempts. Try again after 24 hours");

    List<Question> qs = questions.findByPostId(postId);
    Map<Long, String> given = new HashMap<>();
    for (AnswerInput ai : req.answers()) given.put(ai.questionId(), ai.answer());
    boolean ok = !qs.isEmpty();
    for (Question q : qs) {
      String ans = given.get(q.getId());
      if (ans == null || !encoder.matches(norm(ans), q.getAnswerHash())) ok = false;
    }

    Map<String, Object> result = new HashMap<>();
    if (ok) {
      a.setFailures(0);
      a.setLockedUntil(null);
      attempts.save(a);
      result.put("verified", true);
      result.put("finder", post.getOwner().getUsername());
      result.put("contact", post.getOwner().getContact());
      return result;
    }
    a.setFailures(a.getFailures() + 1);
    if (a.getFailures() >= 3) {
      a.setLockedUntil(LocalDateTime.now().plusHours(24));
      a.setFailures(0);
    }
    attempts.save(a);
    result.put("verified", false);
    result.put("message", "Verification failed");
    return result;
  }
}
