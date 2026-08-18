import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Spinner
} from 'react-bootstrap';
import { useOrgData } from '../hooks/useOrgData';
import axiosInstance from '@/services/axiosInstance';

const OrganizationHome = () => {
  const { orgName } = useOrgData();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMyJobs, setShowMyJobs] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const endpoint = showMyJobs ? '/jobs/my-jobs' : '/jobs/all';
      const response = await axiosInstance.get(endpoint);
      setJobs(response.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Unable to synchronize with job registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [showMyJobs]);

  const isMyJob = (job) => {
    const userId = localStorage.getItem('userId');
    return job.postedByUserId === parseInt(userId);
  };

  const handleEdit = (job) => {
    setEditingJob({ ...job });
    setShowEditModal(true);
    setError(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/jobs/${editingJob.jobId}`, {
        title: editingJob.title,
        description: editingJob.description,
        category: editingJob.category,
        budget: parseFloat(editingJob.budget),
        location: editingJob.location,
        district: editingJob.district,
      });
      setSuccess('Job updated successfully!');
      setShowEditModal(false);
      fetchJobs();
    } catch (err) {
      setError('Professional record update failed.');
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('CRITICAL: Permanently remove this job posting from the registry?')) {
      try {
        await axiosInstance.delete(`/organization/jobs/${jobId}`);
        setSuccess('Posting removed successfully.');
        fetchJobs();
      } catch (err) {
        setError(err.response?.data?.message || 'Authorization error or deletion failed.');
      }
    }
  };

  const handleInputChange = (e) => {
    setEditingJob({ ...editingJob, [e.target.name]: e.target.value });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'OPEN': return { bg: 'success', label: '● RECRUITING' };
      case 'IN_PROGRESS': return { bg: 'warning', label: '● ACTIVE' };
      case 'COMPLETED': return { bg: 'info', label: '● COMPLETED' };
      case 'CANCELLED': return { bg: 'danger', label: '● CANCELLED' };
      default: return { bg: 'secondary', label: status };
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* 🚀 ELITE HERO WELCOME */}
      <section className="py-5 text-white mb-5" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <Container className="text-center">
          <Badge bg="warning" text="dark" className="mb-3 px-3 py-2 fw-bold">AUTHORIZED ENTITY</Badge>
          <h1 className="display-5 fw-bold mb-2">Welcome to the Workspace</h1>
          <p className="opacity-75 lead mx-auto" style={{ maxWidth: '700px' }}>
            {orgName}, utilize this command center to oversee recruitment and manage active project postings.
          </p>
        </Container>
      </section>

      <Container>
        {error && <Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert>}
        {success && <Alert variant="success" className="rounded-4 border-0 shadow-sm">{success}</Alert>}

        {/* 🛠️ NAVIGATION & FILTER BAR */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 bg-white p-3 rounded-4 shadow-sm border">
          <h4 className="fw-bold mb-3 mb-md-0 text-dark">
            {showMyJobs ? 'Proprietary Postings' : 'Posted Jobs'}
          </h4>
          <div className="bg-light p-1 rounded-pill border shadow-inner">
            <Button
              variant={showMyJobs ? 'warning' : 'transparent'}
              className={`rounded-pill px-4 fw-bold ${showMyJobs ? 'text-dark shadow-sm' : 'text-muted'}`}
              onClick={() => setShowMyJobs(true)}
            >
              My Jobs
            </Button>
            <Button
              variant={!showMyJobs ? 'warning' : 'transparent'}
              className={`rounded-pill px-4 fw-bold ${!showMyJobs ? 'text-dark shadow-sm' : 'text-muted'}`}
              onClick={() => setShowMyJobs(false)}
            >
              All Jobs
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-muted fw-bold">Synchronizing Registry...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-5 shadow-sm border">
            <i className="bi bi-journal-x display-1 text-muted opacity-25"></i>
            <h4 className="text-muted mt-3">No jobs found in this category.</h4>
          </div>
        ) : (
          <Row className="g-4">
            {jobs.map((job) => (
              <Col md={6} lg={4} key={job.jobId}>
                <Card className="border-0 shadow-sm h-100 rounded-4 transition-hover">
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-bold extra-small">
                        {job.category}
                      </Badge>
                      <h5 className="text-success fw-bold mb-0">₹{job.budget?.toLocaleString('en-IN')}</h5>
                    </div>
                    
                    <Card.Title className="fw-bold text-dark mb-3">{job.title}</Card.Title>
                    <Card.Text className="small text-muted mb-4 flex-grow-1 line-clamp-3">
                      {job.description}
                    </Card.Text>

                    <div className="pt-3 border-top mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted extra-small">
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                          {job.location}, {job.district}
                        </div>
                        <Badge pill className={`bg-${getStatusConfig(job.status).bg}-subtle text-${getStatusConfig(job.status).bg} border border-${getStatusConfig(job.status).bg}`}>
                          {getStatusConfig(job.status).label}
                        </Badge>
                      </div>

                      {(showMyJobs || isMyJob(job)) && job.status === 'OPEN' && (
                        <div className="d-grid gap-2 mt-3 pt-3 border-top border-light">
                          <Row className="g-2">
                            <Col xs={6}>
                              <Button variant="outline-dark" size="sm" className="w-100 rounded-pill fw-bold" onClick={() => handleEdit(job)}>
                                Edit
                              </Button>
                            </Col>
                            <Col xs={6}>
                              <Button variant="outline-danger" size="sm" className="w-100 rounded-pill fw-bold" onClick={() => handleDelete(job.jobId)}>
                                Delete
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      )}

                      {(showMyJobs || isMyJob(job)) && job.status !== 'OPEN' && (
                        <div className="mt-3 pt-3 border-top border-light text-center small text-muted">
                          {job.status === 'IN_PROGRESS'
                            ? 'Contract active — can no longer be edited or deleted'
                            : 'Job has application/contract history — can no longer be edited or deleted'}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* 📝 ELITE EDIT MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Body className="p-0 overflow-hidden rounded-4">
          <div className="p-4 text-white" style={{ background: '#0f172a' }}>
            <Modal.Title className="fw-bold">Modify Posting</Modal.Title>
            <p className="mb-0 text-white-50 small">Update parameters for the selected professional requirement.</p>
          </div>
          <div className="p-4 bg-white">
            {editingJob && (
              <Form onSubmit={handleSaveEdit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted text-uppercase">Project Title</Form.Label>
                  <Form.Control name="title" value={editingJob.title} onChange={handleInputChange} className="border-light bg-light rounded-3" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted text-uppercase">Requirement Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={editingJob.description} onChange={handleInputChange} className="border-light bg-light rounded-3" required />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted text-uppercase">Budget (₹)</Form.Label>
                      <Form.Control type="number" name="budget" value={editingJob.budget} onChange={handleInputChange} className="border-light bg-light rounded-3" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-muted text-uppercase">Category</Form.Label>
                      <Form.Control name="category" value={editingJob.category} onChange={handleInputChange} className="border-light bg-light rounded-3" required />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-grid gap-2 mt-4 pt-3 border-top">
                  <Button type="submit" variant="warning" className="py-2 fw-bold rounded-pill text-dark shadow">
                    Save Professional Record
                  </Button>
                  <Button variant="light" className="py-2 fw-bold rounded-pill" onClick={() => setShowEditModal(false)}>
                    Abort
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        .transition-hover { transition: all 0.2s ease; }
        .transition-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .extra-small { font-size: 0.7rem; letter-spacing: 0.5px; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default OrganizationHome;