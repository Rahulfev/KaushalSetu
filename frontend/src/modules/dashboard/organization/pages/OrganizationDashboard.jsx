import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrgData } from '../hooks/useOrgData';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const OrganizationDashboard = () => {
    const { orgName } = useOrgData();
    const navigate = useNavigate();

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                {/* 🏢 Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Corporate Command Center</h2>
                        <p className="text-muted mb-0">Operational overview for <strong>{orgName || "Authorized Organization"}</strong></p>
                    </div>
                    <Button 
                        onClick={() => navigate('/organization/payments')} 
                        variant="warning" 
                        className="shadow-sm fw-bold px-4 py-2 rounded-pill mt-3 mt-md-0"
                        style={{ color: '#000' }}
                    >
                        <i className="bi bi-safe2-fill me-2"></i>Fund Project Escrow
                    </Button>
                </div>

                <Row className="g-4">
                    {/* Visual Summary Card 1: Payments (Primary Slate Theme) */}
                    <Col md={4}>
                        <Card 
                            className="border-0 shadow-sm h-100 rounded-4 overflow-hidden text-white" 
                            style={{ background: '#0f172a', cursor: 'pointer' }}
                            onClick={() => navigate('/organization/payments')}
                        >
                            <Card.Body className="p-4">
                                <div className="bg-warning text-dark d-inline-block p-3 rounded-4 mb-4">
                                    <i className="bi bi-shield-lock-fill fs-3"></i>
                                </div>
                                <h4 className="fw-bold mb-2">Escrow Control</h4>
                                <p className="opacity-75 small lh-base mb-4">
                                    Monitor and authorize secure fund deposits for active labor contracts across all projects.
                                </p>
                                <div className="text-warning fw-bold small">
                                    Audit Records <i className="bi bi-arrow-right ms-1"></i>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Visual Summary Card 2: Applications (White/Primary Accent) */}
                    <Col md={4}>
                        <Card 
                            className="border-0 shadow-sm h-100 rounded-4 transition-hover bg-white border-start border-5 border-primary" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/organization/applications')}
                        >
                            <Card.Body className="p-4">
                                <div className="bg-primary bg-opacity-10 text-primary d-inline-block p-3 rounded-4 mb-4">
                                    <i className="bi bi-people-fill fs-3"></i>
                                </div>
                                <h4 className="fw-bold text-dark mb-2">Active Proposals</h4>
                                <p className="text-muted small lh-base mb-4">
                                    Review professional profiles, interview candidates, and shortlist skilled labor for your project requirements.
                                </p>
                                <div className="text-primary fw-bold small">
                                    Manage Talent <i className="bi bi-arrow-right ms-1"></i>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Visual Summary Card 3: Post Job (White/Dark Accent) */}
                    <Col md={4}>
                        <Card 
                            className="border-0 shadow-sm h-100 rounded-4 transition-hover bg-white border-start border-5 border-warning" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/organization/post-job')}
                        >
                            <Card.Body className="p-4">
                                <div className="bg-dark text-white d-inline-block p-3 rounded-4 mb-4">
                                    <i className="bi bi-plus-square-dotted fs-3"></i>
                                </div>
                                <h4 className="fw-bold text-dark mb-2">Publish Requirement</h4>
                                <p className="text-muted small lh-base mb-4">
                                    Broadcast new project specifications to the regional labor pool to attract specialized professionals.
                                </p>
                                <div className="text-dark fw-bold small">
                                    Create Posting <i className="bi bi-arrow-right ms-1"></i>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* 📊 Global Operational Status Footer */}
                <div className="mt-5 p-4 bg-white rounded-4 shadow-sm border d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <Badge bg="success" className="p-2 rounded-circle me-3">
                            <span className="visually-hidden">Online</span>
                        </Badge>
                        <div>
                            <div className="fw-bold text-dark small">System Node: Operational</div>
                            <div className="text-muted extra-small">Last sync with regional registry: Just now</div>
                        </div>
                    </div>
                    <Button variant="light" className="rounded-pill fw-bold small border">
                        <i className="bi bi-download me-2"></i>Report
                    </Button>
                </div>
            </Container>

            <style>{`
                .transition-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .transition-hover:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important; }
                .extra-small { font-size: 0.7rem; }
            `}</style>
        </div>
    );
};

export default OrganizationDashboard;