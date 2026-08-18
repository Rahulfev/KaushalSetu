import { useState } from "react";
import { useJobs } from "../hooks/useJobs";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { PhoneCall } from "lucide-react";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  serviceAddress: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  preferredDate: "",
  preferredTime: "",
  additionalNotes: "",
  contactPreference: "PHONE_CALL",
};

// Same list used by the Organization job-post form and the worker's "Filter by District"
// dropdown — keeping this exact so a client's chosen city always matches the worker feed.
const DISTRICTS = ["MUMBAI_CITY", "MUMBAI_SUBURBAN", "THANE", "PALGHAR", "RAIGAD", "PUNE", "SATARA", "SOLAPUR", "KOLHAPUR", "SANGLI", "NASHIK", "AHMEDNAGAR", "DHULE", "JALGAON", "NANDURBAR", "AURANGABAD", "JALNA", "BEED", "OSMANABAD", "LATUR", "NANDED", "PARBHANI", "HINGOLI", "AKOLA", "AMRAVATI", "BULDHANA", "WASHIM", "YAVATMAL", "NAGPUR", "WARDHA", "BHANDARA", "GONDIA", "CHANDRAPUR", "GADCHIROLI", "RATNAGIRI", "SINDHUDURG"];

const formatDistrictLabel = (d) => d.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

const PostJob = () => {
  const { addJob } = useJobs();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addJob(form);
      toast.success("Job posted successfully! Workers can now apply.");
      setForm(emptyForm);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish requirement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          {/* ℹ️ Left Side: Info & Guidelines */}
          <Col lg={4} className="mb-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              <h2 className="fw-bold text-dark mb-3">Hire Skilled Hands</h2>
              <p className="text-muted lh-base mb-4">
                Describe your household service need clearly. Workers will apply with their own estimated price —
                you don't set a budget upfront.
              </p>

              <Card className="border-0 shadow-sm rounded-4 mb-3" style={{ background: '#0f172a', color: '#fff' }}>
                <Card.Body className="p-4">
                  <h6 className="text-warning fw-bold mb-3"><i className="bi bi-shield-check me-2"></i>How it works</h6>
                  <ul className="list-unstyled small opacity-75 d-grid gap-2">
                    <li><i className="bi bi-check2-circle text-warning me-2"></i>Workers apply with their price</li>
                    <li><i className="bi bi-check2-circle text-warning me-2"></i>You compare & assign one</li>
                    <li><i className="bi bi-check2-circle text-warning me-2"></i>Pay securely after work is done</li>
                  </ul>
                </Card.Body>
              </Card>

              <Alert variant="warning" className="border-0 rounded-4 small shadow-sm">
                <i className="bi bi-info-circle-fill me-2"></i>
                <strong>Pro-tip:</strong> A clear address and preferred time helps workers respond faster.
              </Alert>
            </div>
          </Col>

          {/* 📝 Right Side: The Form */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white">
              <Form onSubmit={handleSubmit}>
                <h5 className="fw-bold text-dark mb-4">Service Request Details</h5>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">JOB TITLE *</Form.Label>
                  <Form.Control
                    name="title"
                    placeholder="e.g. Need Expert Plumber for Kitchen renovation"
                    className="py-2 border-light bg-light rounded-3 shadow-none"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">SERVICE CATEGORY *</Form.Label>
                  <Form.Select
                    name="category"
                    className="py-2 border-light bg-light rounded-3 fw-bold shadow-none"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Painting">Painting</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="AC Technician">AC Technician</option>
                    <option value="Housemaid">Housemaid</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">JOB DESCRIPTION *</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    placeholder="Explain the work in detail..."
                    className="py-2 border-light bg-light rounded-3 shadow-none"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">SERVICE ADDRESS *</Form.Label>
                  <Form.Control
                    name="serviceAddress"
                    placeholder="House/Flat no., Street, Area"
                    className="py-2 border-light bg-light rounded-3 shadow-none"
                    value={form.serviceAddress}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted">CITY *</Form.Label>
                      <Form.Select
                        name="city"
                        className="py-2 border-light bg-light rounded-3 fw-bold shadow-none"
                        value={form.city}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select City / District</option>
                        {DISTRICTS.map((d) => (
                          <option key={d} value={formatDistrictLabel(d)}>{formatDistrictLabel(d)}</option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Choosing from this list ensures workers in that district can find your job.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted">STATE *</Form.Label>
                      <Form.Control
                        name="state"
                        className="py-2 border-light bg-light rounded-3 shadow-none"
                        value={form.state}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted">PIN CODE (optional)</Form.Label>
                      <Form.Control
                        name="pincode"
                        maxLength={6}
                        className="py-2 border-light bg-light rounded-3 shadow-none"
                        value={form.pincode}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted">LANDMARK (optional)</Form.Label>
                      <Form.Control
                        name="landmark"
                        placeholder="Near..."
                        className="py-2 border-light bg-light rounded-3 shadow-none"
                        value={form.landmark}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted">PREFERRED SERVICE DATE *</Form.Label>
                      <Form.Control
                        type="date"
                        name="preferredDate"
                        min={new Date().toISOString().split('T')[0]}
                        className="py-2 border-light bg-light rounded-3 shadow-none"
                        value={form.preferredDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-muted">PREFERRED SERVICE TIME *</Form.Label>
                      <Form.Control
                        type="time"
                        name="preferredTime"
                        className="py-2 border-light bg-light rounded-3 shadow-none"
                        value={form.preferredTime}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">ADDITIONAL NOTES (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="additionalNotes"
                    placeholder="Anything else the worker should know..."
                    className="py-2 border-light bg-light rounded-3 shadow-none"
                    value={form.additionalNotes}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* <Form.Group className="mb-5">
                  <Form.Label className="small fw-bold text-muted d-block">CONTACT PREFERENCE</Form.Label>
                  <div className="d-inline-flex align-items-center gap-2 px-3 py-2 bg-light border rounded-pill">
                    <PhoneCall size={16} className="text-success" />
                    <span className="fw-bold small">Phone Call</span>
                  </div>
                </Form.Group> */}

                <Button type="submit" variant="warning" className="w-100 py-3 fw-bold rounded-pill shadow-sm" disabled={submitting}>
                  {submitting ? "Publishing..." : "Publish Requirement"}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PostJob;
