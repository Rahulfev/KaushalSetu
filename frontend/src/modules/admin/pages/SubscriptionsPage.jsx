import React, { useState } from 'react';
// import AdminLayout from '../layouts/AdminLayout';
import useSubscriptions from '../hooks/useSubscriptions';

const SubscriptionsPage = () => {
  const { plans, loading, updatePlanDetails, createPlan } = useSubscriptions();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ planId: '', name: '', price: '', duration: 'Monthly' });

  const handleOpenCreate = () => {
    setFormData({ planId: '', name: '', price: '', duration: 'Monthly' });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleOpenEdit = (plan) => {
    setFormData({
      planId: plan.planId, 
      name: plan.name,
      price: plan.price,
      duration: plan.duration || 'Monthly'
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (isEdit) {
      updatePlanDetails(formData.planId, formData);
    } else {
      createPlan(formData);
    }
    setShowModal(false);
  };

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  return (
    
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">Subscription & Plans</h2>
          <button className="btn btn-primary px-4 fw-bold" onClick={handleOpenCreate}>
            Create New Plan
          </button>
        </div>

        <div className="row g-4">
          {plans.map((plan) => (
            // ✅ FIX: Unique key must be on the outermost div using the database ID
            <div className="col-md-4" key={plan.planId}> 
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body p-4">
                  <span className="badge bg-primary bg-opacity-10 text-primary mb-2">
                    {plan.duration}
                  </span>
                  <h4 className="fw-bold">{plan.name}</h4>
                  <h2 className="fw-bold text-dark">₹{plan.price}</h2>
                  <button 
                    className="btn btn-dark w-100 mt-3 fw-bold" 
                    onClick={() => handleOpenEdit(plan)}
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- DYNAMIC MODAL --- */}
        {showModal && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg p-3">
                <div className="modal-header border-0">
                  <h5 className="fw-bold">{isEdit ? 'Update Plan' : 'Create New Plan'}</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Plan Name</label>
                    <input 
                      type="text" className="form-control" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Price (₹)</label>
                    <input 
                      type="number" className="form-control" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Billing Period</label>
                    <select 
                      className="form-select" 
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Lifetime">Lifetime</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-light px-4 fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary px-4 fw-bold" onClick={handleSubmit}>
                    {isEdit ? 'Save Changes' : 'Create Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default SubscriptionsPage;