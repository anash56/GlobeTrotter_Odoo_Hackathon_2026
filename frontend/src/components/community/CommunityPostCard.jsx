import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, MapPin, Trash2, Calendar, Tag, Check, Image as ImageIcon } from 'lucide-react';
import { CommentSection } from './CommentSection';
import { communityService } from '../../services/communityService';

export function CommunityPostCard({
  post,
  currentUser,
  onOpenAuth,
  onDeletePost,
  onShowToast,
}) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const isOwner = currentUser && (currentUser.id === post.author?.id || currentUser.id === post.userId);

  const handleToggleLike = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI update
    const nextIsLiked = !isLiked;
    const nextCount = nextIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setIsLiked(nextIsLiked);
    setLikeCount(nextCount);

    try {
      const res = await communityService.toggleLike(post.id);
      setIsLiked(res.isLiked);
      setLikeCount(res.likeCount);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert on error
      setIsLiked(!nextIsLiked);
      setLikeCount(likeCount);
      if (onShowToast) {
        onShowToast('Could not update like status. Please try again.', 'error');
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleSharePost = () => {
    const postUrl = `${window.location.origin}/community#post-${post.id}`;
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    if (onShowToast) {
      onShowToast('Post link copied to clipboard!', 'success');
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hr ago' : 'hrs ago'}`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day ago' : 'days ago'}`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article className="community-post-card" id={`post-${post.id}`}>
      {/* 1. Card Header */}
      <div className="post-card-header">
        <div className="post-author-info">
          <div className="author-avatar-wrapper">
            {post.author?.avatarUrl ? (
              <img src={post.author.avatarUrl} alt={post.author.name} className="author-avatar" />
            ) : (
              <div className="author-avatar-fallback">
                {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'T'}
              </div>
            )}
          </div>

          <div className="author-details">
            <div className="author-name-row">
              <h4 className="author-name">{post.author?.name || 'Fellow Traveler'}</h4>
              {post.category && (
                <span className="category-pill">
                  <Tag size={10} /> {post.category}
                </span>
              )}
            </div>

            <div className="post-meta-row">
              {post.destination && (
                <span className="destination-tag">
                  <MapPin size={12} /> {post.destination}
                </span>
              )}
              <span className="post-date">
                <Calendar size={12} /> {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Delete button for post owner */}
        {isOwner && (
          <button
            type="button"
            className="btn-delete-post"
            onClick={() => onDeletePost(post.id)}
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* 2. Post Title & Content */}
      <div className="post-body">
        {post.title && <h3 className="post-title">{post.title}</h3>}
        <p className="post-content">{post.content}</p>
      </div>

      {/* 3. Optional Post Image */}
      {post.imageUrl && (
        <div className="post-image-wrapper" onClick={() => setShowImageModal(true)}>
          <img src={post.imageUrl} alt={post.title || 'Travel photo'} className="post-image" />
          <div className="image-overlay-hint">
            <ImageIcon size={16} /> Click to expand
          </div>
        </div>
      )}

      {/* Image Modal Lightbox */}
      {showImageModal && (
        <div className="image-lightbox-backdrop" onClick={() => setShowImageModal(false)}>
          <div className="image-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={post.imageUrl} alt={post.title} />
            <button
              type="button"
              className="btn-close-lightbox"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 4. Post Actions (Like, Comment, Share) */}
      <div className="post-actions-bar">
        <button
          type="button"
          className={`action-btn btn-like ${isLiked ? 'liked' : ''}`}
          onClick={handleToggleLike}
          disabled={isLiking}
        >
          <Heart size={18} fill={isLiked ? '#EF4444' : 'none'} color={isLiked ? '#EF4444' : '#64748B'} />
          <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button
          type="button"
          className={`action-btn btn-comment ${showComments ? 'active' : ''}`}
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare size={18} />
          <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
        </button>

        <button
          type="button"
          className="action-btn btn-share"
          onClick={handleSharePost}
        >
          {copied ? <Check size={18} color="#10B981" /> : <Share2 size={18} />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* 5. Expandable Comment Section */}
      {showComments && (
        <CommentSection
          post={post}
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          onCommentAdded={(postId, count) => setCommentCount(count)}
        />
      )}
    </article>
  );
}
