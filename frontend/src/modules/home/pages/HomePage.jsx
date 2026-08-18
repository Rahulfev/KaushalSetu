import React from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const services = [
    { title: 'Construction & Labor', img: 'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'bi-hammer' },
    { title: 'Expert Cleaning', img: 'https://images.pexels.com/photos/4098524/pexels-photo-4098524.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'bi-stars' },
    { title: 'Professional Plumbing', img: 'https://images.pexels.com/photos/2310904/pexels-photo-2310904.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'bi-droplet-fill' },
    { title: 'Electrician', img: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800', icon: 'bi-lightning-fill' }
  ];

  return (
    <div className="homepage-wrapper">
      {/* 🚀 HERO SECTION: Light Background for Contrast with Dark Navbar */}
      <section className="py-5" style={{ background: '#f8fafc', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <Container>
          <Row className="align-items-center gy-5">
            <Col lg={7} className="text-center text-lg-start">
              <Badge pill bg="dark" className="mb-3 px-3 py-2 text-warning">Verified Skills</Badge>
              <h1 className="display-3 fw-bold text-dark mb-3">
                श्रम ही शक्ति है: <br />
                <span className="text-primary">Trusted Labor</span> Connect
              </h1>
              <p className="fs-5 mb-4 text-muted lh-lg">
                Bridging the gap between skilled workers and local clients. Find verified plumbers, cleaners, and construction labor today.
              </p>
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <Button as={Link} to="/register" className="btn-lg px-5 py-3 border-0 fw-bold shadow" style={{ background: '#facc15', color: '#000' }}>
                  Register as Worker
                </Button>
                <Button as={Link} to="/login" variant="outline-dark" className="btn-lg px-5 py-3 fw-bold">
                  Hire a Pro
                </Button>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              {/* Forced Height Image Container */}
              <div style={{ height: '400px', borderRadius: '30px', overflow: 'hidden' }} className="shadow-lg border border-5 border-white">
                <img 
                  src="https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Construction Worker" 
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 🛠️ SERVICE GRID: High Contrast White Background */}
      <section className="py-5 bg-white">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Skilled Specialists</h2>
            <div className="bg-warning mx-auto mt-2" style={{ height: '5px', width: '60px', borderRadius: '10px' }}></div>
          </div>
          
          <Row className="g-4">
            {services.map((service, index) => (
              <Col key={index} xs={12} sm={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '25px' }}>
                  <div style={{ height: '250px', position: 'relative' }}>
                    {/* ✅ Image with Forced Visibility Settings */}
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      className="w-100 h-100" 
                      style={{ objectFit: 'cover', display: 'block' }} 
                      onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Service+Image'; }}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                       <span className="text-white fw-bold"><i className={`bi ${service.icon} text-warning me-2`}></i>{service.title}</span>
                    </div>
                  </div>
                  <Card.Body className="p-4">
                    <p className="small text-muted mb-3">Verified experts available for immediate hire in your district.</p>
                    <Button as={Link} to="/login" variant="outline-dark" className="w-100 rounded-pill py-2 small fw-bold">Hire Now</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;