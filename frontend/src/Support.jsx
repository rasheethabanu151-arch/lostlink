import React, { useEffect, useState } from "react";
import { api } from "./api";
import Header from "./components/Header";
import LinkyAvatar from "./components/LinkyAvatar";
import PageIllustration from "./components/PageIllustration";
import {
  LifeBuoy,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

const fmt = (d) => (d ? new Date(d).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "");

export default function Support({ header }) {
  const [text, setText] = useState("");
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const loadMessages = () => {
    setLoading(true);
    api("/api/support/mine")
      .then((data) => setList(data || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");

    if (!text.trim()) {
      setErr("Please type your message before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      await api("/api/support", "POST", { message: text.trim() });
      setText("");
      setOk("Your message has been sent to the LostLink support team.");
      loadMessages();
    } catch (e2) {
      setErr(e2.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-workspace">
      {header || <Header />}

      <main className="content-container support-page-container">
        {/* Title banner */}
        <div className="page-title-banner">
          <div className="page-title-icon-slot">
            <LifeBuoy size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="page-title">Help &amp; Support Team</h1>
            <p className="page-desc">
              Have a question about a post, account recovery, or claim dispute? Drop a note below and our team will reply directly.
            </p>
          </div>
          <PageIllustration scene="support" className="title-scene-art" />
        </div>

        {/* Small Companion Note */}
        <div className="support-assistant-card">
          <LinkyAvatar state="encouraging" size={50} />
          <div className="support-assistant-text">
            <b>Need guidance?</b>
            <p>Our team checks inquiries regularly. Please describe the item or issue with relevant details.</p>
          </div>
        </div>

        {/* Send message card */}
        <div className="form-card support-form-card">
          <h2 className="card-section-title">Send a Message</h2>
          <form onSubmit={handleSend}>
            <div className="input-group">
              <label htmlFor="support-message-text">Your inquiry or issue</label>
              <textarea
                id="support-message-text"
                rows={4}
                maxLength={1000}
                placeholder="Describe your issue or question in detail..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={submitting}
              />
              <span className="character-count-hint">{text.length}/1000 characters</span>
            </div>

            {err && (
              <div className="alert-box alert-error" role="alert">
                <AlertCircle size={16} />
                <span>{err}</span>
              </div>
            )}

            {ok && (
              <div className="alert-box alert-success" role="status">
                <CheckCircle2 size={16} />
                <span>{ok}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary submit-support-btn"
              disabled={submitting || !text.trim()}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sending message...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Send to Support</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* User's Message History */}
        <section className="support-history-section">
          <h2 className="section-title">Your Messages &amp; Replies</h2>

          {loading && (
            <div className="support-loading-slot">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span>Loading message history...</span>
            </div>
          )}

          {!loading && list && list.length === 0 && (
            <div className="empty-support-card">
              <MessageSquare size={32} className="text-muted" />
              <p>You haven't sent any support inquiries yet.</p>
            </div>
          )}

          {!loading && list && list.length > 0 && (
            <div className="support-messages-stack">
              {list.map((m) => {
                const isOpen = m.status === "OPEN";
                return (
                  <article key={m.id} className="support-ticket-card">
                    <div className="ticket-header">
                      <span className={`status-pill ${isOpen ? "status-pill-open" : "status-pill-claimed"}`}>
                        {isOpen ? (
                          <>
                            <Clock size={12} />
                            <span>Waiting for reply</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Replied</span>
                          </>
                        )}
                      </span>
                      <time className="ticket-date" dateTime={m.createdAt}>
                        {fmt(m.createdAt)}
                      </time>
                    </div>

                    <div className="ticket-query-text">
                      <p>{m.message}</p>
                    </div>

                    {m.reply && (
                      <div className="ticket-reply-box">
                        <div className="ticket-reply-header">
                          <span className="reply-author">LostLink Support Team</span>
                          {m.repliedAt && (
                            <time className="reply-time" dateTime={m.repliedAt}>
                              {fmt(m.repliedAt)}
                            </time>
                          )}
                        </div>
                        <p className="reply-content">{m.reply}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
