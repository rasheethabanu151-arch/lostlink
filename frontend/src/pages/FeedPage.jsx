import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getUsername } from "../api";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import LinkyAvatar from "../components/LinkyAvatar";
import LinkyBubble from "../components/LinkyBubble";
import PageIllustration from "../components/PageIllustration";
import ConfirmModal from "../components/ConfirmModal";
import OnboardingGuide from "../components/OnboardingGuide";
import { PostListSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import {
  Search,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Tag,
  Filter,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const CATEGORIES = ["All", "Phone", "Wallet", "Keys", "Bag", "Documents", "Other"];
const ICONS = { Phone: "📱", Wallet: "👛", Keys: "🔑", Bag: "🎒", Documents: "🪪", Other: "📦" };

export default function FeedPage() {
  const nav = useNavigate();
  const onboardingStorageKey = `lostlink_onboarding_v1_${getUsername() || "user"}`;
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(onboardingStorageKey);
      if (!seen) setShowOnboarding(true);
    } catch {}
  }, [onboardingStorageKey]);

  // Client-side filtering & search controls
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL | LOST | FOUND
  const [categoryFilter, setCategoryFilter] = useState("All");

  const loadPosts = () => {
    setLoading(true);
    setFetchError("");
    api("/api/posts")
      .then((data) => {
        setPosts(data || []);
      })
      .catch((err) => {
        setFetchError(err.message || "Could not retrieve posts. Please check your connection.");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api("/api/posts/" + deleteTargetId, "DELETE");
      setDeleteTargetId(null);
      loadPosts();
    } catch (e) {
      alert(e.message || "Failed to delete post.");
    }
  };

  // Filtered & sorted posts list
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((p) => {
      // Type filter
      if (typeFilter !== "ALL" && (p.type || "FOUND").toUpperCase() !== typeFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== "All" && p.category !== categoryFilter) {
        return false;
      }
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = (p.title || "").toLowerCase().includes(q);
        const inLoc = (p.location || "").toLowerCase().includes(q);
        const inCat = (p.category || "").toLowerCase().includes(q);
        if (!inTitle && !inLoc && !inCat) return false;
      }
      return true;
    });
  }, [posts, typeFilter, categoryFilter, searchQuery]);

  const username = getUsername() || "Friend";

  return (
    <div className="page-workspace">
      <Header />
      <OnboardingGuide
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        storageKey={onboardingStorageKey}
      />

      <main className="content-container">
        {/* Welcome Banner with Linky */}
        <section className="feed-hero-section">
          <div className="hero-welcome-card">
            <div className="hero-avatar-area">
              <LinkyAvatar
                state={loading ? "searching" : posts && posts.length > 0 ? "happy" : "encouraging"}
                size={70}
                interactive
              />
            </div>
            <div className="hero-text-area">
              <h1 className="hero-headline">Hi, {username}!</h1>
              <p className="hero-subtext">
                Browse recent lost and found reports. Notice something familiar? Answer the finder's verification questions to claim it safely.
              </p>
            </div>
            <PageIllustration scene="community" className="feed-hero-art" />
            <div className="hero-action-area">
              <Link to="/new" className="btn btn-primary hero-btn">
                <Plus size={16} />
                <span>Report Item</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Filter & Search Toolbar */}
        <section className="feed-toolbar" aria-label="Search and filter items">
          <div className="search-input-wrap">
            <Search size={17} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by title, category, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search posts"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-pill-row">
            {/* Type buttons */}
            <div className="segmented-control" role="group" aria-label="Filter by item type">
              <button
                type="button"
                className={`seg-btn ${typeFilter === "ALL" ? "active" : ""}`}
                onClick={() => setTypeFilter("ALL")}
              >
                All Items
              </button>
              <button
                type="button"
                className={`seg-btn ${typeFilter === "LOST" ? "active" : ""}`}
                onClick={() => setTypeFilter("LOST")}
              >
                Lost
              </button>
              <button
                type="button"
                className={`seg-btn ${typeFilter === "FOUND" ? "active" : ""}`}
                onClick={() => setTypeFilter("FOUND")}
              >
                Found
              </button>
            </div>

            {/* Category select dropdown */}
            <div className="category-select-wrap">
              <Tag size={15} className="cat-icon" aria-hidden="true" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : `${ICONS[cat] || "📦"} ${cat}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Error Notification */}
        {fetchError && (
          <div className="alert-box alert-error" role="alert">
            <AlertCircle size={18} />
            <div className="alert-text">
              <span>{fetchError}</span>
              <button type="button" className="btn-retry" onClick={loadPosts}>
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Feed Content List */}
        <section className="feed-posts-section">
          {loading && <PostListSkeleton count={4} />}

          {!loading && filteredPosts.length === 0 && (
            <EmptyState
              title={posts && posts.length === 0 ? "No items reported yet" : "No matches found"}
              message={
                posts && posts.length === 0
                  ? "Be the first to report a lost or found item and help your community!"
                  : "Try adjusting your search keywords or resetting the category filter."
              }
              actionLabel={posts && posts.length === 0 ? "+ Create First Post" : "Reset Filters"}
              onAction={
                posts && posts.length === 0
                  ? () => nav("/new")
                  : () => {
                      setSearchQuery("");
                      setTypeFilter("ALL");
                      setCategoryFilter("All");
                    }
              }
              characterState="encouraging"
            />
          )}

          {!loading && filteredPosts.length > 0 && (
            <div className="posts-grid" role="feed" aria-label="Recent lost and found items">
              {filteredPosts.map((p) => {
                const isLost = (p.type || "").toUpperCase() === "LOST";
                return (
                  <article key={p.id} className="post-card">
                    <div className="post-card-inner">
                      {/* Left category icon badge */}
                      <div className="post-category-avatar" aria-hidden="true">
                        {ICONS[p.category] || "📦"}
                      </div>

                      {/* Middle Details */}
                      <div className="post-main-info">
                        <div className="post-badges-row">
                          <StatusBadge type={p.type} />
                          {p.mine && <span className="owner-badge">Your Post</span>}
                          {p.status === "CLAIMED" && <StatusBadge status="CLAIMED" />}
                        </div>

                        <h2 className="post-title">{p.title}</h2>

                        {p.description && (
                          <p className="post-description-preview">{p.description}</p>
                        )}

                        <div className="post-metadata-row">
                          <span className="meta-tag">
                            <Tag size={13} aria-hidden="true" />
                            <span>{p.category}</span>
                          </span>
                          <span className="meta-tag">
                            <MapPin size={13} aria-hidden="true" />
                            <span>{p.location}</span>
                          </span>
                          <span className="meta-tag">
                            <Calendar size={13} aria-hidden="true" />
                            <time dateTime={p.createdAt}>
                              {new Date(p.createdAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </time>
                          </span>
                        </div>
                      </div>

                      {/* Right Action Area */}
                      <div className="post-actions-col">
                        {!isLost && !p.mine && (
                          <Link
                            to={`/claim/${p.id}`}
                            className="btn btn-primary btn-sm claim-cta-btn"
                          >
                            <span>Claim item</span>
                            <ArrowRight size={14} />
                          </Link>
                        )}

                        {isLost && (
                          <div className="lost-indicator-pill">
                            <span>Lost Report</span>
                          </div>
                        )}

                        {p.mine && (
                          <button
                            type="button"
                            className="btn btn-ghost-danger btn-sm delete-post-btn"
                            onClick={() => setDeleteTargetId(p.id)}
                            aria-label={`Delete post ${p.title}`}
                          >
                            <Trash2 size={15} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Floating action button for quick creation */}
        <Link
          to="/new"
          className="fab-post-btn"
          aria-label="Create a new lost or found post"
          title="Create post"
        >
          <Plus size={24} />
        </Link>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteTargetId}
          title="Delete this post?"
          message="This will permanently remove the post and all its verification questions from LostLink."
          confirmText="Yes, Delete Post"
          cancelText="Keep Post"
          isDanger={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTargetId(null)}
        />
      </main>
    </div>
  );
}
