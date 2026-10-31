package com.lostlink.controller;

import com.lostlink.dto.ClaimDtos.ClaimView;
import com.lostlink.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {
  private final PostService service;

  @GetMapping("/mine")
  public List<ClaimView> mine(Authentication auth) {
    return service.claimsByClaimant(auth.getName());
  }

  @GetMapping("/found-by-me")
  public List<ClaimView> foundByMe(Authentication auth) {
    return service.claimsByFinder(auth.getName());
  }

  @GetMapping("/{id}")
  public ClaimView details(Authentication auth, @PathVariable Long id) {
    return service.claimDetails(auth.getName(), id);
  }
}
