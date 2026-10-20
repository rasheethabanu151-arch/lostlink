import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import Header from "../components/Header";
import LinkyAvatar from "../components/LinkyAvatar";
import PageIllustration from "../components/PageIllustration";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Phone,
  MessageCircle,
  User,
  Copy,
  Check,
  Loader2,
  RotateCcw,
} from "lucide-react";

export default function ClaimPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [questions, setQuestions] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [times, setTimes] = useState([]);
  const [result, setResult] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    setLoadingQuestions(true);
    setErrorMsg("");
    api(`/api/posts/${id}/questions`)
      .then((qs) => {
        setQuestions(qs || []);
      })
      .catch((err) => {
        setErrorMsg(err.message || "Could not load verification questions.");
      })
      .finally(() => setLoadingQuestions(false));
  }, [id]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [step, answers, result, submittingClaim]);

  const handlePickOption = async (optionText) => {
    if (!questions || step >= questions.length) return;
    const currentQ = questions[step];
    const updatedAnswers = [...answers, { questionId: currentQ.id, answer: optionText }];
    const updatedTimes = [...times, new Date()];

    setAnswers(updatedAnswers);
    setTimes(updatedTimes);

    // If there are more questions, advance step
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      // Last question answered, submit claim to backend
      setSubmittingClaim(true);
      setErrorMsg("");
      try {
        const res = await api(`/api/posts/${id}/claim`, "POST", { answers: updatedAnswers });
        setResult(res);
      } catch (err) {
        setErrorMsg(err.message || "Claim attempt failed.");
      } finally {
        setSubmittingClaim(false);
      }
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMsg("Could not copy the number. You can still select and copy it manually.");
    }
  };

  const whatsappLink = result?.contact
    ? `https://wa.me/${result.contact.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hi ${result.finder}, I verified the ownership of your ${result.type === "LOST" ? "lost" : "found"} item "${result.item}"${result.location ? ` reported near ${result.location}` : ""} on LostLink. Could we arrange a safe handover?`
      )}`
    : "";

  const getLinkyState = () => {
    if (result && result.verified) return "celebrating";
    if (result && !result.verified) return "error";
    if (submittingClaim) return "searching";
    if (errorMsg) return "error";
    return "encouraging";
  };

  const formatTime = (d) =>
    d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="page-workspace">
      <Header />

      <main className="content-container claim-container">
        {/* Top return link */}
        <div className="claim-top-bar">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => nav("/feed")}
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="claim-visual-banner">
          <div>
            <h1 className="page-title">A safe way to reconnect</h1>
            <p className="page-desc">Answer the item-specific questions to verify your claim.</p>
          </div>
          <PageIllustration scene="verify" className="claim-scene-art" />
        </div>

        {/* Verification Dialogue Frame */}
        <div className="claim-dialogue-card">
          {/* Header */}
          <div className="claim-dialogue-header">
            <div className="claim-guide-badge">
              <LinkyAvatar state={getLinkyState()} size={42} />
              <div className="claim-header-text">
                <span className="claim-title">Owner Verification Guide</span>
                <span className="claim-subtitle">Linky will check your answers with the finder</span>
              </div>
            </div>

            {questions && questions.length > 0 && !result && (
              <div className="claim-progress-indicator">
                <span>Step {Math.min(step + 1, questions.length)} of {questions.length}</span>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${((step + (result ? 1 : 0)) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Chat Body */}
          <div className="claim-chat-body" role="log" aria-live="polite">
            {/* Initial Welcome Bubble */}
            <div className="dialogue-row dialogue-from-guide">
              <div className="guide-avatar-small">
                <LinkyAvatar state="greeting" size={28} />
              </div>
              <div className="dialogue-bubble guide-bubble">
                <p>Hello! To protect belongings, please answer a few questions about this item to confirm you are the owner.</p>
              </div>
            </div>

            {loadingQuestions && (
              <div className="dialogue-loading-row">
                <Loader2 size={20} className="animate-spin text-primary" />
                <span>Loading verification questions...</span>
              </div>
            )}

            {/* Render Questions and Answers */}
            {questions &&
              questions.map((q, idx) => {
                if (idx > step) return null;
                const hasAnswered = idx < answers.length;

                return (
                  <div key={q.id || idx} className="question-exchange-block">
                    {/* Interstitial note when switching to Unique question */}
                    {q.type === "UNIQUE" && (idx === 0 || questions[idx - 1]?.type === "BASIC") && (
                      <div className="dialogue-system-note">
                        <span>🔒 Secret question: specific detail test</span>
                      </div>
                    )}

                    {/* Guide Question Bubble */}
                    <div className="dialogue-row dialogue-from-guide">
                      <div className="guide-avatar-small">
                        <LinkyAvatar state={hasAnswered ? "idle" : "listening"} size={28} />
                      </div>
                      <div className="dialogue-bubble guide-bubble">
                        <span className="q-badge-type">
                          {q.type === "UNIQUE" ? "Unique Question" : "Basic Question"}
                        </span>
                        <p className="q-prompt-text">{q.text}</p>
                      </div>
                    </div>

                    {/* User Answer or Interactive Choice Options */}
                    {hasAnswered ? (
                      <div className="dialogue-row dialogue-from-user">
                        <div className="dialogue-bubble user-bubble">
                          <span>{answers[idx].answer}</span>
                          <span className="bubble-timestamp">
                            {formatTime(times[idx])}
                          </span>
                        </div>
                      </div>
                    ) : (
                      !result && (
                        <div className="dialogue-options-palette" aria-label="Choose your answer">
                          <span className="palette-instruction">Select the matching answer:</span>
                          <div className="options-buttons-grid">
                            {q.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                type="button"
                                className="claim-option-btn"
                                onClick={() => handlePickOption(opt)}
                                disabled={submittingClaim}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}

            {/* Evaluation spinner */}
            {submittingClaim && (
              <div className="dialogue-row dialogue-from-guide">
                <div className="guide-avatar-small">
                  <LinkyAvatar state="searching" size={28} />
                </div>
                <div className="dialogue-bubble guide-bubble verifying-bubble">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span>Checking your answers securely...</span>
                </div>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="alert-box alert-error" role="alert">
                <AlertTriangle size={18} />
                <div className="alert-text">
                  <span>{errorMsg}</span>
                  <Link to="/feed" className="btn-retry mt-2 inline-block">
                    Return to Feed
                  </Link>
                </div>
              </div>
            )}

            {/* Result: Verified Successfully */}
            {result && result.verified && (
              <div className="claim-result-card result-success" role="status">
                <div className="result-celebration-icon">
                  <CheckCircle2 size={44} className="text-success" />
                </div>
                <h3 className="result-headline">Answers Verified!</h3>
                <p className="result-body">
                  Your answers matched the finder's records. You can now get in touch with <strong>{result.finder}</strong> to arrange a safe return.
                </p>

                {result.contact && (
                  <div className="finder-contact-box">
                    <span className="finder-contact-label">Finder's Phone Contact</span>
                    <div className="contact-row">
                      <Phone size={18} className="text-primary" />
                      <a href={`tel:${result.contact}`} className="contact-tel-link">
                        {result.contact}
                      </a>
                      <button
                        type="button"
                        className="btn btn-icon btn-sm copy-contact-btn"
                        onClick={() => copyToClipboard(result.contact)}
                        title="Copy phone number"
                        aria-label="Copy phone number"
                      >
                        {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <div className="contact-action-row">
                      <a href={`tel:${result.contact}`} className="btn btn-primary btn-sm">
                        <Phone size={15} />
                        <span>Call finder</span>
                      </a>
                      <a
                        href={whatsappLink}
                        className="btn btn-whatsapp btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={15} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}

                <div className="result-cta-row">
                  <Link to="/feed" className="btn btn-primary w-full">
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            )}

            {/* Result: Verification Failed */}
            {result && !result.verified && (
              <div className="claim-result-card result-failed" role="alert">
                <div className="result-celebration-icon">
                  <AlertTriangle size={44} className="text-danger" />
                </div>
                <h3 className="result-headline">{result.message || "Verification Failed"}</h3>
                <p className="result-body">
                  One or more answers did not match the finder's details. For privacy and safety, each claimant is granted limited verification attempts.
                </p>

                <div className="result-cta-row">
                  <Link to="/feed" className="btn btn-secondary w-full">
                    Back to Items Feed
                  </Link>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>
      </main>
    </div>
  );
}
