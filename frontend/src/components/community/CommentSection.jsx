import React, { useState } from 'react';
import { Send, MessageSquare, User, Loader2 } from 'lucide-react';
import { communityService } from '../../services/communityService';

export function CommentSection({ post, currentUser, onOpenAuth, onCommentAdded }) {
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await communityService.addComment(post.id, commentText);
      const newComment = res.comment;
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setCommentText('');
      if (onCommentAdded) {
        onCommentAdded(post.id, updatedComments.length);
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError(err.message || 'Failed to submit comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="comment-section-container">
      <div className="comments-header">
        <MessageSquare size={15} />
        <span>Comments ({comments.length})</span>
      </div>

      {/* Comment Input */}
      <form onSubmit={handleAddComment} className="comment-form-row">
        <div className="comment-user-avatar">
          {currentUser && currentUser.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.name} />
          ) : (
            <div className="avatar-placeholder">
              <User size={14} />
            </div>
          )}
        </div>

        <input
          type="text"
          className="comment-input-field"
          placeholder={
            currentUser
              ? 'Write a comment or travel tip...'
              : 'Sign in to join the conversation...'
          }
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isSubmitting}
        />

        <button
          type="submit"
          className="btn-send-comment"
          disabled={isSubmitting || !commentText.trim()}
        >
          {isSubmitting ? <Loader2 size={15} className="spinner" /> : <Send size={15} />}
        </button>
      </form>

      {error && <p className="comment-error-text">{error}</p>}

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments-text">No comments yet. Start the discussion!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-avatar">
                {comment.user?.avatarUrl ? (
                  <img src={comment.user.avatarUrl} alt={comment.user.name} />
                ) : (
                  <span>{comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>
              <div className="comment-bubble">
                <div className="comment-meta">
                  <span className="comment-author-name">{comment.user?.name || 'Traveler'}</span>
                  <span className="comment-timestamp">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="comment-body">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
