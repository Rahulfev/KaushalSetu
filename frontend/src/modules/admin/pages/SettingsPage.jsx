import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import useSettings from '../hooks/useSettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const { 
    profile, setProfile, handleProfileUpdate,
    system, handleSystemToggle,
    policies, updatePolicy, savePolicies,
    templates, updateTemplate, saveTemplates,
    loading 
  } = useSettings();

  if (loading) return (
    <div className="p-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <Spinner animation="border" variant="warning" className="mb-2" />
      <div className="fw-bold text-muted">Loading Configuration...</div>
    </div>
  );

  const menuItems = [
    { id: 'profile', icon: 'person-fill', label: 'Profile & Security' },
    { id: 'policy', icon: 'file-earmark-text-fill', label: 'Policy & Rules' },
    { id: 'notifications', icon: 'bell-fill', label: 'Email Templates' },
    { id: 'system', icon: 'gear-fill', label: 'System Toggles' }
  ];

  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        <div className="d-flex align-items-center mb-4">
          <div className="bg-dark p-2 rounded-3 me-3">
            <i className="bi bi-sliders text-warning fs-4"></i>
          </div>
          <div>
            <h2 className="fw-bold text-dark mb-0">Configuration Center</h2>
            <p className="text-muted small mb-0">Manage global platform rules and administrative controls.</p>
          </div>
        </div>

        <Row className="g-4">
          {/* 🟦 LEFT SIDEBAR MENU */}
          {/* <Col md={3}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: '100px', zIndex: 10 }}>
              <ListGroup variant="flush">
                {menuItems.map(item => (
                  <ListGroup.Item 
                    key={item.id}
                    action
                    className={`border-0 py-3 ps-4 d-flex align-items-center ${activeTab === item.id ? 'active-admin-tab' : 'text-secondary'}`}
                    onClick={() => setActiveTab(item.id)}
                    style={activeTab === item.id ? { backgroundColor: '#0f172a', color: '#facc15', borderLeft: '4px solid #facc15' } : {}}
                  >
                    <i className={`bi bi-${item.icon} me-3 fs-5`}></i> 
                    <span className="fw-bold small">{item.label}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col> */}

          {/* 📝 RIGHT CONTENT AREA */}
          <Col md={9}>
            <Card className="border-0 shadow-sm p-4 p-lg-5 rounded-4">
              
              {/* --- TAB 1: PROFILE --- */}
              {activeTab === 'profile' && (
                <Form onSubmit={handleProfileUpdate}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold text-dark m-0">Admin Profile</h5>
                    <Badge pill bg="warning" text="dark">Administrator Access</Badge>
                  </div>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Label className="small fw-bold text-muted">Full Name</Form.Label>
                      <Form.Control type="text" className="py-2" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold text-muted">Email Address</Form.Label>
                      <Form.Control type="email" className="bg-light py-2" value={profile.email} disabled />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold text-muted">Phone Number</Form.Label>
                      <Form.Control type="text" className="py-2" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                    </Col>
                  </Row>
                  <Button variant="dark" type="submit" className="px-5 py-2 fw-bold rounded-pill">Save Profile Changes</Button>
                  
                  <hr className="my-5 opacity-50" />
                  
                  <h5 className="fw-bold text-dark mb-4 text-danger">Security & Password</h5>
                  <Row className="g-3 align-items-end">
                    <Col md={4}><Form.Control type="password" placeholder="Current Password" /></Col>
                    <Col md={4}><Form.Control type="password" placeholder="New Password" /></Col>
                    <Col md={4}><Button variant="danger" className="w-100 fw-bold rounded-pill">Update Password</Button></Col>
                  </Row>
                </Form>
              )}

              {/* --- TAB 2: POLICY --- */}
              {/* {activeTab === 'policy' && (
                <div>
                  <h5 className="fw-bold text-dark mb-4">Platform Business Rules</h5>
                  <Row className="g-4 mb-4">
                    <Col md={6}>
                      <Form.Label className="small fw-bold">Dispute Resolution Window (Hours)</Form.Label>
                      <Form.Control type="number" value={policies.disputeTimeout} onChange={(e) => updatePolicy('disputeTimeout', e.target.value)} />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold">Platform Commission Rate</Form.Label>
                      <InputGroup>
                        <Form.Control type="number" value={policies.commissionRate} onChange={(e) => updatePolicy('commissionRate', e.target.value)} />
                        <InputGroup.Text className="bg-dark text-white">%</InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold">Worker Max Concurrent Jobs</Form.Label>
                      <Form.Control type="number" value={policies.maxJobsPerWorker} onChange={(e) => updatePolicy('maxJobsPerWorker', e.target.value)} />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold">Refund Policy Enforcement</Form.Label>
                      <Form.Select value={policies.refundPolicy} onChange={(e) => updatePolicy('refundPolicy', e.target.value)}>
                        <option>Standard (Admin Review)</option>
                        <option>Automatic (Under ₹500)</option>
                        <option>Strict (No Refunds)</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Button variant="success" onClick={savePolicies} className="px-5 py-2 fw-bold rounded-pill shadow-sm">
                    Apply Global Policies
                  </Button>
                </div>
              )} */}

              {/* --- TAB 3: NOTIFICATIONS --- */}
              {activeTab === 'notifications' && (
                <div>
                  <h5 className="fw-bold text-dark mb-4">Communication Templates</h5>
                  <div className="mb-4">
                    <Form.Label className="small fw-bold text-primary">Welcome Email Template</Form.Label>
                    <Form.Control as="textarea" rows={4} value={templates.welcomeEmail} onChange={(e) => updateTemplate('welcomeEmail', e.target.value)} />
                  </div>
                  <div className="mb-4">
                    <Form.Label className="small fw-bold text-primary">New Job Alert Notification</Form.Label>
                    <Form.Control as="textarea" rows={4} value={templates.jobAlert} onChange={(e) => updateTemplate('jobAlert', e.target.value)} />
                  </div>
                  <Button variant="primary" onClick={saveTemplates} className="px-5 py-2 fw-bold rounded-pill">Update Templates</Button>
                </div>
              )}

              {/* --- TAB 4: SYSTEM TOGGLES --- */}
              {activeTab === 'system' && (
                <div>
                  <h5 className="fw-bold text-dark mb-4">Master System Controls</h5>
                  <ListGroup className="rounded-4 overflow-hidden border">
                    {[
                      { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Prevents all non-admin users from accessing the platform.', icon: 'tools' },
                      { key: 'allowNewRegistrations', label: 'Allow Signups', desc: 'Enable or disable the registration of new workers and clients.', icon: 'person-plus' },
                      { key: 'enableEscrow', label: 'Secure Escrow', desc: 'Toggle the escrow payment protection system.', icon: 'safe' },
                      { key: 'emailNotifications', label: 'Global Mail Dispatch', desc: 'Disable all outgoing system emails instantly.', icon: 'send' }
                    ].map(toggle => (
                      <ListGroup.Item key={toggle.key} className="d-flex justify-content-between align-items-center py-4 border-bottom">
                        <div className="d-flex align-items-start">
                          <div className="bg-light p-2 rounded-3 me-3"><i className={`bi bi-${toggle.icon} text-dark`}></i></div>
                          <div>
                            <h6 className="mb-1 fw-bold">{toggle.label}</h6>
                            <p className="small text-muted mb-0">{toggle.desc}</p>
                          </div>
                        </div>
                        <Form.Check 
                          type="switch"
                          className="fs-4"
                          checked={system[toggle.key]}
                          onChange={() => handleSystemToggle(toggle.key)}
                        />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Alert variant="warning" className="mt-4 border-0 rounded-4 p-3 bg-warning bg-opacity-10">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-octagon-fill fs-4 me-3"></i>
                      <span className="small fw-bold">Critical: Any changes to Master Toggles will be pushed to all live sessions immediately.</span>
                    </div>
                  </Alert>
                </div>
              )}

            </Card>
          </Col>
        </Row>
      </Container>
      <style>{`
        .active-admin-tab { color: #facc15 !important; background: #0f172a !important; }
        .form-control:focus, .form-select:focus { border-color: #facc15; box-shadow: 0 0 0 0.25rem rgba(250, 204, 21, 0.25); }
      `}</style>
    </div>
  );
};

// Simple Badge helper
const Badge = ({ children, pill, bg, text, className }) => (
  <span className={`badge ${pill ? 'rounded-pill' : ''} bg-${bg} text-${text} ${className}`}>{children}</span>
);

export default SettingsPage;