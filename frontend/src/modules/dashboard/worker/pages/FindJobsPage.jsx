import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Spinner, Alert, InputGroup, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { workerApi } from '../services/workerDashboardApi';

const FindJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [district, setDistrict] = useState('PUNE');

    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applying, setApplying] = useState(false);
    const [applyForm, setApplyForm] = useState({ estimatedBudget: '', coverMessage: '', expectedStartTime: '', expectedCompletionTime: '' });

    useEffect(() => {
        fetchJobs();
    }, [district]);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await workerApi.getJobFeed(district);
            setJobs(res.data || []);
        } catch (err) {
            setError("Unable to sync with job feed. Verify backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (job) => {
        setSelectedJob(job);
        setApplyForm({ estimatedBudget: '', coverMessage: '', expectedStartTime: '', expectedCompletionTime: '' });
        setShowModal(true);
    };

    const isClientJob = (job) => !job?.budget && !!job?.service_address;

    const confirmApply = async () => {
        const clientJob = isClientJob(selectedJob);
        if (clientJob) {
            if (!applyForm.estimatedBudget || Number(applyForm.estimatedBudget) <= 0) {
                toast.error('Enter your estimated budget for this job');
                return;
            }
            if (!applyForm.coverMessage.trim()) {
                toast.error('Add a short cover message');
                return;
            }
        }

        setApplying(true);
        try {
            await workerApi.applyToJob(
                selectedJob.job_id,
                clientJob
                    ? {
                        estimatedBudget: Number(applyForm.estimatedBudget),
                        coverMessage: applyForm.coverMessage,
                        expectedStartTime: applyForm.expectedStartTime || null,
                        expectedCompletionTime: applyForm.expectedCompletionTime || null,
                      }
                    : null
            );
            toast.success("Application submitted successfully!");
            setShowModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Already applied or an error occurred.");
        } finally {
            setApplying(false);
        }
    };

    const filteredJobs = jobs.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-light min-vh-100">
            {/* 🚀 PRO SEARCH HERO */}
            <section className="py-5 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <Badge bg="warning" text="dark" className="mb-3 px-3 py-2 fw-bold">LOCAL OPPORTUNITIES</Badge>
                            <h2 className="display-5 fw-bold mb-3">Find Your Next Contract</h2>
                            <p className="opacity-75 mb-4">Connecting skilled hands with verified clients in {district.replace('_', ' ')}.</p>
                            
                            <InputGroup className="shadow-lg rounded-pill overflow-hidden border-0">
                                <Form.Control 
                                    placeholder="Search by skill (e.g. Electrician, Painter)..." 
                                    className="py-3 ps-4 border-0"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="warning" className="px-4 fw-bold text-dark border-0">
                                    <i className="bi bi-search me-2"></i>Search
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="py-5">
                {/* 🛠️ FILTER BAR */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 bg-white p-3 rounded-4 shadow-sm border">
                    <div className="d-flex align-items-center mb-3 mb-md-0">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                            <i className="bi bi-funnel-fill text-primary"></i>
                        </div>
                        <h5 className="mb-0 fw-bold">{filteredJobs.length} Jobs Available</h5>
                    </div>
                    
                    <div className="d-flex align-items-center gap-3">
                        <label className="small fw-bold text-muted">Filter by District:</label>
                        <Form.Select 
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="rounded-pill border-light bg-light fw-bold px-4"
                            style={{ width: '220px' }}
                        >
                            <option value="MUMBAI_CITY">Mumbai City</option>
                            <option value="MUMBAI_SUBURBAN">Mumbai Suburban</option>
                            <option value="PUNE">Pune</option>
                            <option value="THANE">Thane</option>
                            <option value="NAGPUR">Nagpur</option>
                            <option value="NASHIK">Nashik</option>
                        </Form.Select>
                    </div>
                </div>

                {error && <Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert>}

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="warning" />
                        <p className="mt-3 text-muted fw-bold">Fetching live contracts...</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {filteredJobs.length > 0 ? filteredJobs.map(job => (
                            <Col md={6} lg={4} key={job.job_id}>
                                <Card className="border-0 shadow-sm h-100 rounded-4 card-hover-effect">
                                    <Card.Body className="p-4 d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <Badge bg="light" text="primary" className="border px-3 py-2 rounded-pill fw-bold">
                                                {job.category}
                                            </Badge>
                                            {job.budget ? (
                                                <h4 className="text-success fw-bold mb-0">₹{job.budget?.toLocaleString('en-IN')}</h4>
                                            ) : (
                                                <Badge bg="warning" text="dark" className="px-2 py-1">Quote your price</Badge>
                                            )}
                                        </div>
                                        <Card.Title className="fw-bold text-dark fs-5 mb-2">{job.title}</Card.Title>
                                        <div className="text-muted small mb-3">
                                            <i className="bi bi-geo-alt-fill text-danger me-1"></i> {job.location}
                                        </div>
                                        
                                        <Card.Text className="small text-muted mb-4 flex-grow-1 lh-base">
                                            {job.description?.length > 110 ? job.description.substring(0, 110) + "..." : job.description}
                                        </Card.Text>
                                        
                                        <div className="pt-3 border-top mt-auto d-flex justify-content-between align-items-center">
                                            <span className="small fw-bold text-primary">
                                                <i className="bi bi-person-circle me-1"></i> {job.client_name}
                                            </span>
                                            <Button 
                                                variant="dark" 
                                                size="sm"
                                                className="fw-bold rounded-pill px-4"
                                                onClick={() => handleShowModal(job)}
                                            >
                                                View & Apply
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )) : (
                            <Col xs={12} className="text-center py-5">
                                <div className="p-5 bg-white rounded-5 shadow-sm border">
                                    <i className="bi bi-search text-muted display-1"></i>
                                    <h4 className="text-muted mt-3">No jobs found in this area.</h4>
                                    <p className="small text-muted">Try changing your search term or selecting another district.</p>
                                </div>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>

            {/* ✅ ENHANCED APPLICATION MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Body className="p-0 overflow-hidden rounded-4 border-0">
                    {selectedJob && (
                        <>
                            <div className="p-4 text-white" style={{ background: '#0f172a' }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Badge bg="warning" text="dark" className="px-3 py-2 fw-bold">JOB DETAILS</Badge>
                                    {selectedJob.budget ? (
                                        <h3 className="text-success fw-bold mb-0">₹{selectedJob.budget?.toLocaleString('en-IN')}</h3>
                                    ) : (
                                        <Badge bg="light" text="dark" className="px-3 py-2">You set the price</Badge>
                                    )}
                                </div>
                                <h2 className="mt-3 fw-bold">{selectedJob.title}</h2>
                                <p className="mb-0 opacity-75"><i className="bi bi-tag-fill me-2"></i>{selectedJob.category}</p>
                            </div>

                            <div className="p-4 bg-white">
                                <Row className="g-3 mb-4">
                                    <Col sm={6}>
                                        <div className="p-3 bg-light rounded-4 border h-100">
                                            <small className="text-muted fw-bold d-block mb-1">HIRING CLIENT</small>
                                            <p className="fw-bold mb-0 text-primary fs-5">
                                                <i className="bi bi-patch-check-fill me-2"></i>{selectedJob.client_name}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="p-3 bg-light rounded-4 border h-100">
                                            <small className="text-muted fw-bold d-block mb-1">WORK LOCATION</small>
                                            <p className="fw-bold mb-0 fs-5 text-dark">
                                                <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                                                {selectedJob.service_address || selectedJob.location}
                                                {selectedJob.city ? `, ${selectedJob.city}` : ''}
                                            </p>
                                        </div>
                                    </Col>
                                    {selectedJob.preferred_date && (
                                        <Col sm={6}>
                                            <div className="p-3 bg-light rounded-4 border h-100">
                                                <small className="text-muted fw-bold d-block mb-1">PREFERRED DATE</small>
                                                <p className="fw-bold mb-0 text-dark">{selectedJob.preferred_date}</p>
                                            </div>
                                        </Col>
                                    )}
                                    {selectedJob.preferred_time && (
                                        <Col sm={6}>
                                            <div className="p-3 bg-light rounded-4 border h-100">
                                                <small className="text-muted fw-bold d-block mb-1">PREFERRED TIME</small>
                                                <p className="fw-bold mb-0 text-dark">{selectedJob.preferred_time}</p>
                                            </div>
                                        </Col>
                                    )}
                                </Row>

                                <h6 className="fw-bold text-dark mb-2">Description</h6>
                                <p className="text-muted p-3 border rounded-4 bg-light" style={{ minHeight: '80px' }}>
                                    {selectedJob.description}
                                </p>
                                {selectedJob.additional_notes && (
                                    <p className="text-muted small mb-4"><strong>Notes:</strong> {selectedJob.additional_notes}</p>
                                )}

                                {isClientJob(selectedJob) ? (
                                    <>
                                        <h6 className="fw-bold text-dark mb-3 mt-4">Your Application</h6>
                                        <Row className="g-3 mb-2">
                                            <Col md={6}>
                                                <Form.Label className="small fw-bold text-muted">ESTIMATED BUDGET (₹) *</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Your price for this job"
                                                    value={applyForm.estimatedBudget}
                                                    onChange={(e) => setApplyForm(f => ({ ...f, estimatedBudget: e.target.value }))}
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Label className="small fw-bold text-muted">EXPECTED START TIME</Form.Label>
                                                <Form.Control
                                                    placeholder="e.g. Tomorrow 10 AM"
                                                    value={applyForm.expectedStartTime}
                                                    onChange={(e) => setApplyForm(f => ({ ...f, expectedStartTime: e.target.value }))}
                                                />
                                            </Col>
                                            <Col md={12}>
                                                <Form.Label className="small fw-bold text-muted">COVER MESSAGE *</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    placeholder="Introduce yourself and your experience with this type of work..."
                                                    value={applyForm.coverMessage}
                                                    onChange={(e) => setApplyForm(f => ({ ...f, coverMessage: e.target.value }))}
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Label className="small fw-bold text-muted">EXPECTED COMPLETION TIME</Form.Label>
                                                <Form.Control
                                                    placeholder="e.g. Same day, by 2 PM"
                                                    value={applyForm.expectedCompletionTime}
                                                    onChange={(e) => setApplyForm(f => ({ ...f, expectedCompletionTime: e.target.value }))}
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <Alert variant="warning" className="border-0 rounded-4 p-3 d-flex align-items-center">
                                        <i className="bi bi-shield-lock-fill fs-4 me-3"></i>
                                        <span className="small fw-bold">Escrow Protected: Funds will be held securely by KaushalSetu until you complete the work.</span>
                                    </Alert>
                                )}
                            </div>

                            <div className="p-4 border-top bg-light d-flex justify-content-end gap-2">
                                <Button variant="outline-dark" className="rounded-pill px-4 fw-bold" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button 
                                    variant="primary" 
                                    className="rounded-pill px-5 fw-bold shadow" 
                                    onClick={confirmApply} 
                                    disabled={applying}
                                >
                                    {applying ? <Spinner size="sm" /> : "Confirm Application"}
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>

            <style>{`
                .card-hover-effect { transition: all 0.3s ease; }
                .card-hover-effect:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
            `}</style>
        </div>
    );
};

export default FindJobsPage;