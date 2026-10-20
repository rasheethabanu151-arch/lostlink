import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, getRole, setRole, setToken, setUsername } from "./api";
import StatusBadge from "./components/StatusBadge";
import LinkyAvatar from "./components/LinkyAvatar";
import PageIllustration from "./components/PageIllustration";
import {
  Shield,
  Users,
  Search,
  Package,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  RefreshCw,
  LogOut,
  Send,
  ArrowLeft,
  Lock,
} from "lucide-react";

const fmt = (d) => (d ? new Date(d).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "-");
const isType = (p, t) => (p.type || "").toUpperCase() === t;

function PostTable({ rows, empty }) {
  if (!rows || !rows.length) {
    return <div className="admin-empty-box">{empty}</div>;
  }
  return (
    <div className="table-responsive-wrapper">
      <table className="admin-data-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Category</th>
            <th>Location</th>
            <th>Finder/Owner</th>
            <th>Status</th>
            <th>Claimed By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <td className="table-id-cell">{p.id}</td>
              <td className="table-title-cell">
                <strong>{p.title}</strong>
              </td>
              <td>
                <StatusBadge type={p.type} />
              </td>
              <td>{p.category}</td>
              <td>{p.location}</td>
              <td>{p.owner}</td>
              <td>
                <span className={`status-pill ${p.status === "CLAIMED" ? "status-pill-claimed" : "status-pill-open"}`}>
                  {p.status}
                </span>
              </td>
              <td>{p.claimedBy || "-"}</td>
              <td className="table-date-cell">{fmt(p.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Admin() {
  const nav = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    setErr("");
    Promise.all([
      api("/api/admin/stats").then(setStats),
      api("/api/admin/posts").then(setPosts),
      api("/api/admin/claim-attempts").then(setAttempts),
      api("/api/admin/messages").then(setMsgs),
    ])
      .catch((e) => setErr(e.message || "Failed to sync admin records."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (getRole() === "ADMIN") loadData();
  }, []);

  if (getRole() !== "ADMIN") return <Navigate to="/feed" replace />;

  const logout = () => {
    setToken(null);
    setUsername(null);
    setRole(null);
    nav("/");
  };

  const sendReply = async (id) => {
    const text = (drafts[id] || "").trim();
    if (!text) return;
    try {
      await api("/api/admin/messages/" + id + "/reply", "POST", { reply: text });
      setDrafts({ ...drafts, [id]: "" });
      loadData();
    } catch (e) {
      setErr(e.message || "Failed to submit reply.");
    }
  };

  const lost = posts.filter((p) => isType(p, "LOST"));
  const found = posts.filter((p) => isType(p, "FOUND"));
  const claimed = posts.filter((p) => (p.status || "").toUpperCase() === "CLAIMED");
  const openCount = stats ? stats.openMessages : 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "lost", label: `Lost items (${lost.length})`, icon: Search },
    { id: "found", label: `Found items (${found.length})`, icon: Package },
    { id: "claims", label: "Claims & Security", icon: CheckCircle2 },
    {
      id: "messages",
      label: `Messages ${openCount ? `(${openCount} open)` : ""}`,
      icon: MessageSquare,
    },
  ];

  const cards = stats
    ? [
        { icon: Users, n: stats.users, label: "Registered Users", color: "indigo" },
        { icon: Search, n: stats.lostPosts, label: "Lost Items Reported", color: "rose" },
        { icon: Package, n: stats.foundPosts, label: "Found Items Reported", color: "emerald" },
        { icon: CheckCircle2, n: stats.claimed, label: "Successfully Claimed", color: "purple" },
        { icon: AlertTriangle, n: stats.failedClaimUsers, label: "Users with Failed Attempts", color: "amber" },
        { icon: MessageSquare, n: stats.openMessages, label: "Open Support Inquiries", color: "blue" },
      ]
    : [];

  return (
    <div className="page-workspace admin-workspace">
      {/* Admin Top Bar */}
      <header className="admin-header">
        <div className="admin-header-container">
          <div className="admin-brand">
            <span className="brand-icon">🔗</span>
            <span className="brand-text">LostLink Admin Console</span>
            <span className="admin-role-badge">Superuser</span>
          </div>

          <div className="admin-top-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => nav("/feed")}
            >
              <ArrowLeft size={15} />
              <span>User Feed</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost-danger btn-sm"
              onClick={logout}
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="content-container admin-main-container">
        {/* Navigation Tabs Bar */}
        <div className="admin-tabs-bar" role="tablist">
          <div className="tabs-pill-list">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`admin-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <Icon size={15} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm refresh-btn"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Sync</span>
          </button>
        </div>

        {err && (
          <div className="alert-box alert-error" role="alert">
            <AlertTriangle size={18} />
            <span>{err}</span>
          </div>
        )}

        {/* Tab 1: Overview Dashboard */}
        {tab === "overview" && (
          <div className="admin-overview-view">
            <div className="admin-visual-banner">
              <PageIllustration scene="community" />
              <div>
                <h1 className="page-title">Community overview</h1>
                <p className="page-desc">A clear view of reports, returns, and support activity.</p>
              </div>
            </div>
            <div className="stat-cards-grid">
              {cards.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.label} className={`admin-stat-card card-accent-${c.color}`}>
                    <div className="stat-icon-wrapper">
                      <Icon size={22} />
                    </div>
                    <div className="stat-value">{c.n}</div>
                    <div className="stat-caption">{c.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="admin-quick-summary-card">
              <div className="quick-summary-header">
                <LinkyAvatar state="idle" size={44} />
                <div>
                  <h3 className="summary-title">System Status: Active &amp; Guarded</h3>
                  <p className="summary-desc">
                    {stats ? `${stats.claimed} items returned, ${stats.openMessages} tickets awaiting review.` : "Syncing latest platform metrics..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Lost Items */}
        {tab === "lost" && (
          <div className="admin-section-pane">
            <h2 className="pane-title">All Reported Lost Items</h2>
            <PostTable rows={lost} empty="No lost items in records." />
          </div>
        )}

        {/* Tab 3: Found Items */}
        {tab === "found" && (
          <div className="admin-section-pane">
            <h2 className="pane-title">All Reported Found Items</h2>
            <PostTable rows={found} empty="No found items in records." />
          </div>
        )}

        {/* Tab 4: Claims & Security */}
        {tab === "claims" && (
          <div className="admin-section-pane">
            <h2 className="pane-title">Successfully Claimed Items</h2>
            <PostTable rows={claimed} empty="No items have been claimed yet." />

            <h2 className="pane-title mt-8">Security: Claim Attempt Records</h2>
            <p className="pane-desc">Users who failed verification questions and their lock status.</p>
            {attempts.length === 0 ? (
              <div className="admin-empty-box">No failed claim attempts logged.</div>
            ) : (
              <div className="table-responsive-wrapper">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Post Title</th>
                      <th>Failed Attempts</th>
                      <th>Lockout Expiry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempts.map((a, i) => (
                      <tr key={i}>
                        <td><strong>{a.user}</strong></td>
                        <td>{a.post}</td>
                        <td>
                          <span className="badge-warning-pill">{a.failures} fails</span>
                        </td>
                        <td>{a.lockedUntil ? fmt(a.lockedUntil) : "Unlocked"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Messages & Support Tickets */}
        {tab === "messages" && (
          <div className="admin-section-pane">
            <h2 className="pane-title">Support Ticket Inbox</h2>
            {msgs.length === 0 && (
              <div className="admin-empty-box">No messages from users.</div>
            )}
            <div className="admin-ticket-list">
              {msgs.map((m) => {
                const isOpen = m.status === "OPEN";
                return (
                  <div key={m.id} className="admin-message-card">
                    <div className="admin-msg-header">
                      <div className="msg-sender-info">
                        <strong>{m.username}</strong>
                        <span className="msg-email-text">{m.email}</span>
                      </div>
                      <span className={`status-pill ${isOpen ? "status-pill-open" : "status-pill-claimed"}`}>
                        {m.status}
                      </span>
                      <time className="msg-time-label">{fmt(m.createdAt)}</time>
                    </div>

                    <p className="admin-msg-text">{m.message}</p>

                    {m.reply ? (
                      <div className="admin-sent-reply-box">
                        <div className="reply-meta-row">
                          <span className="reply-author-label">Reply sent</span>
                          <time>{fmt(m.repliedAt)}</time>
                        </div>
                        <p>{m.reply}</p>
                      </div>
                    ) : (
                      <div className="admin-reply-editor">
                        <textarea
                          rows={2}
                          placeholder="Type your response to this user..."
                          value={drafts[m.id] || ""}
                          onChange={(e) =>
                            setDrafts({ ...drafts, [m.id]: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm send-reply-btn"
                          onClick={() => sendReply(m.id)}
                          disabled={!(drafts[m.id] || "").trim()}
                        >
                          <Send size={14} />
                          <span>Send Response</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
