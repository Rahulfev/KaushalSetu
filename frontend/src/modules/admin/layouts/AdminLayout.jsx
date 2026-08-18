// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { clearAuth } from '@/shared/utils/authUtils';
// import { clearToken } from '@/shared/utils/tokenUtils';


// const AdminLayout = ({ children }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isActive = (path) => location.pathname.startsWith(path) ? 'active fw-bold' : '';
//   const handleLogout = () => {
//     clearToken();
//     clearAuth();
//     navigate('/login', { replace: true });
//   };

//   return (
//     <div className="d-flex flex-column min-vh-100 bg-light" style={{ width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>

//       {/* --- ADMIN NAVBAR --- */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm w-100">
//         <div className="container-fluid">
//           <Link className="navbar-brand fw-bold text-uppercase d-flex align-items-center" to="/admin/dashboard">
//             <i className="bi bi-grid-fill me-2 text-primary"></i>
//             Kaushal <span className="text-primary ms-1">Admin</span>
//           </Link>
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="adminNavbar">
//             <ul className="navbar-nav ms-4 me-auto mb-2 mb-lg-0">
//               <li className="nav-item"><Link className={`nav-link ${isActive('/admin/dashboard')}`} to="/admin/dashboard">Dashboard</Link></li>
//               <li className="nav-item"><Link className={`nav-link ${isActive('/admin/inventory')}`} to="/admin/inventory">Inventory</Link></li>
//               <li className="nav-item"><Link className={`nav-link ${isActive('/admin/users')}`} to="/admin/users">Users</Link></li>
//               <li className="nav-item"><Link className={`nav-link ${isActive('/admin/payments')}`} to="/admin/payments">Payments</Link></li>
//               <li className="nav-item"><Link className={`nav-link ${isActive('/admin/subscriptions')}`} to="/admin/subscriptions">Subscriptions</Link></li>
//               <li className="nav-item"><Link className={`nav-link ${isActive('/admin/settings')}`} to="/admin/settings">Settings</Link></li>
//             </ul>
//             <div className="d-flex align-items-center">
//               <div className="text-end d-none d-lg-block text-white me-3">
//                 <div className="small fw-bold">Admin User</div>
//               </div>
              
//               <button
//                 onClick={handleLogout}
//                 className="btn btn-outline-danger btn-sm"
//                 type="button"
//               >
//                 Logout
//               </button>
              
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* --- PAGE CONTENT --- */}
//       <main className="flex-grow-1 w-100">
//         <div className="container-fluid px-4 py-4">
//           {children}
//         </div>
//       </main>

//       {/* --- ✅ NEW PUBLIC FOOTER --- */}
//       <footer className="bg-white border-top pt-5 pb-4 w-100">
//         <div className="container-fluid px-5">
//           <div className="row text-md-start text-center">
//             {/* Brand Section */}
//             <div className="col-md-4 mb-4">
//               <h5 className="fw-bold text-primary mb-3">KAUSHAL <span className="text-dark">SETU</span></h5>
//               <p className="text-muted small pr-md-5">
//                 Empowering the workforce through digital connectivity. Our admin portal ensures seamless management of jobs, workers, and organizational growth.
//               </p>
//               <div className="d-flex gap-3 justify-content-md-start justify-content-center">
//                 <i className="bi bi-facebook text-muted"></i>
//                 <i className="bi bi-twitter-x text-muted"></i>
//                 <i className="bi bi-linkedin text-muted"></i>
//                 <i className="bi bi-instagram text-muted"></i>
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div className="col-md-2 mb-4">
//               <h6 className="fw-bold mb-3">Management</h6>
//               <ul className="list-unstyled small">
//                 <li className="mb-2"><Link to="/admin/users" className="text-decoration-none text-muted">User Base</Link></li>
//                 <li className="mb-2"><Link to="/admin/inventory" className="text-decoration-none text-muted">Inventory</Link></li>
//                 <li className="mb-2"><Link to="/admin/payments" className="text-decoration-none text-muted">Financials</Link></li>
//               </ul>
//             </div>

//             {/* Support Section */}
//             <div className="col-md-2 mb-4">
//               <h6 className="fw-bold mb-3">Support</h6>
//               <ul className="list-unstyled small">
//                 <li className="mb-2"><Link to="/admin/settings" className="text-decoration-none text-muted">System Settings</Link></li>
//                 <li className="mb-2"><span className="text-muted">Documentation</span></li>
//                 <li className="mb-2"><span className="text-muted">Security Audit</span></li>
//               </ul>
//             </div>

//             {/* Contact Section */}
//             <div className="col-md-4 mb-4">
//               <h6 className="fw-bold mb-3">System Contact</h6>
//               <p className="text-muted small mb-1"><i className="bi bi-envelope me-2"></i> admin-support@kaushalsetu.com</p>
//               <p className="text-muted small mb-1"><i className="bi bi-telephone me-2"></i> +91 98765 43210</p>
//               <p className="text-muted small"><i className="bi bi-geo-alt me-2"></i> C-DAC Mumbai, India</p>
//             </div>
//           </div>

//           <hr className="my-4 text-muted opacity-25" />

//           <div className="row">
//             <div className="col-md-6 text-center text-md-start">
//               <span className="text-muted small">© 2026 KaushalSetu Admin Panel. All rights reserved.</span>
//             </div>
//             <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
//               <span className="text-muted small me-3">Privacy Policy</span>
//               <span className="text-muted small">Terms of Service</span>
//             </div>
//           </div>
//         </div>
//       </footer>

//     </div>
//   );
// };

// export default AdminLayout;