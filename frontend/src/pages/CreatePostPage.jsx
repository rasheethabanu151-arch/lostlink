import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Header from "../components/Header";
import LinkyAvatar from "../components/LinkyAvatar";
import LinkyBubble from "../components/LinkyBubble";
import PageIllustration from "../components/PageIllustration";
import SafetyNotice from "../components/SafetyNotice";
import {
  Tag,
  MapPin,
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const CATEGORIES = ["Phone", "Wallet", "Keys", "Bag", "Documents", "Other"];
const ICONS = { Phone: "📱", Wallet: "👛", Keys: "🔑", Bag: "🎒", Documents: "🪪", Other: "📦" };

const createBlankQuestion = (type = "BASIC") => ({
  type,
  text: "",
  count: 4,
  options: ["", "", "", ""],
  correctIdx: -1,
});

export default function CreatePostPage() {
  const nav = useNavigate();
  const [postData, setPostData] = useState({
    type: "FOUND",
    title: "",
    category: "Phone",
    location: "",
    description: "",
  });

  const [questions, setQuestions] = useState([
    createBlankQuestion("BASIC"),
    createBlankQuestion("UNIQUE"),
  ]);

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateQuestion = (idx, patch) => {
    setQuestions(questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  };

  const handleOptionChange = (qIdx, optIdx, val) => {
    const q = questions[qIdx];
    const newOptions = [...q.options];
    newOptions[optIdx] = val;
    updateQuestion(qIdx, { options: newOptions });
  };

  const handleOptionCountChange = (qIdx, newCount) => {
    const count = Number(newCount);
    const q = questions[qIdx];
    const newOptions = [...q.options];
    while (newOptions.length < count) newOptions.push("");
    updateQuestion(qIdx, {
      count,
      options: newOptions,
      correctIdx: q.correctIdx >= count ? -1 : q.correctIdx,
    });
  };

  const addQuestion = (type) => {
    setQuestions([...questions, createBlankQuestion(type)]);
  };

  const removeQuestion = (idx) => {
    if (questions.length <= 2) {
      setErrorMsg("A minimum of 2 questions (at least 1 Basic and 1 Unique) is required for safe verification.");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const validate = () => {
    if (!postData.title.trim()) return "Please enter a descriptive item title.";
    if (!postData.location.trim()) return "Please enter the city or location.";

    const basicCount = questions.filter((q) => q.type === "BASIC").length;
    const uniqueCount = questions.filter((q) => q.type === "UNIQUE").length;
    if (basicCount < 1 || uniqueCount < 1) {
      return "You must include at least one Basic question and one Unique question.";
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        return `Please fill in Question #${i + 1}.`;
      }
      const activeOptions = q.options.slice(0, q.count);
      for (let j = 0; j < activeOptions.length; j++) {
        if (!activeOptions[j].trim()) {
          return `Please fill in Option ${j + 1} for Question #${i + 1}.`;
        }
      }
      if (q.correctIdx < 0 || q.correctIdx >= q.count) {
        return `Please select which option is the correct answer for Question #${i + 1} (click the circle next to it).`;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const validationErr = validate();
    if (validationErr) {
      setErrorMsg(validationErr);
      return;
    }

    const payloadQuestions = questions.map((q) => {
      const options = q.options.slice(0, q.count).map((o) => o.trim());
      return {
        type: q.type,
        text: q.text.trim(),
        options,
        correctAnswer: options[q.correctIdx] || "",
      };
    });

    setSubmitting(true);
    try {
      await api("/api/posts", "POST", {
        type: postData.type,
        title: postData.title.trim(),
        category: postData.category,
        location: postData.location.trim(),
        description: postData.description.trim(),
        questions: payloadQuestions,
      });
      nav("/feed");
    } catch (err) {
      setErrorMsg(err.message || "Failed to create post. Please review inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-workspace">
      <Header />

      <main className="content-container create-post-container">
        {/* Navigation Breadcrumb */}
        <button
          type="button"
          className="btn btn-ghost btn-sm back-nav-btn"
          onClick={() => nav("/feed")}
        >
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </button>

        <div className="create-post-header">
          <div className="create-post-heading-copy">
            <h1 className="page-title">
              {postData.type === "FOUND" ? "Report a Found Item" : "Report a Lost Item"}
            </h1>
            <p className="page-desc">
              Help reconnect belongings. Create verification questions so only the rightful owner can claim this item.
            </p>
          </div>
          <PageIllustration scene="report" className="title-scene-art" />
        </div>

        {/* Linky companion guidance */}
        <LinkyBubble
          title="Guide from Linky"
          text={
            postData.type === "FOUND"
              ? "Found something? Don't reveal all secret details in your description. Use your Unique question to test specifics only the true owner knows!"
              : "Lost an item? Provide recognizable public details, and set questions you can easily verify if someone reports finding it."
          }
          state="encouraging"
          dismissible={false}
        />

        <form onSubmit={handleSubmit} className="create-post-form" noValidate>
          {/* Post Type Selector */}
          <div className="post-type-selector-card">
            <span className="section-label">What are you reporting?</span>
            <div className="type-toggle-grid" role="radiogroup">
              <button
                type="button"
                role="radio"
                aria-checked={postData.type === "FOUND"}
                className={`type-option-card ${postData.type === "FOUND" ? "type-found-active" : ""}`}
                onClick={() => setPostData({ ...postData, type: "FOUND" })}
              >
                <span className="type-badge-icon">📦</span>
                <div className="type-copy">
                  <b>I found an item</b>
                  <small>You have an item in custody and want to find its owner.</small>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={postData.type === "LOST"}
                className={`type-option-card ${postData.type === "LOST" ? "type-lost-active" : ""}`}
                onClick={() => setPostData({ ...postData, type: "LOST" })}
              >
                <span className="type-badge-icon">🔎</span>
                <div className="type-copy">
                  <b>I lost an item</b>
                  <small>You are searching for an item you recently misplaced.</small>
                </div>
              </button>
            </div>
          </div>

          {/* Core Item Information Card */}
          <div className="form-card">
            <h2 className="card-section-title">Item Details</h2>

            <div className="input-group">
              <label htmlFor="post-title">Item Title *</label>
              <input
                id="post-title"
                type="text"
                placeholder={
                  postData.type === "FOUND"
                    ? "e.g. Black leather wallet near library"
                    : "e.g. Lost Silver iPhone 13 Pro with blue case"
                }
                value={postData.title}
                onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="input-group">
                <label htmlFor="post-category">Category *</label>
                <div className="select-wrap">
                  <select
                    id="post-category"
                    value={postData.category}
                    onChange={(e) => setPostData({ ...postData, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {ICONS[c] || "📦"} {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="post-location">Location / Area *</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="input-icon" aria-hidden="true" />
                  <input
                    id="post-location"
                    type="text"
                    className="has-leading-icon"
                    placeholder="e.g. Central Station, 2nd Floor"
                    value={postData.location}
                    onChange={(e) => setPostData({ ...postData, location: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="post-desc">Public Description (Optional)</label>
              <textarea
                id="post-desc"
                rows={3}
                placeholder="General description visible to everyone. DO NOT include passwords, private phone numbers, or the exact secret answers to your questions."
                value={postData.description}
                onChange={(e) => setPostData({ ...postData, description: e.target.value })}
              />
            </div>

            <SafetyNotice compact />
          </div>

          {/* Verification Questions Section */}
          <div className="questions-section">
            <div className="section-header-row">
              <div>
                <h2 className="card-section-title">Owner Verification Questions</h2>
                <p className="card-section-desc">
                  Claimants must answer these questions. At least 1 Basic (general) and 1 Unique (secret) question are required.
                </p>
              </div>
            </div>

            <div className="questions-list">
              {questions.map((q, qIdx) => (
                <div key={qIdx} className="question-builder-card">
                  <div className="question-card-top">
                    <span className="question-number-badge">Q{qIdx + 1}</span>

                    <div className="question-type-select-wrap">
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion(qIdx, { type: e.target.value })}
                        aria-label={`Question ${qIdx + 1} type`}
                      >
                        <option value="BASIC">Basic Question (General trait)</option>
                        <option value="UNIQUE">Unique Question (Secret detail)</option>
                      </select>
                    </div>

                    <div className="option-count-select-wrap">
                      <label htmlFor={`q-count-${qIdx}`}>Choices:</label>
                      <select
                        id={`q-count-${qIdx}`}
                        value={q.count}
                        onChange={(e) => handleOptionCountChange(qIdx, e.target.value)}
                      >
                        {[2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} options
                          </option>
                        ))}
                      </select>
                    </div>

                    {questions.length > 2 && (
                      <button
                        type="button"
                        className="btn btn-ghost-danger btn-icon remove-q-btn"
                        onClick={() => removeQuestion(qIdx)}
                        title="Remove this question"
                        aria-label={`Remove question ${qIdx + 1}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="input-group">
                    <input
                      type="text"
                      placeholder={
                        q.type === "BASIC"
                          ? "e.g. What color is the exterior casing?"
                          : "e.g. What photo or sticker is inside the back cover?"
                      }
                      value={q.text}
                      onChange={(e) => updateQuestion(qIdx, { text: e.target.value })}
                      required
                    />
                  </div>

                  <div className="options-builder-grid">
                    <span className="options-helper-text">
                      Fill the options below and select the radio button next to the <strong>correct answer</strong>:
                    </span>

                    {q.options.slice(0, q.count).map((opt, optIdx) => {
                      const isCorrect = q.correctIdx === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`option-row ${isCorrect ? "is-correct-option" : ""}`}
                        >
                          <label className="radio-label" title="Mark as correct answer">
                            <input
                              type="radio"
                              name={`correct-answer-radio-${qIdx}`}
                              checked={isCorrect}
                              onChange={() => updateQuestion(qIdx, { correctIdx: optIdx })}
                              aria-label={`Option ${optIdx + 1} is correct`}
                            />
                            <span className="custom-radio" />
                          </label>

                          <input
                            type="text"
                            placeholder={`Option ${optIdx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            required
                          />

                          {isCorrect && (
                            <span className="correct-tag" title="Correct answer">
                              <CheckCircle2 size={13} />
                              <span>Correct</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Questions Buttons */}
            <div className="add-question-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => addQuestion("BASIC")}
              >
                <Plus size={15} />
                <span>Add Basic Question</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => addQuestion("UNIQUE")}
              >
                <Plus size={15} />
                <span>Add Unique Question</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="alert-box alert-error" role="alert" aria-live="assertive">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="form-submit-row">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => nav("/feed")}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary submit-post-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Publishing Report...</span>
                </>
              ) : (
                <>
                  <span>Publish Item Report</span>
                  <Sparkles size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
