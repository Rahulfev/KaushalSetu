import { useEffect, useState } from "react";
import { useClientProfile } from "../hooks/useClientProfile";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Badge, Spinner } from "react-bootstrap";

const ClientProfile = () => {
  const { profile, loading, saveProfile, deleteAccount } = useClientProfile();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    district: "",
    address: ""
  });

  // Full list of districts matching your backend Enum
  const districts = ["MUMBAI_CITY", "MUMBAI_SUBURBAN", "THANE", "PALGHAR", "RAIGAD", "PUNE", "SATARA", "SOLAPUR", "KOLHAPUR", "SANGLI", "NASHIK", "AHMEDNAGAR", "DHULE", "JALGAON", "NANDURBAR", "AURANGABAD", "JALNA", "BEED", "OSMANABAD", "LATUR", "NANDED", "PARBHANI", "HINGOLI", "AKOLA", "AMRAVATI", "BULDHANA", "WASHIM", "YAVATMAL", "NAGPUR", "WARDHA", "BHANDARA", "GONDIA", "CHANDRAPUR", "GADCHIROLI", "RATNAGIRI", "SINDHUDURG"];

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        mobile: profile.mobile || "",
        district: profile.district || "",
        address: profile.address || ""
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveProfile(form);
      toast.success("Professional identity updated.");
    } catch (err) {
      toast.error("Failed to sync profile changes.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("CRITICAL: Are you sure? This will block your access to the KaushalSetu platform permanently.")) return;
    try {
      await deleteAccount();
      toast.success("Account marked for deactivation.");
      navigate("/login");
    } catch (err) {
      toast.error("Deactivation request failed.");
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
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* --- HEADER DOSSIER --- */}
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4">
              <div className="p-4 p-md-5 text-white" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <Row className="align-items-center text-center text-md-start">
                  <Col md={2} className="mb-3 mb-md-0">
                    <div className="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center fw-bold shadow-lg" style={{ width: '90px', height: '90px', fontSize: '2.2rem' }}>
                      {form.name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                  </Col>
                  <Col md={7}>
                    <h2 className="fw-bold mb-1">{form.name || "Client Name"}</h2>
                    <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2 align-items-center mt-2">
                      <Badge bg={profile?.kycVerified ? "success" : "warning"} className="px-3 py-2 rounded-pill text-uppercase extra-small">
                        <i className={`bi ${profile?.kycVerified ? 'bi-patch-check-fill' : 'bi-clock-history'} me-2`}></i>
                        {profile?.kycVerified ? "Verified Client" : "KYC Pending"}
                      </Badge>
                      <span className="small text-white-50"><i className="bi bi-envelope-fill me-2"></i>{profile?.email || "Email Hidden"}</span>
                    </div>
                  </Col>
                  <Col md={3} className="text-md-end mt-3 mt-md-0">
                    <Button variant="outline-danger" size="sm" className="fw-bold rounded-pill px-3 border-2" onClick={handleDelete}>
                      Deactivate Account
                    </Button>
                  </Col>
                </Row>
              </div>

              <Card.Body className="p-4 p-lg-5 bg-white">
                <Form onSubmit={handleSubmit}>
                  <Row className="gy-4">
                    {/* --- Personal Information --- */}
                    <Col md={6}>
                      <h6 className="text-muted fw-bold text-uppercase mb-4 small"><i className="bi bi-person-fill me-2 text-primary"></i>Personal Identity</h6>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted">FULL NAME</Form.Label>
                        <Form.Control 
                          name="name" 
                          className="py-2 border-light bg-light rounded-3 shadow-none"
                          value={form.name}
                          onChange={handleChange} 
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted">MOBILE NUMBER</Form.Label>
                        <Form.Control 
                          name="mobile" 
                          className="py-2 border-light bg-light rounded-3 shadow-none"
                          value={form.mobile}
                          onChange={handleChange} 
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* --- Location Details --- */}
                    <Col md={6} className="ps-md-5 border-start-md">
                      <h6 className="text-muted fw-bold text-uppercase mb-4 small"><i className="bi bi-geo-alt-fill me-2 text-primary"></i>Location Presence</h6>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted">PRIMARY DISTRICT</Form.Label>
                        <Form.Select 
                          name="district" 
                          className="py-2 border-light bg-light rounded-3 shadow-none fw-bold"
                          value={form.district}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select District</option>
                          {districts.map(d => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-muted">FULL OFFICE/SITE ADDRESS</Form.Label>
                        <Form.Control 
                          as="textarea"
                          rows={2}
                          name="address" 
                          className="py-2 border-light bg-light rounded-3 shadow-none"
                          value={form.address}
                          onChange={handleChange} 
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-center mt-5 pt-4 border-top">
                    <Button type="submit" variant="warning" className="px-5 py-2 fw-bold rounded-pill shadow-sm border-0" style={{ color: '#000' }}>
                      Save Profile Changes
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .extra-small { font-size: 0.7rem; letter-spacing: 0.5px; }
        .form-control:focus, .form-select:focus { border-color: #facc15 !important; }
        @media (min-width: 768px) { .border-start-md { border-left: 1px solid #f1f5f9 !important; } }
      `}</style>
    </div>
  );
};

export default ClientProfile;