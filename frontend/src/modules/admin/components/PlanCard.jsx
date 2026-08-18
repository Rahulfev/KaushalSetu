import React, { useState } from 'react';

const PlanCard = ({ plan, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState({ ...plan });
  const [newFeature, setNewFeature] = useState("");

  const handleSave = () => {
    onUpdate(plan.id, {
      price: Number(editedPlan.price),
      interval: editedPlan.interval,
      features: editedPlan.features
    });
    setIsEditing(false);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setEditedPlan({ ...editedPlan, features: [...editedPlan.features, newFeature] });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    const updated = editedPlan.features.filter((_, i) => i !== index);
    setEditedPlan({ ...editedPlan, features: updated });
  };

  return (
    <div className={`card shadow-sm h-100 border-0 ${!plan.isActive ? 'bg-light opacity-75' : ''}`}>
      <div className="card-body">
        {/* Header & Toggle */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="fw-bold text-dark mb-0">{plan.name}</h5>
          <div className="form-check form-switch">
            <input 
              className="form-check-input" type="checkbox" style={{ cursor: 'pointer' }}
              checked={plan.isActive}
              onChange={() => onUpdate(plan.id, { isActive: !plan.isActive })}
            />
          </div>
        </div>

        {/* Editing Mode vs View Mode */}
        {isEditing ? (
          <div className="mb-3">
            {/* Price Edit */}
            <label className="small fw-bold text-muted">Price & Interval</label>
            <div className="input-group input-group-sm mb-2">
              <span className="input-group-text">₹</span>
              <input 
                type="number" className="form-control" 
                value={editedPlan.price} 
                onChange={(e) => setEditedPlan({...editedPlan, price: e.target.value})} 
              />
              <select 
                className="form-select" 
                value={editedPlan.interval}
                onChange={(e) => setEditedPlan({...editedPlan, interval: e.target.value})} 
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            {/* Features Edit */}
            <label className="small fw-bold text-muted mt-2">Features</label>
            <ul className="list-unstyled mb-2">
              {editedPlan.features.map((feat, idx) => (
                <li key={idx} className="d-flex justify-content-between align-items-center small mb-1 border-bottom pb-1">
                  <span>{feat}</span>
                  <button onClick={() => removeFeature(idx)} className="btn btn-link text-danger p-0" style={{textDecoration: 'none'}}>×</button>
                </li>
              ))}
            </ul>
            <div className="input-group input-group-sm mb-3">
              <input 
                type="text" className="form-control" placeholder="Add feature..."
                value={newFeature} onChange={e => setNewFeature(e.target.value)}
              />
              <button className="btn btn-outline-secondary" onClick={addFeature}>+</button>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2">
              <button onClick={handleSave} className="btn btn-sm btn-success w-50">Save</button>
              <button onClick={() => { setIsEditing(false); setEditedPlan({...plan}); }} className="btn btn-sm btn-outline-secondary w-50">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {/* View Mode */}
            <div className="mb-3">
              <h3 className="text-primary d-inline me-2">₹{plan.price}</h3>
              <span className="text-muted small">/ {plan.interval}</span>
            </div>
            <ul className="list-unstyled mb-4 small text-secondary">
              {plan.features.map((feat, idx) => (
                <li key={idx} className="mb-1"><span className="me-2 text-success">●</span>{feat}</li>
              ))}
            </ul>
            <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-outline-primary w-100">
              Edit Plan Details
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlanCard;