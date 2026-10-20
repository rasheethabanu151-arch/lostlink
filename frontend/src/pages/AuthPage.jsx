import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, getToken, setToken, setUsername, setRole } from "../api";
import LampIntro from "../components/LampIntro";
import OnboardingGuide from "../components/OnboardingGuide";
import { Eye, EyeOff, Lock, Mail, User, Phone, MapPin, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function AuthPage() {
  const nav = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({
    username: "",
    email: "",
    contact: "",
    location: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (getToken()) return <Navigate to="/feed" replace />;

  const setField = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const validate = () => {
    if (!f.email || !f.email.includes("@")) {
      return "Please enter a valid email address.";
    }
    if (!f.password || f.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (mode === "register") {
      if (!f.username || f.username.trim().length < 3) {
        return "Username must be at least 3 characters.";
      }
      if (!f.contact || !/^\d{10}$/.test(f.contact.trim())) {
        return "Contact number must be exactly 10 digits.";
      }
      if (!f.location || f.location.trim().length === 0) {
        return "Please enter your city/location.";
      }
    }
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const clientErr = validate();
    if (clientErr) {
      setErr(clientErr);
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await api("/api/auth/register", "POST", {
          username: f.username.trim(),
          email: f.email.trim(),
          contact: f.contact.trim(),
          location: f.location.trim(),
          password: f.password,
        });
        localStorage.setItem("lostlink_contact_" + f.email.trim(), f.contact.trim());
        setMode("login");
        setMsg("Account created successfully! Please sign in with your email.");
      } else {
        const r = await api("/api/auth/login", "POST", {
          email: f.email.trim(),
          password: f.password,
        });
        setToken(r.token);
        setUsername(r.username);
        setRole(r.role || "USER");
        if (r.email) localStorage.setItem("lostlink_email", r.email);
        if (r.contact) localStorage.setItem("lostlink_contact", r.contact);
        nav(r.role === "ADMIN" ? "/admin" : "/feed");
      }
    } catch (e2) {
      setErr(e2.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErr("");
    setMsg("");
  };

  return (
    <LampIntro
      introContent={
        <OnboardingGuide
          open={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          storageKey="lostlink_onboarding_guest_v1"
        />
      }
    >
      <div className="auth-panel-container">
        <div className="auth-card">
          {/* Header text */}
          <div className="auth-card-header">
            <h2 className="auth-title">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="auth-subtitle">
              {mode === "login"
                ? "Sign in to track your items and answer verification claims."
                : "Join LostLink to report found items and reconnect belongings."}
            </p>
          </div>

          {/* Quick Value Proposition Highlights */}
          <div className="auth-feature-pills" aria-hidden="true">
            <div className="feature-pill">
              <span>📝</span>
              <span>Report Fast</span>
            </div>
            <div className="feature-pill">
              <span>🔍</span>
              <span>Smart Match</span>
            </div>
            <div className="feature-pill">
              <span>🔐</span>
              <span>Safe Claim</span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-tab-switch" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={`auth-tab-btn ${mode === "register" ? "active" : ""}`}
              onClick={() => switchMode("register")}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={submit} noValidate>
            {mode === "register" && (
              <div className="input-group">
                <label htmlFor="reg-username">Username</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" aria-hidden="true" />
                  <input
                    id="reg-username"
                    type="text"
                    className="has-leading-icon"
                    placeholder="e.g. AlexMorgan"
                    value={f.username}
                    onChange={setField("username")}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="auth-email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" aria-hidden="true" />
                <input
                  id="auth-email"
                  type="email"
                  className="has-leading-icon"
                  placeholder="name@example.com"
                  value={f.email}
                  onChange={setField("email")}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {mode === "register" && (
              <>
                <div className="input-group">
                  <label htmlFor="reg-contact">Phone Contact (10 digits)</label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-icon" aria-hidden="true" />
                    <input
                      id="reg-contact"
                      type="tel"
                      className="has-leading-icon"
                      placeholder="10 digit phone number"
                      maxLength={10}
                      value={f.contact}
                      onChange={setField("contact")}
                      autoComplete="tel"
                      required
                    />
                  </div>
                  <span className="input-hint">
                    Shared only with verified owners after question verification.
                  </span>
                </div>

                <div className="input-group">
                  <label htmlFor="reg-location">City / Campus Location</label>
                  <div className="input-with-icon">
                    <MapPin size={16} className="input-icon" aria-hidden="true" />
                    <input
                      id="reg-location"
                      type="text"
                      className="has-leading-icon"
                      placeholder="e.g. Seattle, WA or North Campus"
                      value={f.location}
                      onChange={setField("location")}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <label htmlFor="auth-password">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" aria-hidden="true" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  className="has-leading-icon has-trailing-control"
                  placeholder={mode === "register" ? "At least 6 characters" : "Enter your password"}
                  value={f.password}
                  onChange={setField("password")}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {err && (
              <div className="alert-box alert-error" role="alert" aria-live="assertive">
                {err}
              </div>
            )}

            {msg && (
              <div className="alert-box alert-success" role="status" aria-live="polite">
                {msg}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block submit-auth-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{mode === "login" ? "Signing In..." : "Creating Account..."}</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In to LostLink" : "Complete Registration"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            <button
              type="button"
              className="text-link-btn"
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login"
                ? "Don't have an account yet? Register here"
                : "Already registered? Sign in"}
            </button>
          </div>

          <button
            type="button"
            className="auth-tour-btn"
            onClick={() => setShowOnboarding(true)}
          >
            <Sparkles size={14} aria-hidden="true" />
            <span>Take a quick tour with Linky</span>
          </button>
        </div>
      </div>
    </LampIntro>
  );
}
