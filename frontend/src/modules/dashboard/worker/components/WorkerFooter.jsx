import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const WorkerFooter = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-auto border-top border-primary">
            <Container>
                <Row>
                    <Col md={6}>
                        <h5 className="fw-bold text-primary">KaushalSetu</h5>
                        <p className="small text-muted mb-0">Bridging trust between skilled workers and local clients.</p>
                    </Col>
                    <Col md={3}>
                        <h6>Quick Links</h6>
                        <ul className="list-unstyled small text-muted">
                            <li>Privacy Policy</li>
                            <li>Terms & Conditions</li>
                        </ul>
                    </Col>
                    <Col md={3}>
                        <h6>Contact</h6>
                        <p className="small text-muted mb-0">Email: support@kaushalsetu.in</p>
                    </Col>
                </Row>
                <div className="text-center small text-muted mt-3">
                    © 2026 KaushalSetu. All rights reserved.
                </div>
            </Container>
        </footer>
    );
};

export default WorkerFooter;