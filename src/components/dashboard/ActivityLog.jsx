import React, { useState, useEffect } from 'react';
import { getActivityLogs, ActivityTypes } from '../../services/activityLogger';
import { getAllUsers } from '../../services/authService';
import { LogIn, LogOut, UserPlus, AlertTriangle, Edit, Trash2 } from 'lucide-react';

const ActivityLog = ({ userId = null, limit = 10 }) => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const allUsers = getAllUsers();
    const userMap = {};
    allUsers.forEach(u => { userMap[u.id] = u; });
    setUsers(userMap);
    setLogs(getActivityLogs(userId, limit));
  }, [userId, limit]);

  const getIcon = (type) => {
    switch (type) {
      case ActivityTypes.LOGIN:
        return <LogIn size={16} />;
      case ActivityTypes.LOGOUT:
        return <LogOut size={16} />;
      case ActivityTypes.SIGNUP:
      case ActivityTypes.USER_CREATED:
        return <UserPlus size={16} />;
      case ActivityTypes.USER_UPDATED:
      case ActivityTypes.PROFILE_UPDATE:
        return <Edit size={16} />;
      case ActivityTypes.USER_DELETED:
        return <Trash2 size={16} />;
      case ActivityTypes.ACCESS_DENIED:
        return <AlertTriangle size={16} />;
      default:
        return <Edit size={16} />;
    }
  };

  const getIconClass = (type) => {
    switch (type) {
      case ActivityTypes.LOGIN:
      case ActivityTypes.SIGNUP:
        return 'login';
      case ActivityTypes.LOGOUT:
        return 'logout';
      case ActivityTypes.ACCESS_DENIED:
        return 'warning';
      default:
        return 'action';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityText = (log) => {
    const user = users[log.userId];
    const userName = user?.name || 'Unknown user';
    
    switch (log.type) {
      case ActivityTypes.LOGIN:
        return `${userName} logged in`;
      case ActivityTypes.LOGOUT:
        return `${userName} logged out`;
      case ActivityTypes.SIGNUP:
        return `${userName} created an account`;
      case ActivityTypes.ACCESS_DENIED:
        return `Access denied for ${userName}: ${log.details?.reason || 'Unauthorized'}`;
      case ActivityTypes.USER_UPDATED:
        return `${userName} updated a user profile`;
      case ActivityTypes.USER_DELETED:
        return `${userName} deleted a user account`;
      default:
        return `${userName} performed an action`;
    }
  };

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        No recent activity
      </div>
    );
  }

  return (
    <ul className="activity-list">
      {logs.map(log => (
        <li key={log.id} className="activity-item">
          <div className={`activity-icon ${getIconClass(log.type)}`}>
            {getIcon(log.type)}
          </div>
          <div className="activity-content">
            <div className="activity-text">{getActivityText(log)}</div>
            <div className="activity-time">{formatTime(log.timestamp)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActivityLog;
