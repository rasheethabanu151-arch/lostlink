import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Calendar, Copy, MapPin, Phone, Tag, User } from "lucide-react";
import { api } from "../api";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";

export default function ClaimDetailsPage() {
  const { id } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClaim = () => {
    setLoading(true);
    setError("");
    api(`/api/claims/${id}`)
      .then(setClaim)
      .catch((err) => setError(err.message || "Could not load claim details."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClaim();
  }, [id]);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(claim.finderContact);
    } catch {
      setError("Could not copy the number. You can still select and copy it manually.");
    }
  };

  const verifiedAt = claim
    ? new Date(claim.verifiedAt).toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="page-workspace">
      <Header />
      <main className="content-container">
        <div className="claim-top-bar">
          <Link to="/my-posts" className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} />
            <span>Back to My Posts</span>
          </Link>
        </div>
        <div className="page-title-banner">
          <div>
            <h1 className="page-title">Verified Claim Details</h1>
            <p className="page-desc">Saved claim information for this successful ownership verification.</p>
          </div>
        </div>

        {loading && <div className="claim-details-card" role="status">Loading saved claim details…</div>}
        {!loading && error && (
          <div className="alert-box alert-error" role="alert">
            <AlertCircle size={18} />
            <div className="alert-text">
              <span>{error}</span>
              <button type="button" className="btn-retry" onClick={loadClaim}>Retry</button>
            </div>
          </div>
        )}
        {!loading && claim && (
          <article className="claim-details-card">
            <div className="post-badges-row">
              <StatusBadge status="CLAIMED" />
              <span className="claim-status-label">{claim.status}</span>
            </div>
            <h2 className="post-title">{claim.itemTitle}</h2>
            <div className="post-metadata-row claim-details-metadata">
              <span className="meta-tag"><Tag size={13} />{claim.itemCategory}</span>
              <span className="meta-tag"><MapPin size={13} />{claim.itemLocation}</span>
              <span className="meta-tag"><Calendar size={13} />Verified {verifiedAt}</span>
            </div>

            <dl className="claim-details-parties">
              <div><dt><User size={14} /> Finder</dt><dd>{claim.finderName}</dd></div>
              <div><dt><User size={14} /> Claimant</dt><dd>{claim.claimantName}</dd></div>
              <div><dt>Original post</dt><dd>#{claim.originalPostId}</dd></div>
            </dl>

            <section className="finder-contact-box" aria-label="Finder contact details">
              <span className="finder-contact-label">Finder's Phone Contact</span>
              <div className="contact-row">
                <Phone size={18} className="text-primary" />
                <a href={`tel:${claim.finderContact}`} className="contact-tel-link">{claim.finderContact}</a>
                <button type="button" className="btn btn-icon btn-sm copy-contact-btn" onClick={copyPhone} aria-label="Copy phone number">
                  <Copy size={16} />
                </button>
              </div>
              <div className="contact-action-row">
                <a href={`tel:${claim.finderContact}`} className="btn btn-primary btn-sm">
                  <Phone size={15} /><span>Call Finder</span>
                </a>
              </div>
            </section>
          </article>
        )}
      </main>
    </div>
  );
}
