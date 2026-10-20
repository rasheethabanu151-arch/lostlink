import React from "react";

export function PostCardSkeleton() {
  return (
    <div className="card post-card skeleton-card" aria-hidden="true">
      <div className="skeleton-icon-slot" />
      <div className="skeleton-details">
        <div className="skeleton-line skeleton-badge" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-meta" />
      </div>
    </div>
  );
}

export function PostListSkeleton({ count = 3 }) {
  return (
    <div className="skeleton-list" aria-busy="true" aria-label="Loading items...">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
