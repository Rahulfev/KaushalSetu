import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/services/axiosInstance';

const statusBadge = (status) => {
  switch (status) {
    case 'APPROVED':
      return <Badge bg="success" pill>✔ Verified</Badge>;
    case 'PENDING':
      return <Badge bg="warning" text="dark" pill>Under Review</Badge>;
    case 'REJECTED':
      return <Badge bg="danger" pill>Rejected</Badge>;
    default:
      return <Badge bg="secondary" pill>Not Submitted</Badge>;
  }
};

// Read-only view for a client/organization to verify the identity documents
// of a worker they have hired — helps with accountability if a dispute or
// misconduct issue comes up later.
const WorkerVerificationPage = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/client/workers/${workerId}/documents`);
        setProfile(data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "You don't have access to this worker's documents.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [workerId]);

  if (loading) {
    return (
      <Container className="p-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 fw-bold text-muted">Loading worker verification profile...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="p-5">
        <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
          {error}
        </Alert>
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>← Go Back</Button>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Button variant="link" className="text-decoration-none fw-bold mb-3 ps-0" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Body className="p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-dark bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                <i className="bi bi-person-fill fs-2 text-dark"></i>
              </div>
              <div>
                <h4 className="fw-bold mb-0">{profile.fullName}</h4>
                <div className="text-muted small">{profile.email}</div>
                <div className="text-muted small">{profile.countryCode} {profile.phone}</div>
              </div>
            </div>
            <div className="text-end">
              <div className="small text-muted fw-bold mb-1">OVERALL KYC STATUS</div>
              {statusBadge(profile.overallKycStatus)}
            </div>
          </Card.Body>
        </Card>

        <h5 className="fw-bold mb-3">
          <i className="bi bi-shield-lock me-2 text-primary"></i>
          Identity Documents
        </h5>

        {(!profile.documents || profile.documents.length === 0) && (
          <Alert variant="light" className="border rounded-4">
            This worker hasn't submitted any identity documents yet.
          </Alert>
        )}

        <Row className="g-3">
          {profile.documents?.map((doc) => (
            <Col md={6} key={doc.kycId}>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div className="text-muted small fw-bold text-uppercase">{doc.documentType}</div>
                    </div>
                    {statusBadge(doc.status)}
                  </div>
                  {doc.verifiedBy && (
                    <div className="small text-muted">
                      Verified by {doc.verifiedBy}
                      {doc.verifiedAt && ` on ${new Date(doc.verifiedAt).toLocaleDateString('en-IN')}`}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Alert variant="light" className="border rounded-4 mt-4 small text-muted">
          <i className="bi bi-info-circle me-2"></i>
          This information is shown only because you have (or had) a contract with this worker,
          so you can verify their identity in case of a dispute or misconduct. Please handle it responsibly.
        </Alert>
      </Container>
    </div>
  );
};

export default WorkerVerificationPage;
