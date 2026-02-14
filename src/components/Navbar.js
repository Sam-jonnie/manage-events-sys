import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Bellcorp Events
        </Link>
        
        <div className="navbar-links">
          <Link to="/events" className="navbar-link">Events</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              <span className="navbar-user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="navbar-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn login-btn">Login</Link>
              <Link to="/register" className="navbar-btn register-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;