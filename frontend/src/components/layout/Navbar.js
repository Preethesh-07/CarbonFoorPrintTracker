import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/log-activity" className="nav-link">Log Activity</Link>
      </li>
      <li className="nav-item">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      </li>
      <li className="nav-item">
        <Link to="/tips" className="nav-link">Tips</Link>
      </li>
      <li className="nav-item">
        <a onClick={handleLogout} href="#!" className="nav-link">
          <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/" className="nav-link">Login</Link>
      </li>
      <li className="nav-item">
        <Link to="/register" className="nav-link">Register</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-leaf"></i> Carbon Footprint Tracker
        </Link>
        <div className="navbar-collapse">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;