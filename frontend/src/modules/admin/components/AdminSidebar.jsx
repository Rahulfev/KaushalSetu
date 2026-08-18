import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: '250px', minHeight: '100vh' }}>
      
      {/* Brand Header */}
      <h4 className="mb-4 fw-bold text-uppercase text-primary px-2 mt-2">
        Kaushal<span className="text-white">Admin</span>
      </h4>
      
      {/* Navigation Links */}
      <div className="nav flex-column gap-2">
        
        <NavLink to="/admin/dashboard" className={({isActive}) => `nav-link px-3 py-2 rounded ${isActive ? 'bg-primary text-white shadow-sm fw-bold' : 'text-white-50 hover-text-white'}`}>
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </NavLink>

        {/* <NavLink to="/admin/inventory" className={({isActive}) => `nav-link px-3 py-2 rounded ${isActive ? 'bg-primary text-white shadow-sm fw-bold' : 'text-white-50 hover-text-white'}`}>
          <i className="bi bi-box-seam me-2"></i> Inventory
        </NavLink> */}

        <NavLink to="/admin/users" className={({isActive}) => `nav-link px-3 py-2 rounded ${isActive ? 'bg-primary text-white shadow-sm fw-bold' : 'text-white-50 hover-text-white'}`}>
          <i className="bi bi-people me-2"></i> Users
        </NavLink>

        {/* ✅ NEW: Payments Link */}
        <NavLink to="/admin/finance" className={({isActive}) => `nav-link px-3 py-2 rounded ${isActive ? 'bg-primary text-white shadow-sm fw-bold' : 'text-white-50 hover-text-white'}`}>
          <i className="bi bi-cash-stack me-2"></i> Payments
        </NavLink>

        {/* ✅ NEW: Subscriptions Link */}
        <NavLink to="/admin/subscriptions" className={({isActive}) => `nav-link px-3 py-2 rounded ${isActive ? 'bg-primary text-white shadow-sm fw-bold' : 'text-white-50 hover-text-white'}`}>
          <i className="bi bi-award me-2"></i> Subscriptions
        </NavLink>

        <NavLink to="/admin/settings" className={({isActive}) => `nav-link px-3 py-2 rounded ${isActive ? 'bg-primary text-white shadow-sm fw-bold' : 'text-white-50 hover-text-white'}`}>
          <i className="bi bi-gear me-2"></i> Settings
        </NavLink>

      </div>
    </div>
  );
};

export default AdminSidebar;