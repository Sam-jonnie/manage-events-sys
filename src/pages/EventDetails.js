import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch event details');
      }

      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]); // id is the dependency

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]); // now includes fetchEventDetails

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setMessage('Successfully registered for the event!');
      setEvent(data.event);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-container">Loading event details...</div>;
  }

  if (error && !event) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="event-details-page">
      <div className="event-details-container">
        <button onClick={() => navigate('/events')} className="back-btn">
          ← Back to Events
        </button>

        <div className="event-header-section">
          <div className="event-title-row">
            <h1 className="event-title">{event.name}</h1>
            <span className={`event-badge ${event.category?.toLowerCase()}`}>
              {event.category}
            </span>
          </div>
          <p className="event-organizer-text">Organized by {event.organizer}</p>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="event-info-grid">
          <div className="info-card">
            <div className="info-icon">📅</div>
            <div className="info-content">
              <h3>Date & Time</h3>
              <p>{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📍</div>
            <div className="info-content">
              <h3>Location</h3>
              <p>{event.location}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">👥</div>
            <div className="info-content">
              <h3>Availability</h3>
              <p>{event.available_seats} of {event.capacity} seats available</p>
            </div>
          </div>
        </div>

        <div className="event-description-section">
          <h2>About This Event</h2>
          <p className="event-full-description">{event.description}</p>
        </div>

        <div className="event-action-section">
          {user ? (
            event.available_seats > 0 ? (
              <button 
                onClick={handleRegister} 
                className="register-btn"
                disabled={registering}
              >
                {registering ? 'Registering...' : 'Register for Event'}
              </button>
            ) : (
              <button className="sold-out-btn" disabled>
                Event Sold Out
              </button>
            )
          ) : (
            <button onClick={() => navigate('/login')} className="login-required-btn">
              Login to Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;