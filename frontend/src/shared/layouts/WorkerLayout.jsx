import React from 'react';
import AppNavbar from '../components/AppNavbar';
import AppFooter from '../components/AppFooter';
import { Outlet } from 'react-router-dom';

const WorkerLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ✅ Unified Navbar for Workers */}
      <AppNavbar />

      <main className="flex-fill bg-light">
        {/* ✅ Renders sub-routes like dashboard, store, and my-orders */}
        <Outlet />
      </main>

      {/* ✅ Unified Footer */}
      <AppFooter />
    </div>
  );
};

export default WorkerLayout;