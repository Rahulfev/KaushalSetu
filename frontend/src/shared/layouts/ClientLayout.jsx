import React from 'react';
import AppNavbar from '../components/AppNavbar';
import AppFooter from '../components/AppFooter';
import { Outlet } from 'react-router-dom';

const ClientLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-fill bg-light">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
};

export default ClientLayout;