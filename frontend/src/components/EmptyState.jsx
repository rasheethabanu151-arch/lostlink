import React from "react";
import LinkyAvatar from "./LinkyAvatar";

export default function EmptyState({
  title = "No items found",
  message = "Nothing to display at this moment.",
  actionLabel,
  onAction,
  characterState = "encouraging",
}) {
  return (
    <div className="empty-state-wrap">
      <div className="empty-state-character">
        <LinkyAvatar state={characterState} size={88} interactive />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn btn-primary empty-state-btn"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
