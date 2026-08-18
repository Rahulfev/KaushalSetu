import { useJobs } from "../hooks/useJobs";
import { toast } from "react-toastify";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const MyJobs = () => {
  const { jobs, removeJob, cancelJobAction } = useJobs();

  const handleDelete = async (id, status, title) => {
    if (status !== "OPEN") {
      return toast.error("Only an open posting with no applicants can be deleted. Cancel it instead.");
    }
    if (window.confirm(`Permanently remove posting: ${title}?`)) {
      try {
        await removeJob(id);
        toast.success("Posting removed.");
      } catch (err) {
        toast.error(err.response?.data?.message || "Delete failed.");
      }
    }
  };

  const handleCancel = async (id, title) => {
    if (window.confirm(`Cancel "${title}"? This can't be undone.`)) {
      try {
        await cancelJobAction(id);
        toast.success("Job cancelled.");
      } catch (err) {
        toast.error(err.response?.data?.message || "Cancel failed.");
      }
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'OPEN': return { bg: 'primary-subtle', text: 'text-primary', label: '● ACCEPTING APPLICATIONS' };
      case 'IN_PROGRESS': return { bg: 'warning-subtle', text: 'text-warning', label: '● WORKER ASSIGNED' };
      case 'COMPLETED': return { bg: 'success-subtle', text: 'text-white', label: '● COMPLETED' };
      case 'CANCELLED': return { bg: 'secondary-subtle', text: 'text-secondary', label: '● CANCELLED' };
      case 'EXPIRED': return { bg: 'secondary-subtle', text: 'text-secondary', label: '● EXPIRED' };
      default: return { bg: 'secondary-subtle', text: 'text-secondary', label: status };
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="fw-bold text-dark mb-1">My Posted Jobs</h2>
            <p className="text-muted mb-0">Manage your active requirements and track services statuses.</p>
          </div>
          <Badge bg="dark" className="px-3 py-2 rounded-pill shadow-sm">
            {jobs.length} Requirements Found
          </Badge>
        </div>

        {jobs.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4 text-center p-5">
            <i className="bi bi-folder2-open display-1 text-muted opacity-25"></i>
            <h4 className="text-muted mt-3">No active postings</h4>
            <Button href="/client/post-job" variant="warning" className="mt-3 px-4 fw-bold rounded-pill">Post First Requirement</Button>
          </Card>
        ) : (
          <Row className="g-4">
            {jobs.map(job => {
              const style = getStatusStyles(job.status);
              return (
                <Col xs={12} key={job.jobId}>
                  <Card className="border-0 shadow-sm rounded-4 overflow-hidden card-hover-subtle">
                    <Card.Body className="p-4 p-lg-5">
                      <Row className="align-items-center">
                        <Col lg={8}>
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <Badge className={`${style.bg} ${style.text} px-3 py-2 rounded-pill extra-small fw-bold`}>
                              {style.label}
                            </Badge>
                            <span className="text-muted small"><i className="bi bi-clock me-1"></i> Posted {new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
                          </div>
                          <h4 className="fw-bold text-dark mb-3">{job.title}</h4>
                          <Row className="small text-muted g-3 mb-4">
                            <Col sm={4}><i className="bi bi-tag-fill text-primary me-2"></i><strong>Category:</strong> {job.category}</Col>
                            <Col sm={8}>
                              <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                              <strong>Address:</strong> {job.serviceAddress}, {job.city}, {job.state}{job.pincode ? ` - ${job.pincode}` : ''}
                            </Col>
                            {job.preferredDate && (
                              <Col sm={6}><i className="bi bi-calendar-event text-warning me-2"></i><strong>Preferred:</strong> {job.preferredDate} {job.preferredTime}</Col>
                            )}
                          </Row>
                          <p className="text-secondary mb-0 line-clamp-2">{job.description}</p>
                        </Col>
                        <Col lg={4} className="text-lg-end mt-4 mt-lg-0 d-grid gap-2">
                          {job.status === "OPEN" && (
                            <div className="btn-group shadow-sm rounded-pill overflow-hidden bg-white border">
                              <Button as={Link} to="/client/applications" variant="white" className="border-end px-4 py-2 small fw-bold text-dark">
                                <i className="bi bi-people-fill me-2"></i>View Applicants
                              </Button>
                              <Button variant="white" className="px-4 py-2 small fw-bold text-danger hover-danger-bg" onClick={() => handleDelete(job.jobId, job.status, job.title)}>
                                <i className="bi bi-trash3 me-2"></i>Delete
                              </Button>
                            </div>
                          )}
                          {(job.status === "OPEN" || job.status === "IN_PROGRESS") && (
                            <Button variant="outline-secondary" size="sm" className="rounded-pill fw-bold" onClick={() => handleCancel(job.jobId, job.title)}>
                              Cancel Job
                            </Button>
                          )}
                          {job.status === "IN_PROGRESS" && (
                            <Button as={Link} to="/client/applications" variant="warning" size="sm" className="rounded-pill fw-bold text-dark">
                              Track Progress
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      <style>{`
        .extra-small { font-size: 0.7rem; letter-spacing: 0.5px; }
        .hover-danger-bg:hover { background-color: #dc3545 !important; color: #fff !important; }
        .card-hover-subtle { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover-subtle:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default MyJobs;
