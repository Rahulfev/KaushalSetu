import { Navigate } from 'react-router-dom';

// This page was replaced by the full multi-step KYC flow at /worker/kyc
// (see modules/dashboard/worker/pages/KycSubmissionPage.jsx). Kept as a redirect
// so any old bookmarks/links to /kyc-pending still land somewhere useful.
const KycPendingPage = () => <Navigate to="/worker/kyc" replace />;

export default KycPendingPage;
