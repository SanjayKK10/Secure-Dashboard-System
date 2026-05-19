import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, getDefaultRoute } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <Link to={getDefaultRoute()} className="navbar-brand">
        <div className="navbar-logo">
          <Shield size={20} />
        </div>
        <span>Employee Portal</span>
      </Link>

      {user && (
        <div className="navbar-user">
          <div className="navbar-info">
            <div className="navbar-name">{user.name}</div>
            <div className="navbar-role">{user.role}</div>
          </div>
          <div className="navbar-avatar">
            {getInitials(user.name)}
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            <LogOut size={18} />
            <span className="hide-mobile">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
