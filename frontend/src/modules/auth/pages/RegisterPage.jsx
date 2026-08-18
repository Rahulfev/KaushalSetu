import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="auth-page-wrapper min-vh-100 d-flex align-items-center justify-content-center p-3" 
         style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)' }}>
      <Container className="bg-white shadow-lg border-0 overflow-hidden" 
                 style={{ maxWidth: '1100px', borderRadius: '40px' }}>
        <Row className="g-0">
          
          {/* 🖼️ LEFT SIDE: Visual Panel */}
          <Col md={6} className="d-none d-md-block p-3">
            <div className="h-100 w-100 rounded-4 position-relative overflow-hidden shadow-sm" 
                 style={{ 
                   // ✅ Use a reliable Unsplash ID for labor/construction
                   backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   minHeight: '600px', // ✅ Added min-height to ensure visibility
                   borderRadius: '30px'
                 }}>
              
              {/* Overlay with Slogans */}
              <div className="position-absolute bottom-0 start-0 p-5 text-white w-100" 
                   style={{ background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.95))' }}>
                <h3 className="fw-bold mb-2 text-warning">श्रम ही शक्ति है</h3>
                <h5 className="fw-bold mb-1 italic">"Join the community that builds the future."</h5>
                <p className="small opacity-75 mb-0">Secure payments and verified jobs for every skilled hand.</p>
              </div>
            </div>
          </Col>

          {/* 📝 RIGHT SIDE: Register Form */}
          <Col md={6} className="p-5 d-flex flex-column justify-content-center bg-white">
            <div className="mb-4 text-start">
              <h2 className="fw-bold text-dark mb-1">Create Your Account</h2>
              <p className="text-muted small">एकता हमारी शक्ति! Join India's most trusted worker platform.</p>
            </div>

            <RegisterForm />

            <div className="mt-4 text-center small">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign In</Link>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;