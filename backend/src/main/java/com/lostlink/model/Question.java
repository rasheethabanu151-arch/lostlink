package com.lostlink.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name = "questions") @Getter @Setter
public class Question {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @ManyToOne(optional = false) private Post post;
  private String type;
  private String text;
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "question_options")
  @Column(name = "option_text")
  private List<String> options = new ArrayList<>();
  private String answerHash;
}
