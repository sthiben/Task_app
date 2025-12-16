import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import GymTrackerLogo from '../../assets/GymTrackerLogo.png';
import './Navbar.css';

/**
 * Navbar component - Navigation bar with user info and logout
 * Displays gym logo, navigation links, user information, and logout button
 * Includes responsive mobile menu for small screens
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Handle logout - calls authContext.logout() and redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Close mobile menu when a link is clicked
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Title */}
        <div className="navbar-brand">
          <Link to="/classes" className="navbar-logo">
            <img src={GymTrackerLogo} alt="GymTracker Logo" className="logo-image" />
            <span className="logo-text">GymTracker</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          <Link to="/classes" className="navbar-link">
            Clases
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="navbar-link">
              Admin
            </Link>
          )}
          <Link to="/profile" className="navbar-link">
            Perfil
          </Link>
        </div>

        {/* User Info and Logout */}
        <div className="navbar-user">
          {user && (
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-membership">{user.membershipType}</span>
            </div>
          )}
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="logout-btn"
          >
            Cerrar Sesión
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link 
            to="/classes" 
            className="mobile-menu-link"
            onClick={closeMobileMenu}
          >
            Clases
          </Link>
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="mobile-menu-link"
              onClick={closeMobileMenu}
            >
              Admin
            </Link>
          )}
          <Link 
            to="/profile" 
            className="mobile-menu-link"
            onClick={closeMobileMenu}
          >
            Perfil
          </Link>
          
          {user && (
            <div className="mobile-user-info">
              <div className="mobile-user-details">
                <span className="mobile-user-name">{user.username}</span>
                <span className="mobile-user-membership">{user.membershipType}</span>
              </div>
            </div>
          )}
          
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="mobile-logout-btn"
          >
            Cerrar Sesión
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
