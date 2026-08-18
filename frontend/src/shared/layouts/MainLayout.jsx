import AppNavbar from '../components/AppNavbar';
import AppFooter from '../components/AppFooter';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-fill">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
};

export default MainLayout;
