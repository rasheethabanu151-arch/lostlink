import React, { useState } from "react";
import { ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";

export default function SafetyNotice({ compact = false }) {
  const [open, setOpen] = useState(!compact);

  return (
    <div className="safety-notice-box">
      <div className="safety-notice-header" onClick={() => setOpen(!open)} role="button" tabIndex={0}>
        <div className="safety-title-row">
          <ShieldAlert size={16} className="text-amber" aria-hidden="true" />
          <span className="safety-title">Safety &amp; Privacy Guide</span>
        </div>
        <button
          type="button"
          className="safety-toggle-btn"
          aria-expanded={open}
          aria-label={open ? "Collapse safety guide" : "Expand safety guide"}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {open && (
        <ul className="safety-bullets">
          <li><strong>Keep secrets safe:</strong> Never put passwords, full ID numbers, or bank card details in public descriptions.</li>
          <li><strong>Use verification:</strong> Craft verification questions only the genuine owner would know (e.g. wallpaper picture, specific scratches, unique keychain).</li>
          <li><strong>Safe meetups:</strong> Meet in well-lit public places (police stations, campus helpdesks, transit offices).</li>
        </ul>
      )}
    </div>
  );
}
