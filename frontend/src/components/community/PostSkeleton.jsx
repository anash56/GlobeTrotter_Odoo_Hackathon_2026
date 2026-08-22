import React from 'react';

export function PostSkeleton() {
  return (
    <div className="community-post-skeleton">
      <div className="skeleton-header-row">
        <div className="skeleton-avatar" />
        <div className="skeleton-user-info">
          <div className="skeleton-line short" />
          <div className="skeleton-line mini" />
        </div>
      </div>
      <div className="skeleton-title" />
      <div className="skeleton-line full" />
      <div className="skeleton-line full" />
      <div className="skeleton-line medium" />
      <div className="skeleton-image-block" />
      <div className="skeleton-actions-row">
        <div className="skeleton-btn" />
        <div className="skeleton-btn" />
        <div className="skeleton-btn" />
      </div>
    </div>
  );
}
