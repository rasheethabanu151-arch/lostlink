package com.lostlink.controller;
import com.lostlink.dto.PostDtos.*;
import com.lostlink.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/posts") @RequiredArgsConstructor
public class PostController {
  private final PostService svc;

  @PostMapping
  public Map<String, Object> create(Authentication auth, @Valid @RequestBody CreatePostRequest r) {
    return Map.of("id", svc.create(auth.getName(), r));
  }

  @GetMapping
  public List<PostSummary> list(Authentication auth) { return svc.list(auth.getName()); }

  @GetMapping("/mine")
  public List<PostSummary> mine(Authentication auth) { return svc.mine(auth.getName()); }

  @GetMapping("/suggestions")
  public List<SuggestionGroup> suggestions(Authentication auth) { return svc.suggestionsFor(auth.getName()); }

  @PutMapping("/{id}")
  public PostSummary update(Authentication auth, @PathVariable Long id, @Valid @RequestBody UpdatePostRequest r) {
    return svc.update(auth.getName(), id, r);
  }

  @DeleteMapping("/{id}")
  public Map<String, String> delete(Authentication auth, @PathVariable Long id) {
    svc.delete(auth.getName(), id);
    return Map.of("message", "Deleted");
  }

  @GetMapping("/{id}/questions")
  public List<QuestionView> questions(@PathVariable Long id) { return svc.questionsFor(id); }

  @PostMapping("/{id}/claim")
  public Map<String, Object> claim(Authentication auth, @PathVariable Long id, @Valid @RequestBody ClaimRequest r) {
    return svc.claim(auth.getName(), id, r);
  }
}
