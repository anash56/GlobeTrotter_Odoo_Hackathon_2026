import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileHero } from '../components/profile/ProfileHero';
import { ProfileStats } from '../components/profile/ProfileStats';
import { ProfileTripCard } from '../components/profile/ProfileTripCard';
import { EmptyTripsSection } from '../components/profile/EmptyTripsSection';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { ToastContainer } from '../components/Toast';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Compass, Plus, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, updateAuthUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Toast feedback
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Load User Profile & Trips
  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getProfile();
      setProfileData(data);
      if (data.user && updateAuthUser) {
        updateAuthUser(data.user);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (updatedFields) => {
    setIsUpdating(true);
    try {
      const response = await userService.updateProfile(updatedFields);
      addToast('Profile updated successfully!', 'success');
      setIsEditModalOpen(false);
      
      // Update local state and context
      if (response.user) {
        setProfileData((prev) => ({
          ...prev,
          user: response.user,
        }));
        if (updateAuthUser) {
          updateAuthUser(response.user);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page-loading">
        <div className="spinner-navy" />
        <p>Loading your profile and travel history...</p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="profile-page-error">
        <AlertCircle size={36} color="#EF4444" />
        <h2>Profile Unavailable</h2>
        <p>{error || 'Failed to retrieve your profile information.'}</p>
        <button className="btn-primary" onClick={loadProfile}>
          <RefreshCw size={16} /> Retry Loading
        </button>
      </div>
    );
  }

  const { user, stats, upcomingTrips = [], previousTrips = [] } = profileData;

  return (
    <div className="profile-page-container">
      <main className="profile-page-main">
        {/* 1. Profile Hero Section */}
        <ProfileHero
          user={user || currentUser}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        {/* 2. Profile Statistics Cards */}
        <ProfileStats stats={stats} />

        {/* 3. Upcoming / Preplanned Trips Section */}
        <section className="profile-trips-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-title">Preplanned & Upcoming Trips</h2>
              <p className="section-subtitle">Your active travel itineraries and upcoming adventures.</p>
            </div>
            <button
              type="button"
              className="btn-header-cta"
              onClick={() => navigate('/trips/create')}
            >
              <Plus size={16} /> Plan a Trip
            </button>
          </div>

          {upcomingTrips.length > 0 ? (
            <div className="trips-cards-grid">
              {upcomingTrips.map((trip) => (
                <ProfileTripCard key={trip.id} trip={trip} isUpcoming={true} />
              ))}
            </div>
          ) : (
            <EmptyTripsSection type="upcoming" />
          )}
        </section>

        {/* 4. Previous / Completed Trips Section */}
        <section className="profile-trips-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-title">Previous Trips & Travel History</h2>
              <p className="section-subtitle">Memories and itineraries from your past journeys.</p>
            </div>
          </div>

          {previousTrips.length > 0 ? (
            <div className="trips-cards-grid">
              {previousTrips.map((trip) => (
                <ProfileTripCard key={trip.id} trip={trip} isUpcoming={false} />
              ))}
            </div>
          ) : (
            <EmptyTripsSection type="previous" />
          )}
        </section>

        {/* 5. Final CTA Banner */}
        <section className="profile-cta-banner">
          <div className="cta-banner-content">
            <Sparkles size={24} className="cta-sparkle-icon" />
            <div>
              <h3>Ready for your next journey?</h3>
              <p>Explore top regional destinations, calculate costs, and build custom daily itineraries.</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-banner-action"
            onClick={() => navigate('/trips/create')}
          >
            <Compass size={18} /> Create New Trip
          </button>
        </section>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
        currentUser={user || currentUser}
        isLoading={isUpdating}
      />

      {/* Toast Notification Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
