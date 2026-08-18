import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { workerApi } from '../services/workerDashboardApi';

const WorkerDashboardPage = () => {
    const [stats, setStats] = useState({ fullName: '', applied: 0, shortlisted: 0, escrow: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        workerApi.getDashboardStats()
            .then(res => {
                setStats({
                    fullName: res.data.full_name,
                    applied: res.data.applied_count,
                    shortlisted: res.data.shortlisted_count,
                    escrow: res.data.escrow_balance
                });
            })
            .catch(err => console.error("Stats fetch error:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '80vh' }}>
            <Spinner animation="border" variant="warning" />
        </div>
    );

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                {/* 👋 Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Welcome , {stats.fullName}!</h2>
                        <p className="text-muted mb-0">Building India, one job at a time. Here is your daily summary.</p>
                    </div>
                    <Button as={Link} to="/worker/find-jobs" variant="warning" className="rounded-pill px-4 fw-bold mt-3 mt-md-0 shadow-sm">
                        <i className="bi bi-search me-2"></i>Find New Work
                    </Button>
                </div>

                <Row className="g-4">
                    {/* 💰 Premium Escrow Card */}
                    <Col lg={4}>
                        <Card className="shadow-sm border-0 rounded-4 overflow-hidden h-100" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                            <Card.Body className="p-4 text-white">
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div className="bg-warning p-2 rounded-3">
                                        <i className="bi bi-shield-lock-fill text-dark fs-4"></i>
                                    </div>
                                    <Badge bg="success" className="rounded-pill px-3 py-2">SECURE ESCROW</Badge>
                                </div>
                                <h6 className="opacity-75 text-uppercase small fw-bold">Payment Held in Escrow</h6>
                                <h1 className="display-5 fw-bold text-warning mb-2">₹{stats.escrow.toLocaleString()}</h1>
                                <p className="small opacity-50 mb-4">Funds will be released to your wallet once the client confirms completion.</p>
                                <Button as={Link} to="/worker/wallet" variant="outline-warning" className="w-100 rounded-pill fw-bold">
                                    View Wallet History
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 📊 Application Stats Card */}
                    <Col lg={4}>
                        <Card className="shadow-sm border-0 rounded-4 h-100">
                            <Card.Body className="p-4">
                                <h6 className="text-muted text-uppercase small fw-bold mb-4">Application Status</h6>
                                <div className="d-grid gap-3">
                                    <div className="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                                                <i className="bi bi-file-earmark-text text-primary fs-5"></i>
                                            </div>
                                            <span className="fw-bold text-secondary">Applied</span>
                                        </div>
                                        <h4 className="mb-0 fw-bold">{stats.applied + stats.shortlisted}</h4>
                                    </div>

                                    <div className="p-3 bg-light rounded-4 d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-warning bg-opacity-10 p-2 rounded-3 me-3">
                                                <i className="bi bi-star-fill text-warning fs-5"></i>
                                            </div>
                                            <span className="fw-bold text-secondary">Shortlisted</span>
                                        </div>
                                        <h4 className="mb-0 fw-bold">{stats.shortlisted}</h4>
                                    </div>
                                </div>
                                <Button as={Link} to="/worker/my-applications" variant="link" className="w-100 mt-4 text-decoration-none fw-bold text-primary">
                                    Track All Applications <i className="bi bi-arrow-right ms-1"></i>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* ⚡ Quick Actions Card */}
                    <Col lg={4}>
                        <Card className="shadow-sm border-0 rounded-4 h-100 bg-white">
                            <Card.Body className="p-4">
                                <h6 className="text-muted text-uppercase small fw-bold mb-4">Quick Links</h6>
                                <div className="d-grid gap-2">
                                    <Link to="/worker/active-jobs" className="btn btn-outline-dark border-light bg-light py-3 px-3 text-start d-flex justify-content-between align-items-center rounded-4 shadow-hover transition-all">
                                        <span><i className="bi bi-briefcase me-2 text-primary"></i> Active Contracts</span>
                                        <i className="bi bi-chevron-right small"></i>
                                    </Link>
                                    <Link to="/worker/profile" className="btn btn-outline-dark border-light bg-light py-3 px-3 text-start d-flex justify-content-between align-items-center rounded-4 shadow-hover transition-all">
                                        <span><i className="bi bi-person-badge me-2 text-success"></i> Profile & Skills</span>
                                        <i className="bi bi-chevron-right small"></i>
                                    </Link>
                                    <Link to="/worker/kyc" className="btn btn-outline-dark border-light bg-light py-3 px-3 text-start d-flex justify-content-between align-items-center rounded-4 shadow-hover transition-all">
                                        <span><i className="bi bi-patch-check me-2 text-warning"></i> Identity Verification (KYC)</span>
                                        <i className="bi bi-chevron-right small"></i>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .shadow-hover:hover {
                    background-color: #fff !important;
                    border-color: #facc15 !important;
                    transform: translateX(5px);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                .transition-all {
                    transition: all 0.2s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default WorkerDashboardPage;