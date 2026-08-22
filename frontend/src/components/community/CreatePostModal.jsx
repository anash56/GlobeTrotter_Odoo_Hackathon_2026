import React, { useState } from 'react';
import { X, Send, MapPin, Tag, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { communityService } from '../../services/communityService';

const PRESET_IMAGES = [
  { label: 'Tokyo Temple', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
  { label: 'Paris Eiffel', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bali Jungle', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dubai Desert', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
];

export function CreatePostModal({ isOpen, onClose, onPostCreated, onShowToast }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Trip Story');
  const [destination, setDestination] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 4) {
      newErrors.title = 'Title must be at least 4 characters long';
    }

    if (!content.trim()) {
      newErrors.content = 'Post content is required';
    } else if (content.trim().length < 10) {
      newErrors.content = 'Please write a bit more detail (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await communityService.createPost({
        title,
        category,
        destination,
        imageUrl,
        content,
      });

      if (onShowToast) {
        onShowToast('Travel post shared successfully!', 'success');
      }

      onPostCreated(result.post);
      handleReset();
      onClose();
    } catch (err) {
      console.error('Create post failed:', err);
      setErrors({ form: err.message || 'Failed to publish post. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setCategory('Trip Story');
    setDestination('');
    setImageUrl('');
    setContent('');
    setErrors({});
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Sparkles size={20} color="#6587D2" />
            <h2>Share Your Travel Experience</h2>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {errors.form && <div className="modal-error-banner">{errors.form}</div>}

          {/* Post Title */}
          <div className="form-group">
            <label className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g. Unforgettable Sunset at Tokyo's Sensō-ji Temple"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.title && <span className="field-error-text">{errors.title}</span>}
          </div>

          {/* Row: Category & Destination */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">
                <Tag size={13} /> Experience Type
              </label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="Trip Story">Trip Story</option>
                <option value="Travel Tip">Travel Tip</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Destination Review">Destination Review</option>
                <option value="Recommendation">Recommendation</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <MapPin size={13} /> Destination (Optional)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Paris, France"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="form-group">
            <label className="form-label">
              <ImageIcon size={13} /> Image URL (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isSubmitting}
            />

            {/* Quick Image Presets */}
            <div className="preset-images-row">
              <span className="preset-label">Quick Presets:</span>
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="preset-chip-btn"
                  onClick={() => setImageUrl(preset.url)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview if URL set */}
          {imageUrl && (
            <div className="form-image-preview">
              <img src={imageUrl} alt="Preview" onError={() => setErrors((prev) => ({ ...prev, image: 'Invalid image URL' }))} />
              <button
                type="button"
                className="btn-remove-image"
                onClick={() => setImageUrl('')}
              >
                <X size={14} /> Remove Image
              </button>
            </div>
          )}

          {/* Post Content Body */}
          <div className="form-group">
            <label className="form-label">
              Content & Details <span className="required">*</span>
            </label>
            <textarea
              className={`form-textarea ${errors.content ? 'input-error' : ''}`}
              rows={5}
              placeholder="Tell fellow travelers what made this experience special, your recommendations, itinerary advice, or things to avoid..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />
            {errors.content && <span className="field-error-text">{errors.content}</span>}
          </div>

          {/* Footer Actions */}
          <div className="modal-actions-row">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-modal-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinner" /> Publishing...
                </>
              ) : (
                <>
                  <Send size={16} /> Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
