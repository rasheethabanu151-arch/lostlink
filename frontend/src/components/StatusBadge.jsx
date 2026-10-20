import React from "react";
import { Search, Package, CheckCircle2, Clock } from "lucide-react";

export default function StatusBadge({ type, status, className = "" }) {
  if (type) {
    const isLost = type.toUpperCase() === "LOST";
    return (
      <span
        className={`status-pill ${isLost ? "status-pill-lost" : "status-pill-found"} ${className}`}
        role="status"
      >
        {isLost ? (
          <>
            <Search size={12} className="pill-icon" aria-hidden="true" />
            <span>LOST</span>
          </>
        ) : (
          <>
            <Package size={12} className="pill-icon" aria-hidden="true" />
            <span>FOUND</span>
          </>
        )}
      </span>
    );
  }

  if (status) {
    const isClaimed = status.toUpperCase() === "CLAIMED";
    return (
      <span
        className={`status-pill ${isClaimed ? "status-pill-claimed" : "status-pill-open"} ${className}`}
        role="status"
      >
        {isClaimed ? (
          <>
            <CheckCircle2 size={12} className="pill-icon" aria-hidden="true" />
            <span>Claimed</span>
          </>
        ) : (
          <>
            <Clock size={12} className="pill-icon" aria-hidden="true" />
            <span>Open</span>
          </>
        )}
      </span>
    );
  }

  return null;
}
