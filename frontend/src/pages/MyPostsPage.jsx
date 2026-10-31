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
  User,
} from "lucide-react";

const ICONS = { Phone: "📱", Wallet: "👛", Keys: "🔑", Bag: "🎒", Documents: "🪪", Other: "📦" };

export default function MyPostsPage() {
  const nav = useNavigate();
  const [posts, setPosts] = useState(null);
  const [claimedItems, setClaimedItems] = useState([]);
  const [foundClaims, setFoundClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [claimsError, setClaimsError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const loadMyPosts = () => {
    setLoading(true);
    setLoadingClaims(true);
    setFetchError("");
    setClaimsError("");
    api("/api/posts/mine")
      .then((data) => setPosts(data || []))
      .catch((err) => {
        setFetchError(err.message || "Failed to load your posts.");
        setPosts([]);
      })
      .finally(() => setLoading(false));
    Promise.all([
      api("/api/claims/mine")
        .then((data) => setClaimedItems(data || []))
        .catch((err) => {
          setClaimsError(err.message || "Failed to load your claimed items.");
          setClaimedItems([]);
        }),
      api("/api/claims/found-by-me")
        .then((data) => setFoundClaims(data || []))
        .catch((err) => {
          setClaimsError(err.message || "Failed to load successful claims on your posts.");
          setFoundClaims([]);
        }),
    ]).finally(() => setLoadingClaims(false));
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

  const copyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
    } catch {
      alert("Could not copy the number. You can still select and copy it manually.");
    }
  };

  const formatClaimTime = (date) =>
    new Date(date).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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

        <section className="claim-history-section" aria-labelledby="my-claimed-items-heading">
          <div className="claim-history-heading">
            <div>
              <h2 id="my-claimed-items-heading">My Claimed Items</h2>
              <p>Items you successfully verified and the finder’s contact details.</p>
            </div>
          </div>
          {claimsError && (
            <div className="alert-box alert-error" role="alert">
              <AlertCircle size={18} />
              <div className="alert-text">
                <span>{claimsError}</span>
                <button type="button" className="btn-retry" onClick={loadMyPosts}>
                  <RefreshCw size={14} /> Retry
                </button>
              </div>
            </div>
          )}
          {loadingClaims && <PostListSkeleton count={1} />}
          {!loadingClaims && !claimsError && claimedItems.length === 0 && (
            <p className="claim-history-empty">You have no successfully verified claims yet.</p>
          )}
          {!loadingClaims && claimedItems.length > 0 && (
            <div className="posts-grid">
              {claimedItems.map((claim) => (
                <article key={claim.id} className="post-card">
                  <div className="post-card-inner">
                    <div className="post-category-avatar">{ICONS[claim.itemCategory] || "📦"}</div>
                    <div className="post-main-info">
                      <div className="post-badges-row">
                        <StatusBadge status="CLAIMED" />
                      </div>
                      <h3 className="post-title">{claim.itemTitle}</h3>
                      <div className="post-metadata-row">
                        <span className="meta-tag"><Tag size={13} />{claim.itemCategory}</span>
                        <span className="meta-tag"><MapPin size={13} />{claim.itemLocation}</span>
                        <span className="meta-tag"><Calendar size={13} />{formatClaimTime(claim.verifiedAt)}</span>
                      </div>
                      <p className="claim-history-contact">
                        Finder: <strong>{claim.finderName}</strong> · <a href={`tel:${claim.finderContact}`}>{claim.finderContact}</a>
                      </p>
                      <div className="claim-history-actions">
                        <a href={`tel:${claim.finderContact}`} className="btn btn-primary btn-sm">Call Finder</a>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => copyPhone(claim.finderContact)}>
                          Copy Phone Number
                        </button>
                        <Link to={`/claims/${claim.id}`} className="btn btn-secondary btn-sm">View Claim Details</Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="claim-history-section" aria-labelledby="successful-claims-heading">
          <div className="claim-history-heading">
            <div>
              <h2 id="successful-claims-heading">Successfully Claimed Items</h2>
              <p>Successful ownership verifications for items you posted.</p>
            </div>
          </div>
          {loadingClaims && <PostListSkeleton count={1} />}
          {!loadingClaims && !claimsError && foundClaims.length === 0 && (
            <p className="claim-history-empty">No items you posted have been successfully claimed yet.</p>
          )}
          {!loadingClaims && foundClaims.length > 0 && (
            <div className="posts-grid">
              {foundClaims.map((claim) => (
                <article key={claim.id} className="post-card">
                  <div className="post-card-inner">
                    <div className="post-category-avatar">{ICONS[claim.itemCategory] || "📦"}</div>
                    <div className="post-main-info">
                      <div className="post-badges-row">
                        <StatusBadge status="CLAIMED" />
                      </div>
                      <h3 className="post-title">{claim.itemTitle}</h3>
                      <div className="post-metadata-row">
                        <span className="meta-tag"><User size={13} />Claimed by {claim.claimantName}</span>
                        <span className="meta-tag"><Calendar size={13} />{formatClaimTime(claim.verifiedAt)}</span>
                      </div>
                    </div>
                    <div className="post-actions-col">
                      <Link to={`/claims/${claim.id}`} className="btn btn-secondary btn-sm">View Claim Details</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

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
