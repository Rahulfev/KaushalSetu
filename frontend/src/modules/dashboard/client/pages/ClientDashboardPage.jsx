import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getClientDashboard } from "../services/clientDashboardApi";

const ClientDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await getClientDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentJobs = dashboardData?.recentJobs || [];

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        {/* 👋 Header & Action Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
          <div>
            <h2 className="fw-bold text-dark mb-1">Client Command Center</h2>
            <p className="text-muted mb-0">Manage your workforce requirements and active project milestones.</p>
          </div>
          <Button as={Link} to="/client/post-job" variant="warning" className="rounded-pill px-4 fw-bold mt-3 mt-md-0 shadow-sm">
            <i className="bi bi-plus-lg me-2"></i>Post New Requirement
          </Button>
        </div>

        {/* 📊 High-Level Metrics */}
        <Row className="g-4 mb-5">
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100 text-white" style={{ background: '#0f172a' }}>
              <Card.Body className="p-4">
                <div className="bg-warning text-dark d-inline-block p-2 rounded-3 mb-3">
                  <i className="bi bi-briefcase-fill fs-5"></i>
                </div>
                <h6 className="opacity-75 small fw-bold text-uppercase">Active Jobs</h6>
                <h2 className="fw-bold mb-0">{stats.activeJobs || 0}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
              <Card.Body className="p-4">
                <div className="bg-success bg-opacity-10 text-success d-inline-block p-2 rounded-3 mb-3">
                  <i className="bi bi-check-circle-fill fs-5"></i>
                </div>
                <h6 className="text-muted small fw-bold text-uppercase">Completed</h6>
                <h2 className="fw-bold mb-0 text-dark">{stats.completedJobs || 0}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100 bg-white border-start border-5 border-warning">
              <Card.Body className="p-4">
                <div className="bg-primary bg-opacity-10 text-primary d-inline-block p-2 rounded-3 mb-3">
                  <i className="bi bi-wallet2 fs-5"></i>
                </div>
                <h6 className="text-muted small fw-bold text-uppercase">Total Spent</h6>
                <h2 className="fw-bold mb-0 text-dark">₹{(stats.totalSpent || 0).toLocaleString('en-IN')}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm rounded-4 h-100 bg-white">
              <Card.Body className="p-4">
                <div className="bg-info bg-opacity-10 text-info d-inline-block p-2 rounded-3 mb-3">
                  <i className="bi bi-people-fill fs-5"></i>
                </div>
                <h6 className="text-muted small fw-bold text-uppercase">Applications</h6>
                <h2 className="fw-bold mb-0 text-dark">{stats.pendingApplications || 0}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 📋 Recent Job Stream */}
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 text-dark text-uppercase small">Recent Postings</h6>
            <Link to="/client/my-jobs" className="small fw-bold text-primary text-decoration-none">View All Services</Link>
          </Card.Header>
          <div className="table-responsive">
            <Table hover align="middle" className="mb-0">
              <thead className="bg-light small fw-bold text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>
                <tr>
                  <th className="ps-4 py-3">Project Details</th>
                  <th>Candidates</th>
                  <th>Current Status</th>
                  <th className="text-end pe-4">Management</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.length > 0 ? recentJobs.map(job => (
                  <tr key={job.jobId}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{job.title}</div>
                      <div className="text-muted extra-small">ID: PJ-{job.jobId}</div>
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-bold">
                        <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                        {job.applicationCount} Applied
                      </Badge>
                    </td>
                    <td>
                      <Badge pill className={`px-3 py-2 ${
                        job.status === 'COMPLETED' ? 'bg-success-subtle text-success border border-success' :
                        job.status === 'IN_PROGRESS' ? 'bg-primary-subtle text-primary border border-primary' :
                        'bg-warning-subtle text-warning border border-warning'
                      }`}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="text-end pe-4">
                      <Button as={Link} to={`/client/applications/${job.jobId}`} variant="outline-dark" size="sm" className="fw-bold rounded-pill px-3">
                        Review
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 opacity-25 d-block mb-3"></i>
                      No active job postings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>
      <style>{`
        .extra-small { font-size: 0.7rem; }
        .table-hover tbody tr:hover { background-color: #f8fafc; transition: 0.2s; }
      `}</style>
    </div>
  );
};

export default ClientDashboardPage;