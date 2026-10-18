package com.lostlink.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public class PostDtos {
  public record QuestionInput(
    @NotBlank String type,
    @NotBlank String text,
    @NotNull @Size(min = 2, max = 5) List<@NotBlank String> options,
    @NotBlank String correctAnswer) {}
  public record CreatePostRequest(
    @NotBlank String type,
    @NotBlank String title,
    @NotBlank String category,
    @NotBlank String location,
    String description,
    @NotNull @Size(min = 2) List<@Valid QuestionInput> questions) {}
  public record PostSummary(Long id, String title, String category, String location,
                            String description, LocalDateTime createdAt, boolean mine,
                            String status, String claimedBy, String type) {}
  public record QuestionView(Long id, String type, String text, List<String> options) {}
  public record AnswerInput(Long questionId, String answer) {}
  public record ClaimRequest(@NotNull List<AnswerInput> answers) {}
  public record SuggestionGroup(PostSummary myPost, List<PostSummary> matches) {}
}
