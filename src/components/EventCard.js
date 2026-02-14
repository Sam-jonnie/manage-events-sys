import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EventCard.css';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

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

  return (
    <div className="event-card" onClick={() => navigate(`/event/${event.id}`)}>
      <div className="event-card-header">
        <h3 className="event-name">{event.name}</h3>
        <span className={`event-category ${event.category?.toLowerCase()}`}>
          {event.category}
        </span>
      </div>
      
      <div className="event-details">
        <p className="event-organizer">
          <strong>Organizer:</strong> {event.organizer}
        </p>
        <p className="event-location">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="event-date">
          <strong>Date:</strong> {formatDate(event.date)}
        </p>
      </div>

      <p className="event-description">
        {event.description?.substring(0, 100)}
        {event.description?.length > 100 ? '...' : ''}
      </p>

      <div className="event-footer">
        <span className={`seats-available ${event.available_seats === 0 ? 'sold-out' : ''}`}>
          {event.available_seats === 0 
            ? 'Sold Out' 
            : `${event.available_seats} / ${event.capacity} seats available`
          }
        </span>
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );
};

export default EventCard;