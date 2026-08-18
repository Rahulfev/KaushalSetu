import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Spinner, Alert, Card, Row, Col } from "react-bootstrap";
import { workerApi } from "../services/workerDashboardApi";
import { Briefcase, MapPin, Calendar, IndianRupee, Info } from "lucide-react"; // Modern Icons

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await workerApi.getMyApplications();
        setApplications(res.data || []);
      } catch (err) {
        setError("Unable to sync with the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      SHORTLISTED: { bg: "success", label: "Shortlisted", class: "bg-opacity-10 text-success border-success" },
      REJECTED: { bg: "danger", label: "Rejected", class: "bg-opacity-10 text-danger border-danger" },
      ACCEPTED: { bg: "primary", label: "Accepted", class: "bg-opacity-10 text-primary border-primary" },
      default: { bg: "secondary", label: "Applied", class: "bg-opacity-10 text-secondary border-secondary" },
    };
    const current = statusMap[status] || statusMap.default;
    return (
      <Badge className={`px-3 py-2 rounded-pill border ${current.class}`} style={{ fontWeight: "600" }}>
        {current.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="grow" variant="primary" />
        <p className="mt-3 text-muted fw-medium">Loading your career journey...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Header Section */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold text-dark">My Applications</h2>
          <p className="text-muted mb-0">Track and manage your active job submissions</p>
        </Col>
        <Col xs="auto">
          <div className="bg-white shadow-sm px-4 py-2 rounded-4 border">
            <span className="text-muted small fw-bold text-uppercase me-2">Active:</span>
            <span className="h5 fw-bold text-primary mb-0">{applications.length}</span>
          </div>
        </Col>
      </Row>

      {error && <Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert>}

      {/* Main Table Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Table hover responsive className="mb-0 align-middle border-0">
          <thead className="bg-light text-muted small text-uppercase" style={{ letterSpacing: "1px" }}>
            <tr>
              <th className="ps-4 py-3">Job Details</th>
              <th className="py-3">Location</th>
              <th className="py-3">Budget</th>
              <th className="py-3">Applied On</th>
              <th className="text-center py-3 pe-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5">
                  <Briefcase size={48} className="text-light mb-3" />
                  <h5 className="text-muted">No applications found</h5>
                  <p className="small text-muted">Time to find your next big opportunity!</p>
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.application_id} style={{ transition: "0.3s" }}>
                  <td className="ps-4 py-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <div className="fw-bold text-dark mb-0">{app.title || "Untitled Role"}</div>
                        <div className="text-muted small">Ref ID: #{app.application_id}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex align-items-center text-muted">
                      <MapPin size={16} className="me-1 text-danger" />
                      <span>{app.location || "Remote"}</span>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex align-items-center fw-bold text-dark">
                      <IndianRupee size={16} className="me-1 text-success" />
                      <span>{app.budget?.toLocaleString("en-IN")}</span>
                    </div>
                  </td>

                  <td className="text-muted">
                    <div className="d-flex align-items-center">
                      <Calendar size={16} className="me-1" />
                      <span>
                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString("en-IN") : "N/A"}
                      </span>
                    </div>
                  </td>

                  <td className="text-center pe-4">
                    {getStatusBadge(app.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Quick Tips */}
      <div className="mt-4 p-3 bg-white border rounded-4 d-flex align-items-center">
        <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3 text-info">
          <Info size={20} />
        </div>
        <p className="mb-0 small text-muted">
          <strong>Tip:</strong> Employers usually respond within 3-5 business days. Keep your profile updated for better results!
        </p>
      </div>
    </Container>
  );
};

export default MyApplicationsPage;