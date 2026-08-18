import { useEffect, useState } from 'react';
import { Table, Button, Container, Card, Badge, Spinner, InputGroup, Form, Modal, Row, Col, Nav } from 'react-bootstrap';
import { fetchAllKycs, fetchKycDetail, decideKyc } from '../services/kycApi';
import { getAuth } from '@/shared/utils/authUtils';
import { toast } from 'react-toastify';

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const TABS = [
  { key: '', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'APPROVED', label: 'Verified' },
  { key: 'REJECTED', label: 'Rejected' },
];

const STATUS_BADGE = {
  PENDING: 'warning', UNDER_REVIEW: 'info', APPROVED: 'success', REJECTED: 'danger',
};

const KycListPage = () => {
  const { role } = getAuth();
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('');

  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [deciding, setDeciding] = useState(false);

  const loadKycs = async (statusFilter = tab) => {
    try {
      setLoading(true);
      const res = await fetchAllKycs(role, statusFilter);
      setKycs(res.data || []);
    } catch (err) {
      toast.error('Failed to load KYC registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadKycs(tab); }, [tab]);

  const openDetail = async (kycId) => {
    setDetailLoading(true);
    setRemarks('');
    try {
      const res = await fetchKycDetail(role, kycId);
      setDetail(res.data);
    } catch (err) {
      toast.error('Could not load KYC detail');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDecision = async (decision) => {
    if ((decision === 'REJECTED' || decision === 'REUPLOAD_REQUESTED') && !remarks.trim()) {
      toast.error('Please provide a reason / remarks');
      return;
    }
    setDeciding(true);
    try {
      await decideKyc(role, detail.kycId, decision, remarks);
      toast.success(`Marked as ${decision.replace('_', ' ')}`);
      setDetail(null);
      loadKycs(tab);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setDeciding(false);
    }
  };

  const filteredKycs = kycs.filter(k =>
    k.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container fluid style={{ maxWidth: 1200 }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">Identity Verification Registry</h2>
            <p className="text-muted mb-0">Review worker KYC submissions and manage verification status.</p>
          </div>
          <InputGroup className="shadow-sm rounded-3 overflow-hidden" style={{ maxWidth: 350 }}>
            <InputGroup.Text className="bg-white border-end-0"><i className="bi bi-search text-muted"></i></InputGroup.Text>
            <Form.Control
              placeholder="Search by name, email, or doc number..."
              className="border-start-0 ps-0 py-2 shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        <Nav variant="pills" className="mb-4 gap-2" activeKey={tab} onSelect={(k) => setTab(k)}>
          {TABS.map((t) => (
            <Nav.Item key={t.key}>
              <Nav.Link eventKey={t.key} className="rounded-pill px-3 fw-bold small">{t.label}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <Table hover align="middle" className="mb-0">
              <thead className="bg-light">
                <tr className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                  <th className="ps-4 py-3">Worker</th>
                  <th>Document</th>
                  <th>Completion</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" size="sm" /></td></tr>
                ) : filteredKycs.length > 0 ? filteredKycs.map(k => (
                  <tr key={k.kycId} style={{ cursor: 'pointer' }} onClick={() => openDetail(k.kycId)}>
                    {/*<td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        {k.profilePhotoUrl ? (
                          <img src={fileUrl(k.profilePhotoUrl)} alt="" className="rounded-circle me-3" style={{ width: 42, height: 42, objectFit: 'cover' }} />
                        ) : (
                          <div className="rounded-circle bg-secondary bg-opacity-10 text-secondary d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: 42, height: 42 }}>
                            {(k.userName || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="fw-bold text-dark">{k.userName}</div>
                          <div className="text-muted small">{k.email}</div>
                        </div>
                      </div>
                    </td>*/}

                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-secondary bg-opacity-10 text-secondary d-flex align-items-center justify-content-center fw-bold me-3"
                          style={{ width: 42, height: 42 }}
                        >
                          {(k.userName || "U").charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div className="fw-bold text-dark">{k.userName}</div>
                          <div className="text-muted small">{k.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="border px-2 py-1">{k.documentType || '—'}</Badge>
                      <div className="text-muted small mt-1"><code>{k.documentNumber}</code></div>
                    </td>
                    <td>{k.completionPercent}%</td>
                    <td><Badge bg={STATUS_BADGE[k.status] || 'secondary'} className="px-2 py-1">{k.status}</Badge></td>
                    <td className="text-end pe-4">
                      <Button size="sm" variant="outline-dark" className="rounded-pill">Review</Button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">No submissions found.</td></tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      {/* ───────────── DETAIL MODAL ───────────── */}
      <Modal show={!!detail || detailLoading} onHide={() => setDetail(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>KYC Review {detail && `— ${detail.fullName}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading || !detail ? (
            <div className="text-center py-5"><Spinner animation="border" /></div>
          ) : (
            <>
              {/* <Row className="g-3 mb-4">
                {detail.profilePhotoUrl && (
                  <Col xs={3}><img src={fileUrl(detail.profilePhotoUrl)} className="rounded-3 w-100" style={{ aspectRatio: '1', objectFit: 'cover' }} /><div className="small text-muted text-center">Profile</div></Col>
                )}
                {detail.documentFrontUrl && (
                  <Col xs={3}><img src={fileUrl(detail.documentFrontUrl)} className="rounded-3 w-100" style={{ aspectRatio: '1', objectFit: 'cover' }} /><div className="small text-muted text-center">Doc Front</div></Col>
                )}
                {detail.documentBackUrl && (
                  <Col xs={3}><img src={fileUrl(detail.documentBackUrl)} className="rounded-3 w-100" style={{ aspectRatio: '1', objectFit: 'cover' }} /><div className="small text-muted text-center">Doc Back</div></Col>
                )}
              </Row> */}

              <Row className="g-2 small mb-3">
                <Col md={6}><strong>DOB:</strong> {detail.dateOfBirth}</Col>
                <Col md={6}><strong>Gender:</strong> {detail.gender}</Col>
                <Col md={6}><strong>Mobile:</strong> {detail.mobileNumber}</Col>
                <Col md={6}><strong>Email:</strong> {detail.email}</Col>
                <Col md={12}><strong>Address:</strong> {detail.addressLine}, {detail.city}, {detail.state} - {detail.pincode}</Col>
                <Col md={6}><strong>Document:</strong> {detail.documentType} — {detail.documentNumber}</Col>
                <Col md={6}>
                  <strong>Payout:</strong> {detail.payoutMethod === 'UPI'
                    ? detail.upiId
                    : `${detail.bankName} · ${detail.bankAccountHolderName} · ${detail.bankAccountNumber} · ${detail.ifscCode}`}
                </Col>
                <Col md={6}><strong>Completion:</strong> {detail.completionPercent}%</Col>
                <Col md={6}><strong>Current Status:</strong> <Badge bg={STATUS_BADGE[detail.status] || 'secondary'}>{detail.status}</Badge></Col>
              </Row>

              {detail.certificates?.length > 0 && (
                <div className="mb-3">
                  <strong className="small d-block mb-1">Skill Certificates:</strong>
                  <div className="d-flex flex-wrap gap-2">
                    {detail.certificates.map((c) => (
                      <a key={c.certificateId} href={fileUrl(c.fileUrl)} target="_blank" rel="noreferrer" className="badge bg-light text-dark border px-2 py-1 text-decoration-none">
                        {c.certificateName}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted">Remarks / Reason (required for reject or re-upload)</Form.Label>
                <Form.Control as="textarea" rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="e.g. Aadhaar back image is blurry, please re-upload" />
              </Form.Group>

              {detail.auditLog?.length > 0 && (
                <div className="mt-3">
                  <strong className="small d-block mb-2">Audit Trail:</strong>
                  <div className="small text-muted" style={{ maxHeight: 120, overflowY: 'auto' }}>
                    {detail.auditLog.map((a, i) => (
                      <div key={i} className="border-bottom py-1">
                        <strong>{a.action}</strong> by {a.performedBy} — {a.remarks} <span className="text-muted">({new Date(a.createdAt).toLocaleString()})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        {!detailLoading && detail && (
          <Modal.Footer>
            <Button variant="outline-secondary" disabled={deciding} onClick={() => handleDecision('UNDER_REVIEW')}>Mark Under Review</Button>
            <Button variant="outline-warning" disabled={deciding} onClick={() => handleDecision('REUPLOAD_REQUESTED')}>Request Re-upload</Button>
            <Button variant="danger" disabled={deciding} onClick={() => handleDecision('REJECTED')}>Reject</Button>
            <Button variant="success" disabled={deciding} onClick={() => handleDecision('APPROVED')}>Approve</Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default KycListPage;
