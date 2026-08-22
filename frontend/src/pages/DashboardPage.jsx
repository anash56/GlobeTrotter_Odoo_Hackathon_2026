import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Globe, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { tripService } from '../services/tripService';

export function DashboardPage() {
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserTrips = async () => {
      setLoadingTrips(true);
      try {
        const userTrips = await tripService.getTrips();
        setTrips(userTrips);
      } catch (err) {
        console.error('Error loading user trips:', err);
      } finally {
        setLoadingTrips(false);
      }
    };

    loadUserTrips();
  }, []);

  return (
    <main className="dashboard-container">
      {/* Banner CTA */}
      <div className="dashboard-hero">
        <div className="hero-text">
          <div className="badge-tag">
            <Sparkles size={14} /> AI Travel Planner
          </div>
          <h1>Where would you like to explore next?</h1>
          <p>Select from global destination cities, pick travel dates, and create your personalized trip itinerary.</p>
        </div>
        <Link to="/trips/create" className="btn-primary-hero" style={{ textDecoration: 'none' }}>
          <Plus size={20} /> Create New Trip
        </Link>
      </div>

      {/* Trips Section */}
      <section className="trips-section">
        <div className="section-header-row">
          <h2>Your Saved Trips</h2>
          <span className="count-pill">{trips.length} Trips</span>
        </div>

        {loadingTrips ? (
          <div className="loading-grid-state">
            <div className="spinner-navy" />
            <p>Loading your trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="empty-trips-card">
            <Globe size={48} className="empty-icon" />
            <h3>No Trips Created Yet</h3>
            <p>Start planning your next dream vacation by creating a trip now.</p>
            <Link
              to="/trips/create"
              className="btn-primary"
              style={{ width: 'auto', marginTop: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={18} /> Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="user-trips-grid">
            {trips.map((trip) => {
              const stop = trip.stops?.[0];
              const city = stop?.city;
              return (
                <div
                  key={trip.id}
                  className="user-trip-card"
                  onClick={() => navigate(`/trips/${trip.id}`)}
                >
                  <div className="trip-cover-wrapper">
                    <img
                      src={trip.coverPhotoUrl || city?.imageUrl || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'}
                      alt={trip.title}
                      className="trip-cover-img"
                    />
                    <span className="trip-badge-location">
                      <MapPin size={12} /> {city?.name || 'Destination'}
                    </span>
                  </div>
                  <div className="trip-card-content">
                    <h3>{trip.title}</h3>
                    <p className="trip-dates">
                      <Calendar size={14} /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                    <div className="trip-footer">
                      <span className="trip-budget">${trip.totalBudget?.toFixed(0)} Budget</span>
                      <span className="btn-view-trip">
                        View Trip <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
