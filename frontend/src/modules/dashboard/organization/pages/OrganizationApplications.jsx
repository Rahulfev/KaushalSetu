import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Table, Button, Badge, Spinner } from "react-bootstrap";
import { 
  getOrganizationApplications, 
  updateApplicationStatus 
} from "../services/organizationApplicationService";
import CreateContractModal from "../../../contracts/components/CreateContractModal";
import WorkerDetailsModal from "@/modules/worker-profile/components/WorkerDetailsModal";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, FileText, User, Briefcase, Users, ShieldCheck } from "lucide-react";

const OrganizationApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailsWorkerId, setDetailsWorkerId] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await getOrganizationApplications();
      setApplications(data || []);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      toast.success(`Applicant ${status.toLowerCase()} successfully`);
      loadApplications();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const openContractModal = (app) => {
    if (app.status !== "SHORTLISTED") {
      toast.error("Application must be shortlisted first");
      return;
    }
    setSelectedApp(app);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const config = {
      SHORTLISTED: { bg: "warning", text: "dark", label: "Shortlisted" },
      REJECTED: { bg: "danger", text: "white", label: "Rejected" },
      APPLIED: { bg: "info", text: "white", label: "New Application" },
      CONTRACTED: { bg: "success", text: "white", label: "Contracted" },
    };
    const style = config[status] || { bg: "secondary", text: "white", label: status };
    return (
      <Badge pill bg={style.bg} className={`text-${style.text} px-3 py-2 fw-medium`}>
        {style.label}
      </Badge>
    );
  };

  return (
    <Container className="py-5">
      {/* Header & Stats Section */}
      <div className="mb-5">
        <h2 className="fw-bold text-dark mb-1">Organization Applications</h2>
        <p className="text-muted">Manage workforce acquisitions and legal contracting</p>
      </div>

      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3 text-primary">
                <Users size={24} />
              </div>
              <div>
                <small className="text-muted d-block fw-bold text-uppercase">Total Applicants</small>
                <span className="h4 fw-bold mb-0">{applications.length}</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white text-info">
            <div className="d-flex align-items-center">
              <div className="bg-info bg-opacity-10 p-3 rounded-3 me-3">
                <Briefcase size={24} />
              </div>
              <div>
                <small className="text-muted d-block fw-bold text-uppercase">New Pending</small>
                <span className="h4 fw-bold mb-0">{applications.filter(a => a.status === 'APPLIED').length}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted small">Fetching records...</p>
          </div>
        ) : (
          <Table hover responsive className="mb-0 align-middle">
            <thead className="bg-light text-muted small text-uppercase" style={{ letterSpacing: '0.5px' }}>
              <tr>
                <th className="ps-4 py-3">Reference</th>
                <th className="py-3">Job Details</th>
                <th className="py-3">Worker Info</th>
                <th className="py-3">Current Status</th>
                <th className="text-end pe-4 py-3">Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-5 text-muted">No applications found in system.</td></tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.applicationId} className="transition-all">
                    <td className="ps-4">
                      <span className="text-dark fw-bold small">#APP-{app.applicationId}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{app.jobTitle}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <User size={16} className="text-muted me-2" />
                        <span>{app.workerName || "Anonymous Worker"}</span>
                      </div>
                      {(app.status === "SHORTLISTED" || app.status === "CONTRACTED") && app.workerId && (
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-decoration-none fw-bold d-block"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => setDetailsWorkerId(app.workerId)}
                        >
                          View Worker Details
                        </button>
                      )}
                      {app.status === "CONTRACTED" && app.workerId && (
                        <Link
                          to={`/organization/worker/${app.workerId}/documents`}
                          className="small text-decoration-none fw-bold d-block"
                        >
                          <ShieldCheck size={12} className="me-1" />View KYC
                        </Link>
                      )}
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        {app.status === "SHORTLISTED" && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                            onClick={() => openContractModal(app)}
                          >
                            <FileText size={14} /> Make Contract
                          </Button>
                        )}
                        
                        {(app.status === "APPLIED" || app.status === "SHORTLISTED") && (
                          <>
                            {app.status === "APPLIED" && (
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="rounded-pill px-3 d-flex align-items-center gap-1"
                                onClick={() => handleStatus(app.applicationId, "SHORTLISTED")}
                              >
                                <CheckCircle size={14} /> Shortlist
                              </Button>
                            )}
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="rounded-pill px-3 d-flex align-items-center gap-1"
                              onClick={() => handleStatus(app.applicationId, "REJECTED")}
                            >
                              <XCircle size={14} /> Reject
                            </Button>
                          </>
                        )}
                        {app.status === "REJECTED" && <span className="text-muted small italic pe-2">Archived</span>}
                        {app.status === "CONTRACTED" && <span className="text-success small fw-bold pe-2">Hired</span>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card>

      <CreateContractModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedApp(null);
          loadApplications();
        }}
        application={selectedApp}
      />

      <WorkerDetailsModal
        show={!!detailsWorkerId}
        onHide={() => setDetailsWorkerId(null)}
        workerId={detailsWorkerId}
      />
    </Container>
  );
};

export default OrganizationApplications;