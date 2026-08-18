import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <div className="auth-page-wrapper min-vh-100 d-flex align-items-center justify-content-center p-3" 
         style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)' }}>
      <Container className="bg-white shadow-lg border-0 overflow-hidden" 
                 style={{ maxWidth: '1100px', borderRadius: '40px' }}>
        <Row className="g-0">
          
          {/* 🟦 LEFT SIDE: Brand Identity Panel */}
          <Col md={5} className="d-none d-md-flex p-5 flex-column justify-content-center text-white text-center"
               style={{ 
                 background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                 minHeight: '600px' 
               }}>
            <div className="p-4">
              <h1 className="fw-bold mb-3 text-warning">श्रम ही शक्ति है</h1>
              <div className="bg-warning mx-auto mb-4" style={{ height: '4px', width: '60px', borderRadius: '2px' }}></div>
              <p className="fs-5 opacity-75 italic mb-0">
                "Empowering the hands that build our nation."
              </p>
            </div>
          </Col>

          {/* 📝 RIGHT SIDE: Mission & Values */}
          <Col md={7} className="p-5 d-flex flex-column justify-content-center bg-white">
            <div className="mb-4">
              <h2 className="fw-bold text-dark mb-1">About KaushalSetu</h2>
              <p className="text-primary fw-bold small">Our Journey & Mission</p>
            </div>

            <div className="pe-md-4">
              <p className="text-muted mb-4" style={{ lineHeight: '1.7' }}>
                KaushalSetu is a digital platform designed to bring <strong>trust, 
                transparency, and accountability</strong> to the unorganized labor sector. 
                We connect skilled blue-collar workers with local clients through 
                verified profiles and secure contracts.
              </p>

              <div className="mb-4 p-3 bg-light rounded-4 border-start border-warning border-4">
                <h6 className="fw-bold mb-2">Our Mission</h6>
                <p className="text-muted small mb-0">
                  To empower workers by helping them build a digital identity, access 
                  consistent work opportunities, and receive fair payments without 
                  delays or disputes.
                </p>
              </div>

              <p className="text-muted mb-0" style={{ lineHeight: '1.7' }}>
                For clients and organizations, KaushalSetu ensures reliable hiring 
                through district-based matching and <strong>escrow-backed payments</strong> that 
                protect both parties.
              </p>
            </div>

            <div className="mt-5 d-flex gap-4 text-center">
              <div>
                <h4 className="fw-bold text-dark mb-0">100%</h4>
                <small className="text-muted">Verified</small>
              </div>
              <div className="border-start ps-4">
                <h4 className="fw-bold text-dark mb-0">Secure</h4>
                <small className="text-muted">Escrow</small>
              </div>
              <div className="border-start ps-4">
                <h4 className="fw-bold text-dark mb-0">24/7</h4>
                <small className="text-muted">Support</small>
              </div>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;