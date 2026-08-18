import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import axiosInstance from '@/services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    district: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const districts = ["MUMBAI_CITY", "MUMBAI_SUBURBAN", "THANE", "PALGHAR", "RAIGAD", "PUNE", "SATARA", "SOLAPUR", "KOLHAPUR", "SANGLI", "NASHIK", "AHMEDNAGAR", "DHULE", "JALGAON", "NANDURBAR", "AURANGABAD", "JALNA", "BEED", "OSMANABAD", "LATUR", "NANDED", "PARBHANI", "HINGOLI", "AKOLA", "AMRAVATI", "BULDHANA", "WASHIM", "YAVATMAL", "NAGPUR", "WARDHA", "BHANDARA", "GONDIA", "CHANDRAPUR", "GADCHIROLI", "RATNAGIRI", "SINDHUDURG"];

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        ...jobData,
        budget: parseFloat(jobData.budget)
      };
      
      await axiosInstance.post('/jobs', payload);
      toast.success('Professional requirement broadcasted successfully!');
      navigate('/organization/home');
    } catch (err) {
      setError('Dispatch Error: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          {/* ℹ️ LEFT COLUMN: GUIDELINES */}
          <Col lg={4} className="mb-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              <h2 className="fw-bold text-dark mb-3">Broadcasting Requirement</h2>
              <p className="text-muted mb-4">
                Define your project parameters clearly to ensure the system matches you with the most qualified professionals in the regional labor pool.
              </p>
              
              <Card className="border-0 shadow-sm rounded-4 mb-3" style={{ background: '#0f172a', color: '#fff' }}>
                <Card.Body className="p-4">
                  <h6 className="text-warning fw-bold mb-3"><i className="bi bi-shield-check me-2"></i>Platform Standards</h6>
                  <ul className="list-unstyled small opacity-75 d-grid gap-3">
                    <li><i className="bi bi-check2-circle text-warning me-2"></i>Budget figures are verified for escrow readiness.</li>
                    <li><i className="bi bi-check2-circle text-warning me-2"></i>Location data used for targeted worker notifications.</li>
                    <li><i className="bi bi-check2-circle text-warning me-2"></i>Requirements visible to all verified labor nodes.</li>
                  </ul>
                </Card.Body>
              </Card>

              <Alert variant="info" className="border-0 rounded-4 small shadow-sm">
                <i className="bi bi-info-circle-fill me-2"></i>
                <strong>Notice:</strong> Accurate district tagging ensures 60% faster shortlisting.
              </Alert>
            </div>
          </Col>

          {/* 📝 RIGHT COLUMN: THE FORM */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white">
              <Form onSubmit={handleSubmit}>
                <h5 className="fw-bold text-dark mb-4">Project Specifications</h5>
                
                {error && <Alert variant="danger" className="rounded-3 border-0">{error}</Alert>}

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted text-uppercase">Contract Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={jobData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Lead Carpentry Specialist for Phase 2"
                    className="py-2 border-light bg-light rounded-3 shadow-none fw-bold"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted text-uppercase">Operational Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={jobData.category}
                        onChange={handleChange}
                        required
                        className="py-2 border-light bg-light rounded-3 shadow-none fw-bold"
                      >
                        {/* <option value="">Select Domain...</option>
                        <option value="Construction">Construction</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Painting">Painting</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Labor">General Labor</option> */}

                         <option value="">Select Domain...</option>
                          <option value="Construction">Construction</option>
                          <option value="Warehousing & Logistics">Warehousing & Logistics</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted text-uppercase">Proposed Budget (₹)</Form.Label>
                      <InputGroup className="rounded-3 overflow-hidden">
                        <InputGroup.Text className="bg-light border-light text-muted">₹</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          name="budget"
                          value={jobData.budget}
                          onChange={handleChange}
                          required
                          placeholder="Amount"
                          className="py-2 border-light bg-light shadow-none fw-bold"
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted text-uppercase">Detailed Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={jobData.description}
                    onChange={handleChange}
                    required
                    placeholder="Provide scope of work, technical requirements, and shift timings..."
                    className="py-2 border-light bg-light rounded-3 shadow-none"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted text-uppercase">Target District</Form.Label>
                      <Form.Select
                        name="district"
                        value={jobData.district}
                        onChange={handleChange}
                        required
                        className="py-2 border-light bg-light rounded-3 shadow-none fw-bold"
                      >
                        <option value="">Select Location...</option>
                        {districts.map(d => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted text-uppercase">Specific Site Address</Form.Label>
                      <Form.Control
                        name="location"
                        value={jobData.location}
                        onChange={handleChange}
                        required
                        placeholder="Landmark, Area, PIN"
                        className="py-2 border-light bg-light rounded-3 shadow-none fw-bold"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-3 pt-3 border-top">
                  <Button 
                    type="submit" 
                    variant="warning" 
                    disabled={loading}
                    className="py-3 fw-bold rounded-pill text-dark border-0 shadow"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Synchronizing Requirement...
                      </>
                    ) : (
                      'Broadcast Requirement'
                    )}
                  </Button>
                  <Button 
                    variant="light" 
                    className="py-2 fw-bold rounded-pill text-muted border-0"
                    onClick={() => navigate('/organization/home')}
                  >
                    Discard Draft
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PostJob;