import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { workerApi } from '../services/workerDashboardApi';

const WorkerSkillsPage = () => {
    // ✅ Reverted to snake_case to match your JdbcTemplate data.get() calls
    const [skills, setSkills] = useState({
        skill_set: '',
        experience_years: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchCurrentSkills = async () => {
            try {
                const res = await workerApi.getProfile();
                // Map database columns to local state
                setSkills({
                    skill_set: res.data.skill_set || '',
                    experience_years: res.data.experience_years || ''
                });
            } catch (err) { console.error("Load failed:", err); }
        };
        fetchCurrentSkills();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // ✅ Sends JSON with keys { skill_set, experience_years }
            await workerApi.updateProfile(skills);
            setMessage({ type: 'success', text: 'Skills updated successfully!' });
        } catch (err) {
            setMessage({ type: 'danger', text: 'Update failed. Check if columns exist in MySQL.' });
        } finally { setLoading(false); }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-sm border-0 p-4">
                        <h3 className="fw-bold mb-4">Professional Skills</h3>
                        {message.text && <Alert variant={message.type}>{message.text}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-semibold">Primary Skill Set</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={skills.skill_set}
                                    onChange={(e) => setSkills({ ...skills, skill_set: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Experience (Years)</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    value={skills.experience_years}
                                    onChange={(e) => setSkills({ ...skills, experience_years: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <div className="d-grid">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? <Spinner size="sm" /> : 'Save Changes'}
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default WorkerSkillsPage;