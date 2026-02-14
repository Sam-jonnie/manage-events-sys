import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState({
    all: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/user/registrations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch registrations');
      }

      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) {
      return;
    }

    setCancellingId(eventId);

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel registration');
      }

      // Refresh registrations
      fetchRegistrations();
      alert('Registration cancelled successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEventCard = (event, isPast = false) => (
    <div key={event.id} className={`dashboard-event-card ${isPast ? 'past-event' : ''}`}>
      <div className="dashboard-event-header">
        <h3>{event.name}</h3>
        <span className={`event-category-badge ${event.category?.toLowerCase()}`}>
          {event.category}
        </span>
      </div>

      <div className="dashboard-event-info">
        <p><strong>📅 Date:</strong> {formatDate(event.date)}</p>
        <p><strong>📍 Location:</strong> {event.location}</p>
        <p><strong>👤 Organizer:</strong> {event.organizer}</p>
        <p><strong>🎟️ Registered:</strong> {formatDate(event.registered_at)}</p>
      </div>

      <div className="dashboard-event-actions">
        <button 
          onClick={() => navigate(`/event/${event.id}`)}
          className="view-event-btn"
        >
          View Details
        </button>
        {!isPast && (
          <button
            onClick={() => handleCancelRegistration(event.id)}
            className="cancel-registration-btn"
            disabled={cancellingId === event.id}
          >
            {cancellingId === event.id ? 'Cancelling...' : 'Cancel Registration'}
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading-container">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Manage your event registrations</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{registrations.all.length}</div>
          <div className="stat-label">Total Registrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{registrations.upcoming.length}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{registrations.past.length}</div>
          <div className="stat-label">Past Events</div>
        </div>
      </div>

      {registrations.all.length === 0 ? (
        <div className="no-registrations">
          <h2>No Event Registrations Yet</h2>
          <p>Start exploring and register for exciting events!</p>
          <button onClick={() => navigate('/events')} className="browse-events-btn">
            Browse Events
          </button>
        </div>
      ) : (
        <>
          {registrations.upcoming.length > 0 && (
            <div className="dashboard-section">
              <h2>Upcoming Events</h2>
              <div className="dashboard-events-grid">
                {registrations.upcoming.map(event => renderEventCard(event))}
              </div>
            </div>
          )}

          {registrations.past.length > 0 && (
            <div className="dashboard-section">
              <h2>Past Events</h2>
              <div className="dashboard-events-grid">
                {registrations.past.map(event => renderEventCard(event, true))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;