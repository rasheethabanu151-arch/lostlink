import React, { useState } from "react";

/**
 * LinkyAvatar — The official animated companion of LostLink.
 * The component supports the states the app actually uses today while also
 * providing the richer state vocabulary described in the product brief.
 */
export default function LinkyAvatar({
  state = "idle",
  size = 80,
  className = "",
  interactive = false,
  onClick,
  message,
}) {
  const [hovered, setHovered] = useState(false);

  const stateAliases = {
    waiting: "listening",
    encouraging: "idle",
    happy: "success",
    celebrating: "success",
    matchFound: "success",
    thinking: "thinking",
    listening: "listening",
    success: "success",
    empty: "empty",
    offline: "offline",
    searching: "searching",
    greeting: "greeting",
    waking: "waking",
    sleeping: "sleeping",
    idle: "idle",
    error: "error",
  };

  const stateLabels = {
    sleeping: "Linky is sleeping peacefully",
    waking: "Linky is waking up",
    greeting: "Linky is happily waving hello",
    idle: "Linky is sitting attentively",
    listening: "Linky is listening for your next step",
    thinking: "Linky is thinking carefully before responding",
    searching: "Linky is actively searching and looking around",
    matchFound: "Linky found a promising match",
    empty: "Linky did not find any matches right now",
    success: "Linky is celebrating a successful result",
    error: "Linky is concerned and ready to help fix this",
    offline: "Linky is offline and waiting for connectivity",
  };

  const normalizedState = stateAliases[state] || "idle";
  const effectiveState = hovered && normalizedState === "idle" ? "greeting" : normalizedState;

  return (
    <div
      className={`linky-avatar-wrap linky-${effectiveState} ${interactive ? "linky-interactive" : ""} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      role="img"
      aria-label={message || stateLabels[effectiveState] || "Linky the LostLink guide"}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="linky-svg"
      >
        <defs>
          {/* Main body gradients */}
          <linearGradient id="linkyBodyGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="0.6" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#4338CA" />
          </linearGradient>

          <linearGradient id="linkyBellyGrad" x1="30" y1="45" x2="70" y2="85" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EEF2FF" />
            <stop offset="1" stopColor="#E0E7FF" />
          </linearGradient>

          {/* Beacon/antenna glow */}
          <radialGradient id="beaconGlow" cx="50" cy="15" r="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" stopOpacity="0.9" />
            <stop offset="0.6" stopColor="#EAB308" stopOpacity="0.4" />
            <stop offset="1" stopColor="#CA8A04" stopOpacity="0" />
          </radialGradient>

          {/* Blush gradient */}
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop stopColor="#FB7185" stopOpacity="0.6" />
            <stop offset="1" stopColor="#FB7185" stopOpacity="0" />
          </radialGradient>

          {/* Soft shadow */}
          <radialGradient id="floorShadow" cx="50" cy="94" r="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F172A" stopOpacity="0.28" />
            <stop offset="1" stopColor="#0F172A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Floor Shadow */}
        <ellipse cx="50" cy="93" rx="28" ry="5.5" fill="url(#floorShadow)" className="linky-shadow" />

        {/* Floating elements for specific states */}
        {effectiveState === "sleeping" && (
          <g className="linky-zzz">
            <text x="68" y="24" fill="#818CF8" fontSize="9" fontWeight="bold" opacity="0.8">z</text>
            <text x="76" y="16" fill="#A5B4FC" fontSize="12" fontWeight="bold" opacity="0.9">Z</text>
          </g>
        )}

        {effectiveState === "celebrating" && (
          <g className="linky-confetti">
            <circle cx="22" cy="20" r="2.5" fill="#F43F5E" />
            <polygon points="78,18 81,24 75,24" fill="#FBBF24" />
            <rect x="76" y="32" width="3" height="3" fill="#34D399" transform="rotate(25 77 33)" />
            <circle cx="20" cy="38" r="2" fill="#38BDF8" />
          </g>
        )}

        {/* Body Group with breathing/bouncing animations */}
        <g className="linky-character-body">
          {/* Antenna / Light Beacon */}
          <path d="M50 32 L50 20" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="18" r="9" fill="url(#beaconGlow)" className="linky-beacon-halo" />
          <circle cx="50" cy="18" r="4.5" fill="#FBBF24" stroke="#FFF" strokeWidth="1.2" className="linky-beacon-core" />

          {/* Left Ear / Wing */}
          <path
            d="M26 48 C16 45 16 60 25 64"
            fill="#4F46E5"
            className="linky-ear-left"
          />

          {/* Right Ear / Hand */}
          <g className="linky-arm-right">
            <path
              d="M74 48 C84 45 84 60 75 64"
              fill="#4F46E5"
            />
          </g>

          {/* Main Body Pear-Shape */}
          <path
            d="M32 40 C32 26, 68 26, 68 40 C73 54, 76 72, 70 82 C64 90, 36 90, 30 82 C24 72, 27 54, 32 40 Z"
            fill="url(#linkyBodyGrad)"
          />

          {/* Soft Belly Patch */}
          <ellipse cx="50" cy="65" rx="17" ry="18" fill="url(#linkyBellyGrad)" />

          {/* Tiny Feet */}
          <ellipse cx="41" cy="86" rx="6.5" ry="4" fill="#4338CA" />
          <ellipse cx="59" cy="86" rx="6.5" ry="4" fill="#4338CA" />

          {/* Rosy Cheeks */}
          <ellipse cx="37" cy="55" rx="4.5" ry="3" fill="url(#blushGrad)" />
          <ellipse cx="63" cy="55" rx="4.5" ry="3" fill="url(#blushGrad)" />

          {/* Eyes System */}
          {effectiveState === "sleeping" ? (
            /* Closed peaceful curved eyes */
            <g className="linky-eyes-sleeping" stroke="#1E1B4B" strokeWidth="2.4" strokeLinecap="round">
              <path d="M38 50 Q43 54 48 50" />
              <path d="M52 50 Q57 54 62 50" />
            </g>
          ) : effectiveState === "happy" || effectiveState === "celebrating" ? (
            /* Joyful crescent arcs */
            <g className="linky-eyes-happy" stroke="#1E1B4B" strokeWidth="2.8" strokeLinecap="round">
              <path d="M37 51 Q42 45 47 51" />
              <path d="M53 51 Q58 45 63 51" />
            </g>
          ) : effectiveState === "searching" ? (
            /* Curious darting eyes */
            <g className="linky-eyes-searching">
              <circle cx="43" cy="49" r="6" fill="#FFFFFF" stroke="#312E81" strokeWidth="1.5" />
              <circle cx="57" cy="49" r="6" fill="#FFFFFF" stroke="#312E81" strokeWidth="1.5" />
              <circle cx="45" cy="49" r="3.2" fill="#1E1B4B" className="linky-pupil-search" />
              <circle cx="59" cy="49" r="3.2" fill="#1E1B4B" className="linky-pupil-search" />
              <circle cx="46.5" cy="47.5" r="1.2" fill="#FFFFFF" />
              <circle cx="60.5" cy="47.5" r="1.2" fill="#FFFFFF" />
            </g>
          ) : effectiveState === "error" ? (
            /* Sympathetic / surprised eyes */
            <g className="linky-eyes-error">
              <circle cx="42" cy="49" r="5.5" fill="#FFFFFF" stroke="#312E81" strokeWidth="1.5" />
              <circle cx="58" cy="49" r="5.5" fill="#FFFFFF" stroke="#312E81" strokeWidth="1.5" />
              <circle cx="42" cy="50" r="2.8" fill="#1E1B4B" />
              <circle cx="58" cy="50" r="2.8" fill="#1E1B4B" />
              <circle cx="43" cy="48.5" r="1" fill="#FFFFFF" />
              <circle cx="59" cy="48.5" r="1" fill="#FFFFFF" />
              {/* Little sweat drop */}
              <path d="M66 43 C67 41, 69 41, 69 43 C69 45, 66 47, 66 43 Z" fill="#38BDF8" />
            </g>
          ) : (
            /* Default Awake / Blinkable Eyes */
            <g className="linky-eyes-default">
              <ellipse cx="43" cy="49" rx="4.8" ry="6" fill="#FFFFFF" stroke="#312E81" strokeWidth="1.2" className="linky-eyeball" />
              <ellipse cx="57" cy="49" rx="4.8" ry="6" fill="#FFFFFF" stroke="#312E81" strokeWidth="1.2" className="linky-eyeball" />
              <circle cx="43" cy="49" r="3.2" fill="#1E1B4B" className="linky-pupil" />
              <circle cx="57" cy="49" r="3.2" fill="#1E1B4B" className="linky-pupil" />
              {/* Highlights */}
              <circle cx="44.5" cy="47" r="1.4" fill="#FFFFFF" />
              <circle cx="58.5" cy="47" r="1.4" fill="#FFFFFF" />
            </g>
          )}

          {/* Mouth System */}
          {effectiveState === "sleeping" ? (
            <ellipse cx="50" cy="58" rx="1.5" ry="1.2" fill="#4338CA" />
          ) : effectiveState === "happy" || effectiveState === "celebrating" ? (
            <path d="M45 56 Q50 63 55 56 Z" fill="#F43F5E" stroke="#E11D48" strokeWidth="0.8" />
          ) : effectiveState === "greeting" ? (
            <path d="M46 56 Q50 61 54 56 Z" fill="#F43F5E" />
          ) : effectiveState === "error" ? (
            <path d="M46 58 Q50 55 54 58" stroke="#312E81" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M46 56 Q50 60 54 56" stroke="#312E81" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          )}
        </g>
      </svg>
    </div>
  );
}
