import React, { useEffect } from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

export function LogoutConfirmationModal({ isOpen, onClose, onConfirm }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="logout-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
      <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="btn-modal-close-icon"
          onClick={onClose}
          aria-label="Cancel and close"
        >
          <X size={18} />
        </button>

        {/* Warning Icon Badge */}
        <div className="logout-icon-bubble">
          <LogOut size={28} />
        </div>

        {/* Content */}
        <h3 id="logout-modal-title" className="logout-modal-title">
          Log Out of GlobeTrotter?
        </h3>
        <p className="logout-modal-text">
          Are you sure you want to log out? You'll need to sign back in to manage your trips and view your itineraries.
        </p>

        {/* Actions */}
        <div className="logout-modal-actions">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modal-logout-confirm"
            onClick={onConfirm}
            autoFocus
          >
            <LogOut size={16} />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
