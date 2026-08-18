import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner, Nav } from "react-bootstrap";
import { getClientApplications, assignApplication, rejectApplication } from "../services/clientApplicationService";
import { createPayNowOrder, verifyPayNowPayment } from "../services/clientPaymentApi";
import { toast } from "react-toastify";
import { Star, IndianRupee, Clock, CheckCircle, XCircle, MessageSquare, ShieldCheck, CreditCard } from "lucide-react";
import ReviewModal from "@/modules/reviews/components/ReviewModal";
import WorkerDetailsModal from "@/modules/worker-profile/components/WorkerDetailsModal";

const STATUS_META = {
  APPLIED: { label: "New", bg: "info" },
  ASSIGNED: { label: "Assigned", bg: "warning", text: "dark" },
  ONGOING: { label: "Ongoing", bg: "primary" },
  COMPLETED: { label: "Completed", bg: "success" },
  PAID: { label: "Paid", bg: "dark" },
  CLOSED: { label: "Closed", bg: "secondary" },
  REJECTED: { label: "Rejected", bg: "danger" },
};

const ClientApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [jobFilter, setJobFilter] = useState("all");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [detailsWorkerId, setDetailsWorkerId] = useState(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getClientApplications();
      setApplications(data || []);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApplications(); }, []);

  const handleAssign = async (app) => {
    if (!window.confirm(`Assign ${app.workerName} to "${app.jobTitle}"? All other applicants for this job will be rejected.`)) return;
    setBusyId(app.applicationId);
    try {
      await assignApplication(app.applicationId);
      toast.success(`${app.workerName} assigned!`);
      loadApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not assign worker");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (app) => {
    setBusyId(app.applicationId);
    try {
      await rejectApplication(app.applicationId);
      toast.success("Application rejected");
      loadApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not reject application");
    } finally {
      setBusyId(null);
    }
  };

  const handlePayNow = async (app) => {
    setBusyId(app.applicationId);
    try {
      const { data } = await createPayNowOrder(app.applicationId, app.estimatedBudget);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: app.estimatedBudget * 100,
        currency: "INR",
        name: "KaushalSetu",
        description: `Payment for "${app.jobTitle}"`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await verifyPayNowPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Funds added to worker's wallet.");
            loadApplications();
          } catch (err) {
            toast.error("Payment captured but verification failed. Refreshing...");
            loadApplications();
          } finally {
            setBusyId(null);
          }
        },
        modal: { ondismiss: () => setBusyId(null) },
        theme: { color: "#0d6efd" },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setBusyId(null);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not start payment");
      setBusyId(null);
    }
  };

  const jobTitles = ["all", ...new Set(applications.map(a => a.jobTitle))];
  const filtered = jobFilter === "all" ? applications : applications.filter(a => a.jobTitle === jobFilter);

  // Sort so open (APPLIED) candidates surface first for easy comparison, grouped by job.
  const sorted = [...filtered].sort((a, b) => (a.jobTitle > b.jobTitle ? 1 : -1));

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Worker Applications</h2>
            <p className="text-muted mb-0">Compare candidates by price, experience & rating, then assign one.</p>
          </div>
          <div className="p-3 bg-white shadow-sm rounded-4 border text-center" style={{ minWidth: 110 }}>
            <small className="text-muted d-block fw-bold text-uppercase">Total</small>
            <span className="h4 fw-bold mb-0 text-primary">{applications.length}</span>
          </div>
        </div>

        {jobTitles.length > 2 && (
          <Nav variant="pills" className="mb-4 gap-2" activeKey={jobFilter} onSelect={setJobFilter}>
            {jobTitles.map(t => (
              <Nav.Item key={t}>
                <Nav.Link eventKey={t} className="rounded-pill px-3 fw-bold small">{t === "all" ? "All Jobs" : t}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        )}

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
        ) : sorted.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
            <p className="text-muted mb-0">No applications yet.</p>
          </Card>
        ) : (
          <Row className="g-4">
            {sorted.map((app) => {
              const meta = STATUS_META[app.status] || { label: app.status, bg: "secondary" };
              const busy = busyId === app.applicationId;

              return (
                <Col md={6} lg={4} key={app.applicationId}>
                  <Card className="border-0 shadow-sm rounded-4 h-100">
                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Badge bg="light" text="dark" className="border px-2 py-1 small">{app.jobTitle}</Badge>
                        <Badge bg={meta.bg} text={meta.text}>{meta.label}</Badge>
                      </div>

                      <div className="d-flex align-items-center mb-3">
                        {app.workerProfilePhotoUrl ? (
                          <img src={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '')}${app.workerProfilePhotoUrl}`}
                               alt="" className="rounded-circle me-3" style={{ width: 48, height: 48, objectFit: 'cover' }} />
                        ) : (
                          <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: 48, height: 48 }}>
                            {(app.workerName || "W").charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="fw-bold text-dark">{app.workerName}</div>
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            {app.workerRating != null && (
                              <span className="d-flex align-items-center gap-1"><Star size={12} className="text-warning" fill="#ffc107" /> {app.workerRating.toFixed(1)}</span>
                            )}
                            {app.workerExperienceYears != null && <span>{app.workerExperienceYears} yrs exp</span>}
                          </div>
                          <button
                            type="button"
                            className="btn btn-link btn-sm p-0 mt-1 text-decoration-none fw-bold"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => setDetailsWorkerId(app.workerId)}
                          >
                            View Worker Details
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-light rounded-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small fw-bold">ESTIMATED BUDGET</span>
                          <span className="h5 fw-bold text-success mb-0 d-flex align-items-center">
                            <IndianRupee size={16} />{app.estimatedBudget}
                          </span>
                        </div>
                        {app.coverMessage && (
                          <div className="small text-muted d-flex gap-2">
                            <MessageSquare size={14} className="flex-shrink-0 mt-1" />
                            <span>{app.coverMessage}</span>
                          </div>
                        )}
                        {(app.expectedStartTime || app.expectedCompletionTime) && (
                          <div className="small text-muted d-flex gap-2 mt-2">
                            <Clock size={14} className="flex-shrink-0 mt-1" />
                            <span>
                              {app.expectedStartTime && `Starts: ${app.expectedStartTime}`}
                              {app.expectedStartTime && app.expectedCompletionTime && " · "}
                              {app.expectedCompletionTime && `Done by: ${app.expectedCompletionTime}`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        {app.status === "APPLIED" && (
                          <div className="d-flex gap-2">
                            <Button variant="success" className="flex-grow-1 rounded-pill fw-bold" disabled={busy} onClick={() => handleAssign(app)}>
                              <CheckCircle size={16} className="me-1" /> Assign
                            </Button>
                            <Button variant="outline-danger" className="rounded-pill fw-bold" disabled={busy} onClick={() => handleReject(app)}>
                              <XCircle size={16} />
                            </Button>
                          </div>
                        )}
                        {app.status === "ASSIGNED" && (
                          <div className="text-center py-2 bg-warning bg-opacity-10 rounded-pill text-warning fw-bold small border border-warning border-opacity-25">
                            Waiting for worker to start
                          </div>
                        )}
                        {app.status === "ONGOING" && (
                          <div className="text-center py-2 bg-primary bg-opacity-10 rounded-pill text-primary fw-bold small border border-primary border-opacity-25 d-flex align-items-center justify-content-center gap-1">
                            <ShieldCheck size={14} /> Work in progress
                          </div>
                        )}
                        {app.status === "COMPLETED" && (
                          <Button variant="dark" className="w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2" disabled={busy} onClick={() => handlePayNow(app)}>
                            <CreditCard size={16} /> {busy ? "Processing..." : `Pay ₹${app.estimatedBudget} Now`}
                          </Button>
                        )}
                        {app.status === "PAID" && (
                          <Button variant="outline-dark" className="w-100 rounded-pill fw-bold" onClick={() => setReviewTarget({ applicationId: app.applicationId, revieweeName: app.workerName })}>
                            Rate & Review
                          </Button>
                        )}
                        {app.status === "CLOSED" && (
                          <div className="text-center py-2 bg-secondary bg-opacity-10 rounded-pill text-secondary fw-bold small">
                            ✔ Job Closed
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {reviewTarget && (
          <ReviewModal
            show={!!reviewTarget}
            onHide={() => setReviewTarget(null)}
            applicationId={reviewTarget.applicationId}
            revieweeName={reviewTarget.revieweeName}
            onSubmitted={loadApplications}
          />
        )}

        <WorkerDetailsModal
          show={!!detailsWorkerId}
          onHide={() => setDetailsWorkerId(null)}
          workerId={detailsWorkerId}
        />
      </Container>
    </div>
  );
};

export default ClientApplications;
