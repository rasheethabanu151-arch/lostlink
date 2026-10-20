import React, { useEffect, useState } from "react";
import LinkyAvatar from "./LinkyAvatar";
import PageIllustration from "./PageIllustration";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const STORAGE_KEY = "lostlink_onboarding_v1";

const steps = [
  {
    title: "Tell the community what happened",
    description:
      "Choose whether you lost or found an item, then add its title, category, location, and a short description.",
    avatarState: "greeting",
    speech: "I’ll help you get started. First, make a clear report.",
    scene: "report",
  },
  {
    title: "Add safe verification questions",
    description:
      "Add at least one basic and one unique question. Choose the correct answer for each so a real owner can verify a claim.",
    avatarState: "thinking",
    speech: "Keep one special detail private so only the owner can answer.",
    scene: "verify",
  },
  {
    title: "Browse and check suggestions",
    description:
      "Search the community feed or visit Suggestions to review possible matches based on your report’s category and location.",
    avatarState: "searching",
    speech: "Suggestions are possibilities, not confirmed matches.",
    scene: "matches",
  },
  {
    title: "Verify before reconnecting",
    description:
      "To claim a found item, answer the finder’s questions. Share contact details only after the answers are verified.",
    avatarState: "listening",
    speech: "Your private details stay protected until verification succeeds.",
    scene: "community",
  },
];

export default function OnboardingGuide({
  open = false,
  onClose,
  storageKey = STORAGE_KEY,
}) {
  const [visible, setVisible] = useState(Boolean(open));
  const [step, setStep] = useState(0);

  useEffect(() => {
    setVisible(Boolean(open));
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        try {
          localStorage.setItem(storageKey, "dismissed");
        } catch {}
        setVisible(false);
        if (onClose) onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose, storageKey]);

  const current = steps[step] || steps[0];

  const hideForGood = () => {
    try {
      localStorage.setItem(storageKey, "dismissed");
    } catch {}
    setVisible(false);
    if (onClose) onClose();
  };

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prev = () => setStep((prev) => Math.max(prev - 1, 0));

  if (!visible) return null;

  return (
    <div
      className="onboarding-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-heading"
      aria-describedby="onboarding-description"
    >
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <div className="onboarding-header-copy">
            <span className="onboarding-kicker">A quick guide with Linky</span>
            <h2 id="onboarding-heading">Welcome to LostLink</h2>
          </div>
          <button type="button" className="onboarding-close" aria-label="Close onboarding" onClick={hideForGood} autoFocus>
            <X size={16} />
          </button>
        </div>

        <div className="onboarding-content" key={step}>
          <div className="onboarding-avatar-block">
            <LinkyAvatar state={current.avatarState} size={88} />
            <div className="onboarding-speech" role="status" aria-live="polite">
              {current.speech}
            </div>
          </div>

          <div className="onboarding-step-copy">
            <PageIllustration scene={current.scene} className="onboarding-visual" />
            <div className="onboarding-step-indicator">
              Step {step + 1} of {steps.length}
            </div>
            <h3 className="onboarding-title">{current.title}</h3>
            <p className="onboarding-text" id="onboarding-description">{current.description}</p>
          </div>
        </div>

        <div className="onboarding-footer">
          <div className="onboarding-progress-dots" aria-hidden="true">
            {steps.map((_, idx) => (
              <span key={idx} className={`onboarding-dot ${idx === step ? "active" : ""}`} />
            ))}
          </div>

          <div className="onboarding-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={hideForGood}>
              Skip
            </button>
            {step > 0 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={prev}>
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>
            )}
            {step < steps.length - 1 ? (
              <button type="button" className="btn btn-primary btn-sm" onClick={next}>
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button type="button" className="btn btn-primary btn-sm" onClick={hideForGood}>
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
