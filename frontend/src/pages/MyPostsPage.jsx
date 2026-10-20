import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import LinkyAvatar from "../components/LinkyAvatar";
import ConfirmModal from "../components/ConfirmModal";
import EmptyState from "../components/EmptyState";
import PageIllustration from "../components/PageIllustration";
import { PostListSkeleton } from "../components/Skeleton";
import {
  Inbox,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Pencil,
} from "lucide-react";

const ICONS = { Phone: "📱", Wallet: "👛", Keys: "🔑", Bag: "🎒", Documents: "🪪", Other: "📦" };

export default function MyPostsPage() {
  const nav = useNavigate();
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadMyPosts = () => {
    setLoading(true);
    setFetchError("");
    api("/api/posts/mine")
      .then((data) => setPosts(data || []))
      .catch((err) => {
        setFetchError(err.message || "Failed to load your posts.");
        setPosts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMyPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api("/api/posts/" + deleteTargetId, "DELETE");
      setDeleteTargetId(null);
      loadMyPosts();
    } catch (err) {
      alert(err.message || "Failed to delete post.");
    }
  };

  return (
    <div className="page-workspace">
      <Header />

      <main className="content-container">
        {/* Header Section */}
        <div className="page-title-banner">
          <div className="page-title-icon-slot">
            <Inbox size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="page-title">My Reports &amp; Posts</h1>
            <p className="page-desc">
              Manage your published lost and found listings and check if any have been verified and claimed.
            </p>
          </div>
          <PageIllustration scene="community" className="title-scene-art" />
          <div className="title-banner-action">
            <Link to="/new" className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Create New Post</span>
            </Link>
          </div>
        </div>

        {fetchError && (
          <div className="alert-box alert-error" role="alert">
            <AlertCircle size={18} />
            <div className="alert-text">
              <span>{fetchError}</span>
              <button type="button" className="btn-retry" onClick={loadMyPosts}>
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          </div>
        )}

        {loading && <PostListSkeleton count={3} />}

        {!loading && posts && posts.length === 0 && (
          <EmptyState
            title="You haven't posted anything yet"
            message="When you report a lost item or something you found, it will appear here so you can track claims."
            actionLabel="+ Create your first post"
            onAction={() => nav("/new")}
            characterState="encouraging"
          />
        )}

        {!loading && posts && posts.length > 0 && (
          <div className="posts-grid" role="feed" aria-label="Your listings">
            {posts.map((p) => {
              const isClaimed = p.status === "CLAIMED";
              return (
                <article key={p.id} className="post-card my-post-card">
                  <div className="post-card-inner">
                    <div className="post-category-avatar">
                      {ICONS[p.category] || "📦"}
                    </div>

                    <div className="post-main-info">
                      <div className="post-badges-row">
                        <StatusBadge type={p.type} />
                        <StatusBadge status={p.status} />
                      </div>

                      <h2 className="post-title">{p.title}</h2>

                      {p.description && (
                        <p className="post-description-preview">{p.description}</p>
                      )}

                      <div className="post-metadata-row">
                        <span className="meta-tag">
                          <Tag size={13} />
                          <span>{p.category}</span>
                        </span>
                        <span className="meta-tag">
                          <MapPin size={13} />
                          <span>{p.location}</span>
                        </span>
                        <span className="meta-tag">
                          <Calendar size={13} />
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

                      {isClaimed && p.claimedBy && (
                        <div className="claimed-by-banner">
                          <CheckCircle2 size={15} className="text-success" />
                          <span>Successfully verified &amp; claimed by <strong>{p.claimedBy}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="post-actions-col">
                      {p.status === "OPEN" && (
                        <Link
                          to={`/edit/${p.id}`}
                          className="btn btn-secondary btn-sm"
                          aria-label={`Edit post ${p.title}`}
                        >
                          <Pencil size={14} />
                          <span>Edit</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        className="btn btn-ghost-danger btn-sm delete-post-btn"
                        onClick={() => setDeleteTargetId(p.id)}
                        aria-label={`Delete post ${p.title}`}
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deleteTargetId}
          title="Delete this post?"
          message="This will permanently delete your listing and remove all its verification questions."
          confirmText="Yes, Delete Post"
          cancelText="Cancel"
          isDanger={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTargetId(null)}
        />
      </main>
    </div>
  );
}
