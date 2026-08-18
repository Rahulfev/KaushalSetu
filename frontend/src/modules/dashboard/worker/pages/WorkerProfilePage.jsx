import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Alert, ListGroup, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { workerApi } from '../services/workerDashboardApi';

const WorkerProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const districts = ["MUMBAI_CITY", "MUMBAI_SUBURBAN", "THANE", "PALGHAR", "RAIGAD", "PUNE", "SATARA", "SOLAPUR", "KOLHAPUR", "SANGLI", "NASHIK", "AHMEDNAGAR", "DHULE", "JALGAON", "NANDURBAR", "AURANGABAD", "JALNA", "BEED", "OSMANABAD", "LATUR", "NANDED", "PARBHANI", "HINGOLI", "AKOLA", "AMRAVATI", "BULDHANA", "WASHIM", "YAVATMAL", "NAGPUR", "WARDHA", "BHANDARA", "GONDIA", "CHANDRAPUR", "GADCHIROLI", "RATNAGIRI", "SINDHUDURG"];
    const jobCategories = ["PLUMBING", "ELECTRICAL", "CONSTRUCTION", "CARPENTRY", "CLEANING", "PAINTING", "GARDENING", "LABOR", "OTHER"];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await workerApi.getProfile();
            setProfile(res.data);
            setFormData(res.data);
        } catch (err) {
            setError("Worker details not found in the professional registry.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await workerApi.updateProfile(formData);
            setProfile(formData);
            setIsEditing(false);
            toast.success("Professional profile synchronized successfully!");
        } catch (err) {
            toast.error("Sync failed. Check backend connectivity.");
        }
    };

    const handleDeactivate = async () => {
        if (window.confirm("Soft Delete: This will deactivate your account. Proceed?")) {
            try {
                await workerApi.deactivateAccount();
                toast.success("Account deactivated. Signing you out...");
                localStorage.clear();
                window.location.href = "/login";
            } catch (err) {
                toast.error("Deactivation failed.");
            }
        }
    };

    if (loading) return (
        <div className="text-center py-5 vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
            <Spinner animation="border" variant="warning" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted fw-bold">Verifying Credentials...</p>
        </div>
    );

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                {error && (
                    <Alert variant="warning" className="mb-4 shadow-sm border-0 rounded-4">
                        <i className="bi bi-exclamation-circle-fill me-2"></i>
                        {error} <strong>Update your profile below to complete registration.</strong>
                    </Alert>
                )}

                <Row className="justify-content-center">
                    <Col lg={11}>
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                            {/* --- HEADER: Night Slate Gradient --- */}
                            <div className="p-4 p-md-5 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                                <Row className="align-items-center">
                                    <Col md={8} className="d-flex align-items-center mb-3 mb-md-0">
                                        <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-lg me-4" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                            {profile?.full_name?.charAt(0) || "W"}
                                        </div>
                                        <div>
                                            <h2 className="fw-bold mb-1">{profile?.full_name || "New Professional"}</h2>
                                            <div className="d-flex gap-2 align-items-center">
                                                <Badge bg={profile ? "success" : "warning"} className="px-3 py-2 rounded-pill">
                                                    {profile ? "VERIFIED PARTNER" : "REGISTRATION INCOMPLETE"}
                                                </Badge>
                                                <span className="small text-white-50"><i className="bi bi-geo-alt-fill me-1 text-danger"></i>{profile?.district?.replace('_', ' ') || "Location Pending"}</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={4} className="text-md-end">
                                        <Button 
                                            variant={isEditing ? "outline-light" : "warning"} 
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="fw-bold px-4 py-2 rounded-pill shadow-sm"
                                            style={!isEditing ? { color: '#000' } : {}}
                                        >
                                            {isEditing ? "Cancel Edit" : <><i className="bi bi-pencil-square me-2"></i>Edit Profile</>}
                                        </Button>
                                    </Col>
                                </Row>
                            </div>

                            <Card.Body className="p-4 p-lg-5 bg-white">
                                <Form onSubmit={handleUpdate}>
                                    <Row className="gy-4">
                                        {/* --- Left Side: Account Info --- */}
                                        <Col lg={5}>
                                            <h6 className="text-muted fw-bold text-uppercase mb-4 small"><i className="bi bi-person-lines-fill me-2 text-primary"></i>Account Security</h6>
                                            <div className="bg-light p-4 rounded-4 border border-light shadow-sm">
                                                <div className="mb-4">
                                                    <label className="text-muted extra-small d-block mb-1 fw-bold">REGISTERED EMAIL</label>
                                                    <span className="fw-bold text-dark fs-5">{profile?.email || "N/A"}</span>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="text-muted extra-small d-block mb-1 fw-bold">CONTACT NUMBER</label>
                                                    <span className="fw-bold text-dark fs-5">{profile?.phone || "N/A"}</span>
                                                </div>
                                                <div className="pt-3 border-top">
                                                    <p className="small text-muted mb-3">Changes to primary identity fields require supervisor approval.</p>
                                                    <Button variant="outline-danger" size="sm" className="fw-bold rounded-pill px-3" onClick={handleDeactivate}>
                                                        Deactivate Profile
                                                    </Button>
                                                </div>
                                            </div>
                                        </Col>

                                        {/* --- Right Side: Professional Data --- */}
                                        <Col lg={7} className="ps-lg-5 border-start-lg">
                                            <h6 className="text-muted fw-bold text-uppercase mb-4 small"><i className="bi bi-briefcase-fill me-2 text-primary"></i>Professional Record</h6>
                                            
                                            <Row className="g-4">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small text-muted fw-bold uppercase-label">Primary Skillset</Form.Label>
                                                        {isEditing ? (
                                                            <Form.Select 
                                                                className="rounded-3 py-2 border-primary focus-shadow"
                                                                value={formData.category} 
                                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                            >
                                                                <option value="">Select Skill...</option>
                                                                {jobCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                                            </Form.Select>
                                                        ) : (
                                                            <div className="bg-light p-2 px-3 rounded-3 fw-bold text-dark border">{profile?.category || "Not Defined"}</div>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="small text-muted fw-bold uppercase-label">Experience (Years)</Form.Label>
                                                        <Form.Control 
                                                            type="number" 
                                                            className={isEditing ? "rounded-3 py-2 border-primary" : "bg-light p-2 px-3 rounded-3 fw-bold border"}
                                                            readOnly={!isEditing}
                                                            value={formData.experience_years}
                                                            onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Group>
                                                        <Form.Label className="small text-muted fw-bold uppercase-label">Work District</Form.Label>
                                                        {isEditing ? (
                                                            <Form.Select 
                                                                className="rounded-3 py-2 border-primary"
                                                                value={formData.district} 
                                                                onChange={(e) => setFormData({...formData, district: e.target.value})}
                                                            >
                                                                <option value="">Select District...</option>
                                                                {districts.map(d => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
                                                            </Form.Select>
                                                        ) : (
                                                            <div className="bg-light p-2 px-3 rounded-3 fw-bold text-dark border">
                                                                <i className="bi bi-map me-2 text-primary"></i>
                                                                {profile?.district?.replace('_', ' ') || "Not Set"}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            {/* --- Real KYC Verification Link (replaces old fake progress mockup) --- */}
                                            <div className="mt-5 p-4 bg-light rounded-4 border-dashed d-flex justify-content-between align-items-center flex-wrap gap-3">
                                                <div>
                                                    <span className="small fw-bold text-muted d-block mb-1">IDENTITY VERIFICATION</span>
                                                    <span className="extra-small text-muted">
                                                        Submit your Aadhar or PAN so clients can trust who they're hiring.
                                                    </span>
                                                </div>
                                                <Button as={Link} to="/worker/kyc" variant="dark" className="rounded-pill px-4 fw-bold">
                                                    Go to KYC <i className="bi bi-arrow-right ms-1"></i>
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>

                                    {isEditing && (
                                        <div className="text-end mt-5 pt-4 border-top">
                                            <Button type="submit" variant="success" className="px-5 py-2 fw-bold rounded-pill shadow">
                                                Sync Professional Record
                                            </Button>
                                        </div>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style>{`
                .extra-small { font-size: 0.75rem; letter-spacing: 0.5px; }
                .uppercase-label { letter-spacing: 0.5px; text-transform: uppercase; }
                .focus-shadow:focus { box-shadow: 0 0 0 0.25rem rgba(250, 204, 21, 0.2); }
                .border-dashed { border: 2px dashed #e2e8f0; }
                @media (min-width: 992px) { .border-start-lg { border-left: 1px solid #eee !important; } }
            `}</style>
        </div>
    );
};

export default WorkerProfilePage;