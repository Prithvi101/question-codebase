import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart } from 'lucide-react';

interface NavbarProps {
  favoritesCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ favoritesCount }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Home size={24} className="nav-logo-icon" style={{ stroke: 'url(#gradient-id)' }} />
        <span>EstateEase</span>
        <svg width="0" height="0">
          <linearGradient id="gradient-id" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </svg>
      </Link>
      
      <div className="nav-links">
        <div className="nav-fav-badge" data-testid="favorites-badge">
          <Heart size={16} fill="currentColor" />
          <span>{favoritesCount} Favorites</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
