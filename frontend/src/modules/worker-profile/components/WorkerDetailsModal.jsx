import { useEffect, useState } from 'react';
import { Modal, Spinner, Badge, Row, Col } from 'react-bootstrap';
import { ShieldCheck, Star, Briefcase, Languages, MapPin, FileText } from 'lucide-react';
import { getWorkerPublicProfile } from '../services/workerPublicProfileApi';

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const KYC_LABEL = {
  NOT_SUBMITTED: 'Not Submitted',
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Verified',
  REJECTED: 'Rejected',
};

/**
 * Read-only worker profile — deliberately shows only public/verified info (photo, name,
 * skills, experience, languages, service areas, bio, completed jobs, rating, certificates).
 * Never shows Aadhaar/PAN numbers, document images, bank/UPI details, or full address —
 * that's admin-only.
 */
const WorkerDetailsModal = ({ show, onHide, workerId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show || !workerId) return;
    setLoading(true);
    setError(null);
    getWorkerPublicProfile(workerId)
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load worker profile'))
      .finally(() => setLoading(false));
  }, [show, workerId]);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Worker Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : error ? (
          <div className="text-center py-4 text-danger">{error}</div>
        ) : profile ? (
          <>
            <div className="d-flex align-items-center gap-3 mb-4">
              {profile.profilePhotoUrl ? (
                <img
                  src={fileUrl(profile.profilePhotoUrl)}
                  alt={profile.fullName}
                  className="rounded-circle"
                  style={{ width: 72, height: 72, objectFit: 'cover' }}
                />
              ) : (
                <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-3" style={{ width: 72, height: 72 }}>
                  {(profile.fullName || 'W').charAt(0)}
                </div>
              )}
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h4 className="fw-bold mb-0">{profile.fullName}</h4>
                  {profile.verified && (
                    <Badge bg="success" className="d-flex align-items-center gap-1 px-2 py-1">
                      <ShieldCheck size={13} /> Verified
                    </Badge>
                  )}
                </div>
                <div className="text-muted small">Worker ID: #{profile.workerId}</div>
                <Badge bg={profile.verified ? 'success' : 'secondary'} text={profile.verified ? undefined : undefined} className="mt-1">
                  KYC: {KYC_LABEL[profile.kycStatus] || profile.kycStatus}
                </Badge>
              </div>
            </div>

            <Row className="g-3 mb-4">
              <Col xs={4}>
                <div className="p-3 bg-light rounded-3 text-center h-100">
                  <Briefcase size={18} className="text-primary mb-1" />
                  <div className="fw-bold">{profile.completedJobs ?? 0}</div>
                  <div className="text-muted small">Completed Jobs</div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="p-3 bg-light rounded-3 text-center h-100">
                  <Star size={18} className="text-warning mb-1" fill="#ffc107" />
                  <div className="fw-bold">{profile.averageRating != null ? profile.averageRating.toFixed(1) : '—'}</div>
                  <div className="text-muted small">Avg Rating</div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="p-3 bg-light rounded-3 text-center h-100">
                  <div className="fw-bold fs-5 mt-1">{profile.totalReviews ?? 0}</div>
                  <div className="text-muted small">Total Reviews</div>
                </div>
              </Col>
            </Row>

            {profile.profileDescription && (
              <p className="text-muted mb-4">{profile.profileDescription}</p>
            )}

            <Row className="g-3 mb-4">
              <Col md={6}>
                <div className="small text-muted fw-bold text-uppercase mb-1">Skills</div>
                <div>{profile.skills || '—'}</div>
              </Col>
              <Col md={6}>
                <div className="small text-muted fw-bold text-uppercase mb-1">Experience</div>
                <div>{profile.experienceYears != null ? `${profile.experienceYears} years` : '—'}</div>
              </Col>
              <Col md={6}>
                <div className="small text-muted fw-bold text-uppercase mb-1 d-flex align-items-center gap-1">
                  <Languages size={13} /> Languages Known
                </div>
                <div>{profile.languagesKnown || '—'}</div>
              </Col>
              <Col md={6}>
                <div className="small text-muted fw-bold text-uppercase mb-1 d-flex align-items-center gap-1">
                  <MapPin size={13} /> Service Areas
                </div>
                <div>{profile.serviceAreas || '—'}</div>
              </Col>
            </Row>

            {profile.certificates?.length > 0 && (
              <div>
                <div className="small text-muted fw-bold text-uppercase mb-2">Skill Certificates</div>
                <div className="d-flex flex-wrap gap-2">
                  {profile.certificates.map((c, i) => (
                    <a key={i} href={fileUrl(c.fileUrl)} target="_blank" rel="noreferrer"
                       className="badge bg-light text-dark border px-3 py-2 text-decoration-none d-flex align-items-center gap-1">
                      <FileText size={14} /> {c.certificateName}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default WorkerDetailsModal;
