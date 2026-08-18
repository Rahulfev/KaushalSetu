import React from 'react';

const StatCard = ({ title, value, color, icon }) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className={`card-body border-start border-4 border-${color}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-uppercase text-muted small fw-bold mb-1">{title}</h6>
            <h3 className="mb-0 fw-bold text-dark">{value}</h3>
          </div>
          <div className={`text-${color} opacity-50 fs-1`}>
            {/* You can replace this with an <i> tag if you use FontAwesome */}
            <span>{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;