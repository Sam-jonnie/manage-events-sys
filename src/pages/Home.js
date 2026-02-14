import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Bellcorp Events</h1>
        <p className="hero-subtitle">
          Discover and register for amazing events happening near you
        </p>
        <div className="hero-buttons">
          <Link to="/events" className="btn btn-primary">Browse Events</Link>
          <Link to="/register" className="btn btn-secondary">Get Started</Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Bellcorp Events?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Easy Discovery</h3>
            <p>Search and filter through hundreds of events to find exactly what you're looking for</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Quick Registration</h3>
            <p>Register for events with just a few clicks and manage all your bookings in one place</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Stay Updated</h3>
            <p>Get real-time updates about your registered events and never miss out</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;