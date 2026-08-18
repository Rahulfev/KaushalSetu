import React from 'react';
import LoginForm from '../components/LoginForm';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="auth-page-wrapper min-vh-100 d-flex align-items-center justify-content-center p-3" 
         style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)' }}>
      <Container className="bg-white shadow-lg border-0 overflow-hidden" 
                 style={{ maxWidth: '1050px', borderRadius: '40px' }}>
        <Row className="g-0 min-vh-75">
          
          {/* 🖼️ Right Side (Visual Panel): Labor Theme */}
          <Col md={6} className="d-none d-md-block p-3 order-md-2">
            <div className="h-100 w-100 rounded-4 position-relative overflow-hidden shadow-sm" 
                 style={{ 
                   backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   borderRadius: '30px'
                 }}>
              {/* Overlay for Slogans */}
              <div className="position-absolute bottom-0 start-0 p-5 text-white w-100" 
                   style={{ background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.95))' }}>
                <h3 className="fw-bold mb-2 text-warning">श्रम ही शक्ति है</h3>
                <h5 className="fw-bold mb-1 italic">"Building the Nation, One Hand at a Time."</h5>
                <p className="small opacity-75 mb-0">Empowering India's workforce with trust and security.</p>
              </div>
            </div>
          </Col>

          {/* 📝 Left Side: Form */}
          <Col md={6} className="p-5 d-flex flex-column justify-content-center order-md-1">
            <div className="mb-4 text-center text-md-start">
              <h2 className="fw-bold text-dark mb-1">Welcome to KaushalSetu</h2>
              <p className="text-muted small">हमे मेहनती, हम श्रमभिमानी! एकता हमारी शक्ति।</p>
            </div>

            <LoginForm />

            <div className="mt-4 text-center small">
              <span className="text-muted">Don't have an account? </span>
              <Link to="/register" className="text-primary fw-bold text-decoration-none">Register as a Worker or Client</Link>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;