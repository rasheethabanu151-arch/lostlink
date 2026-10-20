import React, { useEffect, useRef, useState } from "react";
import LinkyAvatar from "./LinkyAvatar";

/** Moon intro with an accessible pull trigger and Linky companion. */
export default function LampIntro({ children, introContent }) {
  const [lampOn, setLampOn] = useState(() => {
    try {
      return sessionStorage.getItem("lostlink_lamp_state") === "1";
    } catch {
      return false;
    }
  });
  const [pulling, setPulling] = useState(false);
  const [characterState, setCharacterState] = useState(() => (lampOn ? "greeting" : "sleeping"));
  const animationTimeout = useRef(null);

  useEffect(() => () => window.clearTimeout(animationTimeout.current), []);

  const toggleLamp = () => {
    const nextState = !lampOn;
    setLampOn(nextState);
    setCharacterState(nextState ? "waking" : "sleeping");

    try {
      sessionStorage.setItem("lostlink_lamp_state", nextState ? "1" : "0");
    } catch {}

    window.clearTimeout(animationTimeout.current);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setCharacterState(nextState ? "greeting" : "sleeping");
      setPulling(false);
      return;
    }

    setPulling(true);
    animationTimeout.current = window.setTimeout(() => {
      setCharacterState(nextState ? "greeting" : "sleeping");
      setPulling(false);
    }, nextState ? 650 : 350);
  };

  const handleLampKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      toggleLamp();
    }
  };

  return (
    <div className={`table-lamp-scene ${lampOn ? "lamp-is-on" : "lamp-is-off"}`}>
      {/* Main 3D Desk & Studio Stage */}
      <div className="table-stage-wrapper">
        <div className="table-composition">
          <div className={`moon-stage ${lampOn ? "moon-is-lit" : "moon-is-dim"}`}>
            <div className="moon-star moon-star-one" aria-hidden="true">✦</div>
            <div className="moon-star moon-star-two" aria-hidden="true">✧</div>
            <div className="moon-star moon-star-three" aria-hidden="true">·</div>
            <div className="moon-glow" aria-hidden="true" />
            <div className="welcome-moon" aria-label={lampOn ? "Glowing full moon" : "Moon waiting to be lit"}>
              <span className="moon-crater moon-crater-one" />
              <span className="moon-crater moon-crater-two" />
              <span className="moon-crater moon-crater-three" />
            </div>
            <button
              type="button"
              className={`moon-pull-trigger ${pulling ? "is-pulling" : ""}`}
              onClick={toggleLamp}
              aria-label={lampOn ? "Pull the chain to dim the moon and hide sign in" : "Pull the chain to glow the moon and reveal sign in"}
              aria-pressed={lampOn}
            >
              <svg className="moon-trigger-chain" viewBox="0 0 30 164" aria-hidden="true">
                <defs>
                  <linearGradient id="moonChainGold" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#8a5a1e" />
                    <stop offset="0.32" stopColor="#d6ad58" />
                    <stop offset="0.52" stopColor="#fff1b8" />
                    <stop offset="0.76" stopColor="#c38a36" />
                    <stop offset="1" stopColor="#704511" />
                  </linearGradient>
                  <radialGradient id="moonChainStar" cx="35%" cy="25%">
                    <stop offset="0" stopColor="#fffde8" />
                    <stop offset="0.55" stopColor="#fde68a" />
                    <stop offset="1" stopColor="#d49b35" />
                  </radialGradient>
                </defs>
                <path
                  d="M15 0 C14.3 24 15.8 48 15 72 C14.5 94 15.6 113 15 137"
                  className="moon-chain-cord-shadow"
                />
                <path
                  d="M15 0 C14.3 24 15.8 48 15 72 C14.5 94 15.6 113 15 137"
                  className="moon-chain-cord"
                  stroke="url(#moonChainGold)"
                />
                {Array.from({ length: 17 }, (_, index) => {
                  const y = 5 + index * 7.8;
                  const x = 15 + Math.sin(index * 0.34) * 0.85;
                  return (
                    <g key={index} className="moon-chain-bead">
                      <circle cx={x} cy={y} r="2.25" fill="#70400f" opacity="0.72" />
                      <circle cx={x} cy={y - 0.25} r="1.75" fill="url(#moonChainGold)" />
                      <circle cx={x - 0.55} cy={y - 0.8} r="0.48" fill="#fff4c2" opacity="0.9" />
                    </g>
                  );
                })}
                <path
                  d="M15 139 L17.7 145.1 L24.3 145.7 L19.3 150.1 L20.8 156.5 L15 153.1 L9.2 156.5 L10.7 150.1 L5.7 145.7 L12.3 145.1 Z"
                  fill="url(#moonChainStar)"
                  stroke="#9a6a21"
                  strokeWidth="0.85"
                  className="moon-chain-star"
                />
                <circle cx="15" cy="148" r="1.1" fill="#fffde8" opacity="0.82" />
              </svg>
              <span className="moon-trigger-text">{lampOn ? "Pull to dim" : "Pull to glow"}</span>
            </button>
            <p className="moon-instruction" role="status" aria-live="polite">
              {lampOn
                ? "Pull the hanging chain to dim the moon."
                : "Pull the hanging chain to light the moon and reveal sign in."}
            </p>
          </div>

          {/* Retained decorative artwork is hidden in favor of the moon intro. */}
          <svg
            viewBox="0 0 520 400"
            className="table-lamp-svg"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="A warmly lit desk with Linky"
          >
            <defs>
              {/* 3D Brass Gradients */}
              <linearGradient id="brassCylinder" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#854d0e" />
                <stop offset="25%" stopColor="#eab308" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="75%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>

              <linearGradient id="brassBevel" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>

              {/* 3D Lamp Shade Gradient */}
              <linearGradient id="shade3DExt" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="30%" stopColor="#334155" />
                <stop offset="55%" stopColor="#475569" />
                <stop offset="85%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Inner Reflective Gold Rim */}
              <linearGradient id="shadeInnerReflect" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="35%" stopColor="#fde047" />
                <stop offset="70%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>

              {/* Wooden Table Top Gradient */}
              <linearGradient id="woodDeskTop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3d2214" />
                <stop offset="40%" stopColor="#2c180e" />
                <stop offset="100%" stopColor="#1d1009" />
              </linearGradient>

              <linearGradient id="woodBevelEdge" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#63391d" />
                <stop offset="50%" stopColor="#3d2214" />
                <stop offset="100%" stopColor="#170c06" />
              </linearGradient>

              {/* Light Pool on Tabletop */}
              <radialGradient id="tableLightPool" cx="60%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#fde047" stopOpacity="0.55" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>

              {/* Bulb Filament Glow */}
              <radialGradient id="bulbFilament" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="35%" stopColor="#fef08a" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
              </radialGradient>

              {/* Volumetric Conical Light Beam */}
              <linearGradient id="volumetricBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.55" />
                <stop offset="40%" stopColor="#fde047" stopOpacity="0.32" />
                <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
              </linearGradient>

              {/* Drop Shadows */}
              <filter id="deskShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                <feOffset dx="0" dy="6" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.6" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ========================================================
               1. THE WOODEN DESK / TABLE SURFACE
               ======================================================== */}
            {/* Table Surface Plane */}
            <path
              d="M0 325 L520 325 L520 375 L0 375 Z"
              fill="url(#woodDeskTop)"
            />

            {/* Table Bevel Front Edge */}
            <rect x="0" y="325" width="520" height="3" fill="#854d0e" opacity="0.6" />
            <rect x="0" y="375" width="520" height="25" fill="url(#woodBevelEdge)" />

            {/* Ambient Pool of Light on Desk Surface */}
            {lampOn && (
              <ellipse
                cx="290"
                cy="338"
                rx="210"
                ry="38"
                fill="url(#tableLightPool)"
                className="desk-light-pool"
              />
            )}

            {/* Volumetric Light Beam from Lamp Shade down to Desk */}
            {lampOn && (
              <polygon
                points="178,162 262,168 470,345 110,345"
                fill="url(#volumetricBeam)"
                className="lamp-volumetric-beam"
              />
            )}

            {/* ========================================================
               2. REALISTIC 3D TABLE LAMP
               ======================================================== */}
            <g className="lamp-3d-assembly">
              {/* Heavy Base Cast Shadow */}
              <ellipse cx="120" cy="336" rx="58" ry="12" fill="#090d16" opacity="0.75" />

              {/* Base Tier 1: Weighted Foot Rim */}
              <ellipse cx="120" cy="332" rx="52" ry="10" fill="#1e1b4b" />
              <path
                d="M68 326 C68 332, 172 332, 172 326 L172 331 C172 337, 68 337, 68 331 Z"
                fill="url(#brassCylinder)"
              />
              <ellipse cx="120" cy="326" rx="52" ry="9" fill="url(#brassBevel)" />

              {/* Base Tier 2: Stepped Brass Pedestal */}
              <path
                d="M80 318 C80 323, 160 323, 160 318 L160 324 C160 329, 80 329, 80 324 Z"
                fill="url(#brassCylinder)"
              />
              <ellipse cx="120" cy="318" rx="40" ry="7.5" fill="url(#brassBevel)" />

              {/* Base Center Collar */}
              <ellipse cx="120" cy="315" rx="16" ry="4" fill="url(#brassCylinder)" />

              {/* On-Base Push Switch Button (Clickable!) */}
              <g
                className="base-switch-group"
                role="button"
                tabIndex={0}
                aria-label={`Lamp switch is ${lampOn ? "on" : "off"}. Activate to turn it ${lampOn ? "off" : "on"}.`}
                onClick={toggleLamp}
                onKeyDown={handleLampKeyDown}
              >
                <ellipse cx="146" cy="320" rx="7" ry="3.5" fill="#475569" />
                <ellipse
                  cx="146"
                  cy={lampOn ? 319 : 318}
                  rx="5"
                  ry="2.5"
                  fill={lampOn ? "#22c55e" : "#ef4444"}
                />
              </g>

              {/* 3D Articulated Lower Arm (Solid Brass Tubular Rods) */}
              {/* Left Rod */}
              <path
                d="M115 314 C112 260, 118 200, 134 145"
                stroke="url(#brassCylinder)"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Parallel Rod */}
              <path
                d="M124 314 C121 260, 127 200, 143 145"
                stroke="url(#brassCylinder)"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Articulated Elbow Joint (Knurled Brass Wheel / Pivot) */}
              <ellipse cx="138" cy="145" rx="10" ry="10" fill="url(#brassBevel)" />
              <ellipse cx="138" cy="145" rx="6" ry="6" fill="#713f12" />
              {/* Wing Nut Adjuster */}
              <rect x="130" y="142" width="16" height="6" rx="2" fill="url(#brassCylinder)" transform="rotate(-25 138 145)" />

              {/* Cantilever Upper Arm to Shade */}
              <path
                d="M138 145 Q160 125, 205 138"
                stroke="url(#brassCylinder)"
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Lamp Shade Socket Housing */}
              <rect x="200" y="132" width="16" height="15" rx="3" fill="url(#brassCylinder)" transform="rotate(15 208 140)" />

              {/* 3D Lamp Shade Dome (Deep Brushed Enamel with Curvature Highlight) */}
              <g
                className="lamp-shade-group"
                onClick={toggleLamp}
                style={{ cursor: "pointer" }}
                aria-hidden="true"
              >
                {/* Outer Shade Body */}
                <path
                  d="M165 168 C175 120, 255 125, 268 172 L274 176 C276 179, 273 183, 268 183 L158 178 C153 178, 151 174, 154 171 Z"
                  fill="url(#shade3DExt)"
                  stroke="#475569"
                  strokeWidth="1.2"
                />

                {/* Inner Shade Golden Reflector Rim */}
                <ellipse
                  cx="214"
                  cy="178"
                  rx="56"
                  ry="9"
                  fill="url(#shadeInnerReflect)"
                  opacity={lampOn ? 1 : 0.4}
                />

                {/* 3D Specular Highlight on Shade */}
                <path
                  d="M185 142 C195 136, 230 138, 240 148"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.35"
                  fill="none"
                />

                {/* Edison Light Bulb inside Shade */}
                <ellipse
                  cx="214"
                  cy="176"
                  rx="14"
                  ry="10"
                  fill={lampOn ? "url(#bulbFilament)" : "#475569"}
                  className="table-lamp-bulb"
                />
              </g>

              {/* Hanging beaded pull chain as part of the scene illustration */}
              <g
                tabIndex={0}
                role="button"
                aria-label={`Pull chain: lamp is ${lampOn ? "on" : "off"}. Activate to turn it ${lampOn ? "off" : "on"}.`}
                className={`lamp-chain-assembly ${pulling ? "is-pulling" : ""} ${lampOn ? "is-lit" : ""}`}
                onClick={toggleLamp}
                onKeyDown={handleLampKeyDown}
              >
                {/* Beaded Chain Cord */}
                <g className="beaded-chain-line">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={238 + Math.sin(i * 0.4) * 0.8}
                      cy={182 + i * 7.5}
                      r="2.6"
                      fill="url(#brassBevel)"
                      stroke="#854d0e"
                      strokeWidth="0.5"
                      className="chain-bead-dot"
                    />
                  ))}
                </g>

                {/* Brass Teardrop/Acorn Pull Fob */}
                <g transform="translate(238, 268)" className="chain-pull-fob-group">
                  {/* Acorn Metal Shape */}
                  <path
                    d="M-5 0 C-6 6, -4 14, 0 18 C4 14, 6 6, 5 0 Z"
                    fill="url(#brassCylinder)"
                    stroke="#713f12"
                    strokeWidth="0.8"
                  />
                  {/* Fob Cap */}
                  <ellipse cx="0" cy="0" rx="5.5" ry="2" fill="url(#brassBevel)" />
                  {!lampOn && <circle cx="0" cy="9" r="12" className="fob-ping-ring" />}
                </g>
              </g>
            </g>
          </svg>

          {/* Linky Sitting on the Tabletop Beside the Lamp */}
          <div className="table-companion-zone">
            <div className="companion-desk-position">
              <LinkyAvatar
                state={characterState}
                size={lampOn ? 132 : 224}
                className="moon-linky-avatar"
              />

              <div className="companion-speech-wrap">
                <div className={`lamp-welcome-bubble ${lampOn ? "" : "lamp-welcome-bubble-off"}`}>
                  <div className="lamp-welcome-text">
                    <b>{lampOn ? "Hello! Welcome to LostLink." : "The moon is waiting"}</b>
                    <p>{lampOn ? "Looking for something you lost, or helping someone find it?" : "Pull the chain to light the moon and meet LostLink."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`table-auth-container ${lampOn ? "auth-lamp-lit" : "auth-lamp-dim"}`} aria-hidden={!lampOn}>
        {children}
      </div>

      {introContent}
    </div>
  );
}
