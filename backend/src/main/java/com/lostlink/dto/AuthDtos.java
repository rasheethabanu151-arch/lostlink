package com.lostlink.dto;
import jakarta.validation.constraints.*;

public class AuthDtos {
  public record RegisterRequest(
    @NotBlank @Size(min = 3, max = 30) String username,
    @NotBlank @Email String email,
    @NotBlank @Pattern(regexp = "\\d{10}", message = "Contact must be 10 digits") String contact,
    @NotBlank String location,
    @NotBlank @Size(min = 6) String password) {}
  public record LoginRequest(@NotBlank String email, @NotBlank String password) {}
}
