import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

const AccessDenied = () => {
  const { user, getDefaultRoute } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="access-denied">
      <div className="access-denied-content">
        <div className="access-denied-icon">
          <ShieldX size={40} />
        </div>
        <h1>Access Denied</h1>
        <p>
          You don't have permission to access this page. This area is restricted to 
          authorized personnel only.
        </p>
        <div className="access-denied-actions">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link to={user ? getDefaultRoute() : '/login'} className="btn btn-primary">
            <Home size={18} />
            {user ? 'Go to Dashboard' : 'Sign In'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
