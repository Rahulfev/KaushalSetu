import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { workerApi } from '../services/workerDashboardApi';

const ActiveJobsPage = () => {
    const [activeJobs, setActiveJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Client household-hiring engagements (Assigned -> Ongoing -> Completed -> Paid)
    const [engagements, setEngagements] = useState([]);
    const [engagementsLoading, setEngagementsLoading] = useState(true);
    const [busyAppId, setBusyAppId] = useState(null);

    const loadEngagements = async () => {
        try {
            const res = await workerApi.getMyApplications();
            const rows = (res.data || []).filter(a =>
                ['ASSIGNED', 'ONGOING', 'COMPLETED', 'PAID'].includes(a.status)
            );
            setEngagements(rows);
        } catch (err) {
            // non-fatal — the contract-based section above still works
        } finally {
            setEngagementsLoading(false);
        }
    };

    const handleStartService = async (app) => {
        setBusyAppId(app.application_id);
        try {
            await workerApi.startService(app.application_id);
            toast.success('Service started! Status is now Ongoing.');
            loadEngagements();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not start service');
        } finally {
            setBusyAppId(null);
        }
    };

    const handleCompleteService = async (app) => {
        setBusyAppId(app.application_id);
        try {
            await workerApi.completeService(app.application_id);
            toast.success('Marked complete! The client can now pay you.');
            loadEngagements();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not mark as complete');
        } finally {
            setBusyAppId(null);
        }
    };
    
    // ✅ State for Submission Modal
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [deliveryNote, setDeliveryNote] = useState("");

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const res = await workerApi.getActiveJobs();
                setActiveJobs(res.data || []);
            } catch (err) {
                setError("Access Denied: Please ensure your account is verified.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadJobs();
        loadEngagements();
    }, []);

    const handleOpenSubmit = (job) => {
        setSelectedJob(job);
        setShowSubmitModal(true);
    };

    const [submitting, setSubmitting] = useState(false);

    const handleFinalSubmit = async () => {
        if (!selectedJob?.contract_id) {
            toast.error("Could not find the contract for this job.");
            return;
        }
        setSubmitting(true);
        try {
            await workerApi.markJobComplete(selectedJob.contract_id);
            setShowSubmitModal(false);
            toast.success("Work marked as complete! The client/organization can now release payment.");
            // Remove it from the active list since it's no longer ACTIVE/SIGNED
            setActiveJobs(prev => prev.filter(j => j.contract_id !== selectedJob.contract_id));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit work. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '80vh' }}>
            <Spinner animation="border" variant="warning" />
        </div>
    );

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                {/* 🚀 Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Active Work Management</h2>
                        <p className="text-muted mb-0">Track your ongoing projects and milestone progress.</p>
                    </div>
                    <Badge bg="warning" text="dark" className="px-4 py-3 rounded-pill shadow-sm fs-6 mt-3 mt-md-0">
                        <i className="bi bi-tools me-2"></i>{activeJobs.length} Ongoing Projects
                    </Badge>
                </div>

                {error && <Alert variant="danger" className="rounded-4 border-0 shadow-sm mb-4">{error}</Alert>}

                {/* ───────── Client Household-Hiring Engagements ───────── */}
                {!engagementsLoading && engagements.length > 0 && (
                    <div className="mb-5">
                        <h5 className="fw-bold text-dark mb-3">Household Service Jobs</h5>
                        <Row className="g-4">
                            {engagements.map(app => {
                                const statusMeta = {
                                    ASSIGNED: { bg: 'warning', text: 'dark', label: 'Assigned' },
                                    ONGOING: { bg: 'primary', text: 'white', label: 'Ongoing' },
                                    COMPLETED: { bg: 'success', text: 'white', label: 'Completed' },
                                    PAID: { bg: 'dark', text: 'white', label: 'Paid' },
                                }[app.status] || { bg: 'secondary', text: 'white', label: app.status };
                                const busy = busyAppId === app.application_id;

                                return (
                                    <Col lg={6} key={app.application_id}>
                                        <Card className="shadow-sm border-0 h-100 rounded-4">
                                            <Card.Body className="p-4">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <h5 className="fw-bold text-dark mb-0">{app.title}</h5>
                                                    <Badge bg={statusMeta.bg} text={statusMeta.text} className="rounded-pill px-3 py-2">{statusMeta.label}</Badge>
                                                </div>
                                                <div className="text-muted small mb-3">
                                                    <i className="bi bi-geo-alt-fill me-1 text-danger"></i>{app.location}
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-3">
                                                    <span className="text-muted small fw-bold">YOUR QUOTE</span>
                                                    <span className="h5 fw-bold text-success mb-0">₹{app.estimated_budget}</span>
                                                </div>

                                                {app.status === 'ASSIGNED' && (
                                                    <Button variant="dark" className="w-100 fw-bold py-2 rounded-pill" disabled={busy} onClick={() => handleStartService(app)}>
                                                        {busy ? <Spinner size="sm" /> : 'Start Service'}
                                                    </Button>
                                                )}
                                                {app.status === 'ONGOING' && (
                                                    <Button variant="warning" className="w-100 fw-bold py-2 rounded-pill text-dark" disabled={busy} onClick={() => handleCompleteService(app)}>
                                                        {busy ? <Spinner size="sm" /> : 'Complete Service'}
                                                    </Button>
                                                )}
                                                {app.status === 'COMPLETED' && (
                                                    <div className="text-center py-2 bg-success bg-opacity-10 rounded-pill text-success fw-bold small">
                                                        Waiting for client payment
                                                    </div>
                                                )}
                                                {app.status === 'PAID' && (
                                                    <div className="text-center py-2 bg-dark bg-opacity-10 rounded-pill text-dark fw-bold small">
                                                        ✔ Paid — check your wallet
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                )}


                {activeJobs.length > 0 ? (
                    <Row className="g-4">
                        {activeJobs.map(job => (
                            <Col lg={6} key={job.contract_id}>
                                <Card className="shadow-sm border-0 h-100 rounded-4 card-hover-effect">
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-4">
                                            <div>
                                                <h4 className="fw-bold text-dark mb-1">{job.title}</h4>
                                                <div className="text-muted small">
                                                    <i className="bi bi-calendar3 me-2 text-primary"></i>
                                                    Started: {new Date(job.start_date).toLocaleDateString('en-IN')}
                                                </div>
                                            </div>
                                            <Badge bg="success" className="rounded-pill px-3 py-2 text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
                                                {job.status}
                                            </Badge>
                                        </div>

                                        {/* 💰 Financial Quick View */}
                                        <div className="p-3 bg-light rounded-4 border d-flex justify-content-around text-center mb-4">
                                            <div>
                                                <small className="text-muted d-block fw-bold mb-1 extra-small text-uppercase">Total Contract</small>
                                                <span className="fw-bold text-dark fs-5">₹{job.agreed_amount?.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="vr opacity-10"></div>
                                            <div>
                                                <small className="text-muted d-block fw-bold mb-1 extra-small text-uppercase">Next Milestone</small>
                                                <span className="fw-bold text-danger fs-5">
                                                    {new Date(job.end_date).toLocaleDateString('en-IN')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 📊 Progress Bar */}
                                        <div className="mb-4 px-1">
                                            <div className="d-flex justify-content-between small mb-2">
                                                <span className="fw-bold text-muted small">COMPLETION PROGRESS</span>
                                                <span className="fw-bold text-primary">65%</span>
                                            </div>
                                            <ProgressBar now={65} variant="warning" style={{ height: '8px' }} className="rounded-pill bg-secondary bg-opacity-10" />
                                        </div>

                                        <div className="d-flex gap-2">
                                            <Button 
                                                variant="dark" 
                                                className="w-100 fw-bold py-2 rounded-pill shadow-sm"
                                                onClick={() => handleOpenSubmit(job)}
                                            >
                                                Submit Work
                                            </Button>
                                            <Button 
                                                href={`/worker/contracts/${job.contract_id}`} 
                                                variant="outline-dark" 
                                                className="w-100 fw-bold py-2 rounded-pill"
                                            >
                                                View Terms
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <div className="text-center py-5 bg-white rounded-5 shadow-sm border">
                        <i className="bi bi-journal-x display-1 text-muted opacity-25"></i>
                        <h4 className="text-muted mt-3">No active projects found.</h4>
                        <p className="small text-muted mb-4">Start applying to jobs to build your work history.</p>
                        <Button as="a" href="/worker/find-jobs" variant="warning" className="rounded-pill px-4 fw-bold">Browse Job Feed</Button>
                    </div>
                )}
            </Container>

            {/* ——————————————————————————————————————————————————————————————
                ✅ ELITE SUBMISSION MODAL
            ———————————————————————————————————————————————————————————————— */}
            <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} centered className="border-0">
                <Modal.Body className="p-0 overflow-hidden rounded-4">
                    <div className="p-4 text-white" style={{ background: '#0f172a' }}>
                        <Modal.Title className="fw-bold">Deliver Project</Modal.Title>
                        <p className="mb-0 text-white-50 small">Finalize your work for Client review.</p>
                    </div>
                    <div className="p-4">
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold text-muted small text-uppercase">Completion Note</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={4} 
                                className="border-light bg-light rounded-4 p-3 shadow-none focus-yellow"
                                placeholder="Describe the work completed. Mention any specific details for the client..."
                                onChange={(e) => setDeliveryNote(e.target.value)}
                            />
                        </Form.Group>
                        <div className="bg-warning bg-opacity-10 p-3 rounded-4 d-flex align-items-center mb-2">
                            <i className="bi bi-shield-check-fill text-warning fs-4 me-3"></i>
                            <span className="small fw-bold">Funds will be released once the client approves your submission.</span>
                        </div>
                    </div>
                    <div className="p-4 pt-0 d-flex gap-2">
                        <Button variant="light" className="w-100 fw-bold rounded-pill py-2" onClick={() => setShowSubmitModal(false)}>
                            Wait, Back
                        </Button>
                        <Button variant="warning" onClick={handleFinalSubmit} disabled={submitting} className="w-100 fw-bold rounded-pill py-2 text-dark shadow">
                            {submitting ? "Submitting..." : "Submit Deliverables"}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <style>{`
                .card-hover-effect { transition: all 0.2s ease-in-out; }
                .card-hover-effect:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important; }
                .extra-small { font-size: 0.65rem; letter-spacing: 0.05em; }
                .focus-yellow:focus { border-color: #facc15 !important; box-shadow: 0 0 0 0.2rem rgba(250, 204, 21, 0.1) !important; }
            `}</style>
        </div>
    );
};

export default ActiveJobsPage;