import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUsername, getRole, setToken, setUsername, setRole } from "../api";
import LinkyAvatar from "./LinkyAvatar";
import ConfirmModal from "./ConfirmModal";
import {
  Compass,
  Sparkles,
  Inbox,
  LifeBuoy,
  Shield,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";

export default function Header() {
  const nav = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const username = getUsername() || "Friend";
  const role = getRole();
  const isAdmin = role === "ADMIN";

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setRole(null);
    nav("/");
  };

  const navItemClass = ({ isActive }) =>
    `nav-item ${isActive ? "nav-item-active" : ""}`;

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          {/* Brand Logo & Companion */}
          <Link to="/feed" className="brand-logo" aria-label="LostLink Home">
            <img className="brand-mark" src="/penguin-logo.png" alt="" />
            <span className="brand-text">LostLink</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <NavLink to="/feed" className={navItemClass}>
              <Compass size={16} />
              <span>Feed</span>
            </NavLink>
            <NavLink to="/suggestions" className={navItemClass}>
              <Sparkles size={16} />
              <span>Suggestions</span>
            </NavLink>
            <NavLink to="/my-posts" className={navItemClass}>
              <Inbox size={16} />
              <span>My Posts</span>
            </NavLink>
            <NavLink to="/support" className={navItemClass}>
              <LifeBuoy size={16} />
              <span>Support</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navItemClass}>
                <Shield size={16} />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>

          {/* Right Area: Post CTA + User Identity + Logout */}
          <div className="header-right">
            <Link to="/new" className="btn btn-primary btn-sm header-post-btn">
              <PlusCircle size={15} />
              <span>Report Item</span>
            </Link>

            <div className="user-profile-badge" title={`Signed in as ${username}`}>
              <div className="user-avatar-circle">
                <LinkyAvatar state="idle" size={26} />
              </div>
              <span className="user-name-text">{username}</span>
              {isAdmin && <span className="admin-pill">Admin</span>}
            </div>

            <button
              type="button"
              className="btn btn-icon btn-ghost logout-btn"
              onClick={() => setShowLogoutModal(true)}
              title="Sign out of LostLink"
              aria-label="Logout"
            >
              <LogOut size={17} />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              className="btn btn-icon mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="mobile-nav-drawer" aria-label="Mobile Navigation">
            <NavLink
              to="/feed"
              className={navItemClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass size={18} />
              <span>Feed &amp; Explore</span>
            </NavLink>
            <NavLink
              to="/suggestions"
              className={navItemClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles size={18} />
              <span>Smart Suggestions</span>
            </NavLink>
            <NavLink
              to="/new"
              className={navItemClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <PlusCircle size={18} />
              <span>Report Lost or Found</span>
            </NavLink>
            <NavLink
              to="/my-posts"
              className={navItemClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Inbox size={18} />
              <span>My Posts &amp; Claims</span>
            </NavLink>
            <NavLink
              to="/support"
              className={navItemClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LifeBuoy size={18} />
              <span>Help &amp; Support</span>
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={navItemClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield size={18} />
                <span>Admin Control</span>
              </NavLink>
            )}
            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="btn btn-outline-danger w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
              >
                <LogOut size={16} />
                <span>Sign Out ({username})</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Logout confirmation modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Sign out of LostLink?"
        message="You will need to sign in again to create posts, answer verification questions, or review claims."
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        isDanger={false}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
