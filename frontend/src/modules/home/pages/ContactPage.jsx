import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';

const ContactPage = () => {
  return (
    <div className="auth-page-wrapper min-vh-100 d-flex align-items-center justify-content-center p-3" 
         style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)' }}>
      <Container className="bg-white shadow-lg border-0 overflow-hidden" 
                 style={{ maxWidth: '1100px', borderRadius: '40px' }}>
        <Row className="g-0">
          
          {/* 🟦 LEFT SIDE: Solid Brand Panel (No Image) */}
          <Col md={6} className="d-none d-md-flex p-5 flex-column justify-content-center text-white"
               style={{ 
                 background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                 minHeight: '600px' 
               }}>
            <div className="p-4">
              <h2 className="fw-bold mb-3 text-warning">हम आपके साथ हैं</h2>
              <h4 className="fw-light mb-4 italic">"Always here to support India's working hands."</h4>
              <p className="opacity-75">
                Have questions about your account, payments, or finding work? 
                Our team is dedicated to ensuring your experience with KaushalSetu is seamless.
              </p>
              <div className="mt-5 pt-4 border-top border-secondary">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-geo-alt-fill me-3 text-warning fs-4"></i>
                  <span>Pune, Maharashtra, India</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-envelope-fill me-3 text-warning fs-4"></i>
                  <span>support@kaushalsetu.in</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-telephone-fill me-3 text-warning fs-4"></i>
                  <span>+91-XXXXXXXXXX</span>
                </div>
              </div>
            </div>
          </Col>

          {/* 📝 RIGHT SIDE: Contact Form */}
          <Col md={6} className="p-5 d-flex flex-column justify-content-center bg-white">
            <div className="mb-4 text-start">
              <h2 className="fw-bold text-dark mb-1">Get in Touch</h2>
              <p className="text-muted small">Fill out the form below and we’ll get back to you within 24 hours.</p>
            </div>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary">Full Name</Form.Label>
                <InputGroup className="bg-light rounded-3 p-1 border">
                  <InputGroup.Text className="bg-transparent border-0"><i className="bi bi-person"></i></InputGroup.Text>
                  <Form.Control className="bg-transparent border-0 py-2" placeholder="Your Name" required />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary">Email Address</Form.Label>
                <InputGroup className="bg-light rounded-3 p-1 border">
                  <InputGroup.Text className="bg-transparent border-0"><i className="bi bi-envelope"></i></InputGroup.Text>
                  <Form.Control type="email" className="bg-transparent border-0 py-2" placeholder="name@email.com" required />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-secondary">Message</Form.Label>
                <InputGroup className="bg-light rounded-3 p-1 border">
                  <Form.Control as="textarea" rows={4} className="bg-transparent border-0 py-2" placeholder="How can we help?" required />
                </InputGroup>
              </Form.Group>

              <Button type="submit" className="w-100 py-3 fw-bold rounded-3 shadow-sm border-0" 
                      style={{ background: '#facc15', color: '#000' }}>
                Send Message
              </Button>
            </Form>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;