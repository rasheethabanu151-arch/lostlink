import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import LinkyAvatar from "../components/LinkyAvatar";
import LinkyBubble from "../components/LinkyBubble";
import PageIllustration from "../components/PageIllustration";
import EmptyState from "../components/EmptyState";
import { PostListSkeleton } from "../components/Skeleton";
import { Sparkles, MapPin, Tag, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

const ICONS = { Phone: "📱", Wallet: "👛", Keys: "🔑", Bag: "🎒", Documents: "🪪", Other: "📦" };

export default function SuggestionsPage() {
  const nav = useNavigate();
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const loadSuggestions = () => {
    setLoading(true);
    setFetchError("");
    api("/api/posts/suggestions")
      .then((data) => setGroups(data || []))
      .catch((err) => {
        setFetchError(err.message || "Failed to load suggestions.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  return (
    <div className="page-workspace">
      <Header />

      <main className="content-container">
        {/* Hero header */}
        <div className="page-title-banner">
          <div className="page-title-icon-slot">
            <Sparkles size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="page-title">Smart Match Suggestions</h1>
            <p className="page-desc">
              Automatic suggestions comparing your active posts with complementary reports in the same location and category.
            </p>
          </div>
          <PageIllustration scene="matches" className="title-scene-art" />
        </div>

        {/* Linky Tip */}
        <LinkyBubble
          title="Potential Matches"
          text="These are potential matches based on location and category. To claim a found item, you will need to answer the finder's verification questions."
          state={groups && groups.length > 0 ? "happy" : "searching"}
          storageKey="suggestions_notice"
        />

        {fetchError && (
          <div className="alert-box alert-error" role="alert">
            <AlertCircle size={18} />
            <div className="alert-text">
              <span>{fetchError}</span>
              <button type="button" className="btn-retry" onClick={loadSuggestions}>
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          </div>
        )}

        {loading && <PostListSkeleton count={3} />}

        {!loading && groups && groups.length === 0 && (
          <EmptyState
            title="No suggestions right now"
            message="We haven't found any overlapping lost and found items in your location yet. When someone reports an item matching your category and city, it will appear here."
            actionLabel="View All Posts"
            onAction={() => nav("/feed")}
            characterState="searching"
          />
        )}

        {!loading && groups && groups.length > 0 && (
          <div className="suggestions-list">
            {groups.map((g) => (
              <div key={g.myPost.id} className="suggestion-group-card">
                {/* User's Anchor Post */}
                <div className="suggestion-anchor-header">
                  <div className="anchor-label-row">
                    <span className="anchor-badge">Based on your report</span>
                    <StatusBadge type={g.myPost.type} />
                  </div>
                  <h2 className="anchor-title">
                    <span className="anchor-icon">{ICONS[g.myPost.category] || "📦"}</span>
                    <span>{g.myPost.title}</span>
                  </h2>
                  <div className="anchor-meta">
                    <span>{g.myPost.category}</span>
                    <span>•</span>
                    <span>{g.myPost.location}</span>
                  </div>
                </div>

                {/* Matched Items */}
                <div className="suggestion-matches-container">
                  <h3 className="matches-subtitle">
                    Possible Matches ({g.matches.length})
                  </h3>

                  <div className="matches-grid">
                    {g.matches.map((m) => {
                      const isFound = (m.type || "").toUpperCase() === "FOUND";
                      return isFound ? (
                        <Link
                          key={m.id}
                          to={`/claim/${m.id}`}
                          className="match-item-card match-clickable"
                        >
                          <div className="match-icon">{ICONS[m.category] || "📦"}</div>
                          <PageIllustration scene="matches" className="match-scene-art" />
                          <div className="match-info">
                            <div className="match-title-row">
                              <StatusBadge type="FOUND" />
                              <h4 className="match-title">{m.title}</h4>
                            </div>
                            <div className="match-meta">
                              <span><Tag size={12} /> {m.category}</span>
                              <span><MapPin size={12} /> {m.location}</span>
                            </div>
                          </div>
                          <div className="match-cta">
                            <span>Verify &amp; Claim</span>
                            <ArrowRight size={14} />
                          </div>
                        </Link>
                      ) : (
                        <div key={m.id} className="match-item-card match-informational">
                          <div className="match-icon">{ICONS[m.category] || "📦"}</div>
                          <PageIllustration scene="matches" className="match-scene-art" />
                          <div className="match-info">
                            <div className="match-title-row">
                              <StatusBadge type="LOST" />
                              <h4 className="match-title">{m.title}</h4>
                            </div>
                            <div className="match-meta">
                              <span><Tag size={12} /> {m.category}</span>
                              <span><MapPin size={12} /> {m.location}</span>
                            </div>
                            <p className="match-hint">Someone may be looking for the item you found.</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
