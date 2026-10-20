import React, { useState } from "react";
import LinkyAvatar from "./LinkyAvatar";
import { X, Sparkles } from "lucide-react";

export default function LinkyBubble({
  title,
  text,
  state = "idle",
  avatarSize = 58,
  action,
  onDismiss,
  dismissible = true,
  storageKey,
  className = "",
}) {
  const [dismissed, setDismissed] = useState(() => {
    if (storageKey) {
      return sessionStorage.getItem(`linky_dismissed_${storageKey}`) === "1";
    }
    return false;
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    if (storageKey) {
      sessionStorage.setItem(`linky_dismissed_${storageKey}`, "1");
    }
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <aside
      className={`linky-bubble-card ${className}`}
      aria-label="Linky tip"
    >
      <div className="linky-bubble-avatar-slot">
        <LinkyAvatar state={state} size={avatarSize} interactive />
      </div>

      <div className="linky-bubble-content">
        <div className="linky-bubble-header">
          <div className="linky-bubble-title">
            <Sparkles size={14} className="linky-sparkle-icon" aria-hidden="true" />
            <span>{title || "Linky says"}</span>
          </div>
          {dismissible && (
            <button
              type="button"
              className="linky-bubble-close"
              onClick={handleDismiss}
              aria-label="Dismiss this tip"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <p className="linky-bubble-text">{text}</p>

        {action && (
          <button
            type="button"
            className="linky-bubble-action-btn"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>
    </aside>
  );
}
