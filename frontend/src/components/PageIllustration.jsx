import React from "react";

const scenes = {
  report: {
    accent: "#f59e0b",
    secondary: "#6366f1",
    icon: "box",
    label: "Report an item",
  },
  matches: {
    accent: "#22c55e",
    secondary: "#6366f1",
    icon: "search",
    label: "Find a possible match",
  },
  verify: {
    accent: "#6366f1",
    secondary: "#f59e0b",
    icon: "shield",
    label: "Verify an item safely",
  },
  community: {
    accent: "#f59e0b",
    secondary: "#14b8a6",
    icon: "people",
    label: "Reconnect with your community",
  },
  support: {
    accent: "#14b8a6",
    secondary: "#6366f1",
    icon: "chat",
    label: "Get help from LostLink",
  },
};

function SceneSymbol({ icon, accent, secondary }) {
  if (icon === "search") {
    return (
      <>
        <circle cx="78" cy="62" r="25" fill="#fff" stroke={secondary} strokeWidth="5" />
        <path d="m96 81 18 18" stroke={secondary} strokeWidth="8" strokeLinecap="round" />
        <path d="M68 63h20M78 53v20" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }
  if (icon === "shield") {
    return (
      <>
        <path d="M78 34 105 44v22c0 19-12 32-27 40C63 98 51 85 51 66V44z" fill={secondary} />
        <path d="m66 67 9 9 18-20" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  }
  if (icon === "people") {
    return (
      <>
        <circle cx="67" cy="55" r="14" fill={secondary} />
        <circle cx="98" cy="58" r="12" fill={accent} />
        <path d="M42 99c1-18 11-28 25-28s24 10 25 28" fill={secondary} />
        <path d="M88 77c15-8 31 3 33 21H96" fill={accent} />
      </>
    );
  }
  if (icon === "chat") {
    return (
      <>
        <path d="M49 43h58a13 13 0 0 1 13 13v24a13 13 0 0 1-13 13H78l-18 13V93h-11a13 13 0 0 1-13-13V56a13 13 0 0 1 13-13" fill={secondary} />
        <circle cx="66" cy="69" r="4" fill="#fff" />
        <circle cx="82" cy="69" r="4" fill="#fff" />
        <circle cx="98" cy="69" r="4" fill="#fff" />
        <path d="M43 34h32a10 10 0 0 1 10 10" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <path d="M49 50h58v45H49z" fill="#fff" stroke={secondary} strokeWidth="4" />
      <path d="m46 50 32-21 32 21" fill={accent} stroke={secondary} strokeWidth="4" strokeLinejoin="round" />
      <path d="M70 95V69h16v26" fill="#eef2ff" stroke={secondary} strokeWidth="4" />
      <path d="m77 59 1 1" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

export default function PageIllustration({ scene = "community", className = "" }) {
  const artwork = scenes[scene] || scenes.community;

  return (
    <div
      className={`page-scene-art page-scene-art--${scene} ${className}`}
      role="img"
      aria-label={artwork.label}
    >
      <span className="scene-art-orbit scene-art-orbit-one" aria-hidden="true" />
      <span className="scene-art-orbit scene-art-orbit-two" aria-hidden="true" />
      <svg viewBox="0 0 160 132" aria-hidden="true" focusable="false">
        <ellipse cx="82" cy="113" rx="56" ry="10" fill="#3730a3" opacity=".1" />
        <rect x="22" y="92" width="116" height="13" rx="6.5" fill="#dbeafe" />
        <rect x="38" y="102" width="8" height="18" rx="4" fill="#a5b4fc" />
        <rect x="114" y="102" width="8" height="18" rx="4" fill="#a5b4fc" />
        <circle cx="30" cy="39" r="4" fill={artwork.accent} opacity=".8" />
        <circle cx="132" cy="48" r="5" fill={artwork.secondary} opacity=".35" />
        <rect x="32" y="20" width="96" height="78" rx="18" fill="#fff" opacity=".75" />
        <SceneSymbol icon={artwork.icon} accent={artwork.accent} secondary={artwork.secondary} />
        <circle cx="127" cy="88" r="10" fill={artwork.accent} />
        <path d="m123 88 3 3 6-7" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
