import React from 'react';
import { User, Edit3, Mail, Calendar, Compass, Shield, Sparkles } from 'lucide-react';

export function ProfileHero({ user, onEditClick }) {
  if (!user) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="profile-hero-card">
      <div className="profile-hero-bg-overlay" />
      
      <div className="profile-hero-content">
        <div className="profile-avatar-wrapper">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-placeholder">
              {getInitials(user.name)}
            </div>
          )}
          <span className="online-status-badge" title="Active Explorer" />
        </div>

        <div className="profile-user-details">
          <div className="profile-title-row">
            <h1 className="profile-user-name">{user.name}</h1>
            <span className="profile-role-badge">
              <Shield size={12} /> {user.role === 'ADMIN' ? 'Admin Explorer' : 'GlobeTrotter Explorer'}
            </span>
          </div>

          <p className="profile-user-bio">
            <Sparkles size={14} className="bio-icon" /> Passionate traveler exploring culture, cuisine, and world destinations.
          </p>

          <div className="profile-meta-row">
            <span className="profile-meta-item">
              <Mail size={15} /> {user.email}
            </span>
            <span className="profile-meta-item">
              <Calendar size={15} /> Member since {formatDate(user.createdAt)}
            </span>
          </div>
        </div>

        <div className="profile-hero-actions">
          <button type="button" className="btn-edit-profile" onClick={onEditClick}>
            <Edit3 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
