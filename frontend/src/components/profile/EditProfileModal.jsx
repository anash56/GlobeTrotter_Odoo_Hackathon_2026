import React, { useState, useEffect } from 'react';
import { X, User, Image, Mail, AlertCircle, Info } from 'lucide-react';

export function EditProfileModal({ isOpen, onClose, onSubmit, currentUser, isLoading }) {
  const [name, setName] = useState(currentUser?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAvatarUrl(currentUser.avatarUrl || '');
    }
    setError('');
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }

    setError('');
    onSubmit({
      name: name.trim(),
      avatarUrl: avatarUrl.trim(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-md" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header-group">
          <h3 className="modal-title">Edit Profile Information</h3>
          <p className="modal-subtitle">
            Update your personal profile details and avatar image URL.
          </p>
        </div>

        {error && (
          <div className="modal-error-box">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-container">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Address (Read Only) */}
          <div className="form-group">
            <label className="form-label">Email Address (Login ID)</label>
            <div className="input-container readonly-input">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                value={currentUser?.email || ''}
                readOnly
                disabled
              />
            </div>
            <p className="field-note">
              <Info size={13} /> Email address is used for authentication and cannot be modified here.
            </p>
          </div>

          {/* Profile Avatar Image URL */}
          <div className="form-group">
            <label className="form-label">Profile Image URL (Optional)</label>
            <div className="input-container">
              <Image size={18} className="input-icon" />
              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/photo-..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Avatar Preview */}
          {avatarUrl && (
            <div className="avatar-preview-box">
              <span className="preview-label">Image Preview:</span>
              <img
                src={avatarUrl}
                alt="Preview"
                className="avatar-preview-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
