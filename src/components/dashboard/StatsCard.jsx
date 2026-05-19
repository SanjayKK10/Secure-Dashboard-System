import React from 'react';

const StatsCard = ({ icon: Icon, value, label, variant = 'primary' }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className={`stat-icon ${variant}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatsCard;
