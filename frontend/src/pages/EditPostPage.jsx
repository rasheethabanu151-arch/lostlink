import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import Header from "../components/Header";
import PageIllustration from "../components/PageIllustration";
import { ArrowLeft, Loader2, Save } from "lucide-react";

const CATEGORIES = ["Phone", "Wallet", "Keys", "Bag", "Documents", "Other"];

export default function EditPostPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api("/api/posts/mine")
      .then((posts) => {
        const ownedPost = posts.find((item) => String(item.id) === id);
        if (!ownedPost) {
          setError("This report could not be found in your posts.");
          return;
        }
        if (ownedPost.status !== "OPEN") {
          setError("Claimed reports can no longer be edited.");
          return;
        }
        if (active) {
          setPost({
            type: ownedPost.type || "FOUND",
            title: ownedPost.title || "",
            category: ownedPost.category || "Other",
            location: ownedPost.location || "",
            description: ownedPost.description || "",
          });
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Could not load your report.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const updateField = (field) => (event) => {
    setPost((current) => ({ ...current, [field]: event.target.value }));
  };

  const savePost = async (event) => {
    event.preventDefault();
    if (!post) return;
    if (!post.title.trim() || !post.location.trim()) {
      setError("Enter an item title and location before saving.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await api(`/api/posts/${id}`, "PUT", {
        ...post,
        title: post.title.trim(),
        location: post.location.trim(),
        description: post.description.trim(),
      });
      nav("/my-posts");
    } catch (err) {
      setError(err.message || "Could not update your report.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-workspace">
      <Header />
      <main className="content-container create-post-container">
        <Link to="/my-posts" className="btn btn-ghost btn-sm back-nav-btn">
          <ArrowLeft size={16} />
          <span>Back to My Posts</span>
        </Link>

        <div className="create-post-header">
          <div className="create-post-heading-copy">
            <h1 className="page-title">Edit your report</h1>
            <p className="page-desc">Update the item details shown to the community.</p>
          </div>
          <PageIllustration scene="report" className="title-scene-art" />
        </div>

        {loading && (
          <div className="alert-box" role="status">
            <Loader2 size={18} className="animate-spin" />
            <span>Loading your report...</span>
          </div>
        )}

        {error && (
          <div className="alert-box alert-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {post && (
          <form className="form-card edit-post-form" onSubmit={savePost}>
            <div className="input-group">
              <label htmlFor="edit-post-type">Report type</label>
              <select id="edit-post-type" value={post.type} onChange={updateField("type")}>
                <option value="LOST">Lost item</option>
                <option value="FOUND">Found item</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="edit-post-title">Item title *</label>
              <input
                id="edit-post-title"
                type="text"
                maxLength={120}
                value={post.title}
                onChange={updateField("title")}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="input-group">
                <label htmlFor="edit-post-category">Category *</label>
                <select
                  id="edit-post-category"
                  value={post.category}
                  onChange={updateField("category")}
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="edit-post-location">Location / Area *</label>
                <input
                  id="edit-post-location"
                  type="text"
                  maxLength={160}
                  value={post.location}
                  onChange={updateField("location")}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="edit-post-description">Public description</label>
              <textarea
                id="edit-post-description"
                rows={4}
                maxLength={500}
                value={post.description}
                onChange={updateField("description")}
              />
              <span className="input-hint">Verification questions and answers stay unchanged.</span>
            </div>

            <div className="form-submit-row">
              <Link to="/my-posts" className="btn btn-secondary">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
