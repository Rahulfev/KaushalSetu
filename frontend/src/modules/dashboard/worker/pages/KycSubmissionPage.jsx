import { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Badge, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  submitKycApi,
  getMyKycStatusApi,
  uploadCertificateApi,
} from '../services/kycApi';
import {
  Clock,
  XCircle,
  AlertTriangle,
  Upload,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  FileText,
} from 'lucide-react';

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
const fileUrl = (path) => (path ? `${API_ORIGIN}${path}` : null);

const DOC_TYPES = [
  { value: 'AADHAAR', label: 'Aadhaar Card', needsBack: true },
  { value: 'PAN', label: 'PAN Card', needsBack: false },
  { value: 'DRIVING_LICENSE', label: 'Driving License', needsBack: true },
  { value: 'PASSPORT', label: 'Passport', needsBack: false },
  { value: 'VOTER_ID', label: 'Voter ID', needsBack: true },
];

const STATUS_META = {
  NOT_SUBMITTED: { label: 'Not Submitted', bg: 'secondary', icon: <FileText size={16} /> },
  PENDING: { label: 'Pending', bg: 'warning', text: 'dark', icon: <Clock size={16} /> },
  UNDER_REVIEW: { label: 'Under Review', bg: 'info', icon: <Clock size={16} /> },
  APPROVED: { label: 'Verified', bg: 'success', icon: <CheckCircle2 size={16} /> },
  REJECTED: { label: 'Rejected', bg: 'danger', icon: <XCircle size={16} /> },
};

const emptyForm = {
  fullName: '', dateOfBirth: '', gender: '', mobileNumber: '', email: '',
  addressLine: '', city: '', state: '', pincode: '',
  documentType: '', documentNumber: '',
  payoutMethod: '', upiId: '', bankAccountHolderName: '', bankName: '', bankAccountNumber: '', ifscCode: '',
};

const KycSubmissionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // full my-status response
  const [editing, setEditing] = useState(false);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  //const [files, setFiles] = useState({ profilePhoto: null, documentFront: null, documentBack: null });
  const [submitting, setSubmitting] = useState(false);

  const [certName, setCertName] = useState('');
  const [certFile, setCertFile] = useState(null);
  const [uploadingCert, setUploadingCert] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyKycStatusApi();
      setStatus(res.data);
    } catch {
      toast.error('Could not load your KYC status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startForm = () => {
    if (status && status.overallStatus === 'REJECTED') {
      // prefill from previous submission so the worker only fixes what's wrong
      setForm({
        fullName: status.fullName || '', dateOfBirth: status.dateOfBirth || '', gender: status.gender || '',
        mobileNumber: status.mobileNumber || '', email: status.email || '',
        addressLine: status.addressLine || '', city: status.city || '', state: status.state || '', pincode: status.pincode || '',
        documentType: status.documentType || '', documentNumber: status.documentNumber || '',
        payoutMethod: status.payoutMethod || '', upiId: status.upiId || '',
        bankAccountHolderName: status.bankAccountHolderName || '', bankName: status.bankName || '',
        bankAccountNumber: '', ifscCode: status.ifscCode || '',
      });
    }
    setEditing(true);
    setStep(1);
  };

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const selectedDoc = DOC_TYPES.find((d) => d.value === form.documentType);

  const validateStep = (s) => {
    if (s === 1) {
      if (!form.fullName || !form.dateOfBirth || !form.gender || !form.email) {
        toast.error('Please fill in all personal details'); return false;
      }
      if (!/^[6-9][0-9]{9}$/.test(form.mobileNumber)) { toast.error('Enter a valid 10-digit mobile number'); return false; }
     // if (!files.profilePhoto && !status?.profilePhotoUrl) { toast.error('Upload a profile photo'); return false; }
      if (!form.addressLine || !form.city || !form.state || !/^[1-9][0-9]{5}$/.test(form.pincode)) {
        toast.error('Please enter a complete, valid address'); return false;
      }
      return true;
    }
    if (s === 2) {
      if (!form.documentType || !form.documentNumber) { toast.error('Select a document type and enter its number'); return false; }
      // if (!files.documentFront && !status?.documentFrontUrl) { toast.error('Upload the front image of your document'); return false; }
      // if (selectedDoc?.needsBack && !files.documentBack && !status?.documentBackUrl) {
      //   toast.error(`${selectedDoc.label} requires a back image too`); return false;
      // }
      return true;
    }
    if (s === 3) {
      if (!form.payoutMethod) { toast.error('Select a payout method'); return false; }
      if (form.payoutMethod === 'UPI' && !form.upiId) { toast.error('Enter your UPI ID'); return false; }
      if (form.payoutMethod === 'BANK_ACCOUNT' &&
          (!form.bankAccountHolderName || !form.bankName || !form.bankAccountNumber || !form.ifscCode)) {
        toast.error('Complete all bank account fields'); return false;
      }
      return true;
    }
    return true;
  };

  const next = () => { if (validateStep(step)) setStep((s) => Math.min(s + 1, 4)); };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitKycApi(form);
      toast.success("KYC submitted! It's now pending review.");
      setEditing(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadCert = async () => {
    if (!certFile || !certName) { toast.error('Enter a name and choose a file'); return; }
    setUploadingCert(true);
    try {
      await uploadCertificateApi(certName, certFile);
      toast.success('Certificate uploaded');
      setCertName(''); setCertFile(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingCert(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  const meta = STATUS_META[status?.overallStatus] || STATUS_META.NOT_SUBMITTED;

  // ───────────────────────── STATUS DASHBOARD (default view) ─────────────────────────
  if (!editing) {
    return (
      <Container className="py-5" style={{ maxWidth: 900 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Identity Verification (KYC)</h2>
            <p className="text-muted mb-0">Complete verification to apply for jobs and receive payments.</p>
          </div>
          <Button variant="link" onClick={() => navigate(-1)} className="text-muted text-decoration-none">
            <ArrowLeft size={16} className="me-1" /> Back
          </Button>
        </div>

        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Badge bg={meta.bg} text={meta.text} className="px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ width: 'fit-content' }}>
                {meta.icon} {meta.label}
              </Badge>
              {status?.kycId && <span className="text-muted small">Reference #KYC-{status.kycId}</span>}
            </div>

            {status?.kycId && (
              <>
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Profile completion</span>
                  <span>{status.completionPercent}%</span>
                </div>
                <ProgressBar now={status.completionPercent} variant="warning" className="mb-4" style={{ height: 8 }} />
              </>
            )}

            {status?.overallStatus === 'REJECTED' && status?.rejectionReason && (
              <Alert variant="danger" className="d-flex align-items-start gap-2">
                <AlertTriangle size={18} className="mt-1 flex-shrink-0" />
                <div><strong>Reason:</strong> {status.rejectionReason}</div>
              </Alert>
            )}

            {status?.overallStatus === 'PENDING' && (
              <Alert variant="warning">Your documents are submitted and awaiting review. This usually takes 24–48 hours.</Alert>
            )}
            {status?.overallStatus === 'UNDER_REVIEW' && (
              <Alert variant="info">An admin is currently reviewing your submission.</Alert>
            )}
            {status?.overallStatus === 'APPROVED' && (
              <Alert variant="success">
                🎉 You're verified! You can now apply for jobs, accept contracts, and withdraw earnings.
              </Alert>
            )}

            {/* {status?.kycId && (
              <Row className="g-3 mb-3">
                {status.profilePhotoUrl && (
                  <Col xs={4} md={3}>
                    <img src={fileUrl(status.profilePhotoUrl)} alt="Profile" className="rounded-3 w-100" style={{ aspectRatio: '1', objectFit: 'cover' }} />
                    <div className="text-muted small text-center mt-1">Profile</div>
                  </Col>
                )}
                {status.documentFrontUrl && (
                  <Col xs={4} md={3}>
                    <img src={fileUrl(status.documentFrontUrl)} alt="Document front" className="rounded-3 w-100" style={{ aspectRatio: '1', objectFit: 'cover' }} />
                    <div className="text-muted small text-center mt-1">{status.documentType} (front)</div>
                  </Col>
                )}
                {status.documentBackUrl && (
                  <Col xs={4} md={3}>
                    <img src={fileUrl(status.documentBackUrl)} alt="Document back" className="rounded-3 w-100" style={{ aspectRatio: '1', objectFit: 'cover' }} />
                    <div className="text-muted small text-center mt-1">{status.documentType} (back)</div>
                  </Col>
                )}
              </Row>
            )} */}

            {(status?.overallStatus === 'NOT_SUBMITTED' || status?.overallStatus === 'REJECTED') && (
              <Button variant="dark" className="rounded-pill px-4 fw-bold" onClick={startForm}>
                {status?.overallStatus === 'REJECTED' ? 'Fix & Resubmit KYC' : 'Start KYC Verification'}
              </Button>
            )}
          </Card.Body>
        </Card>

        {/* Optional skill certificates */}
        {/* <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-1">Skill Certificates (optional)</h5>
            <p className="text-muted small mb-3">ITI, Electrician License, Plumbing/Welding Certificate, Resume, etc. — boosts your credibility to clients.</p>

            <Row className="g-2 mb-3">
              <Col md={5}>
                <Form.Control placeholder="Certificate name (e.g. ITI Electrician)" value={certName} onChange={(e) => setCertName(e.target.value)} />
              </Col>
              <Col md={5}>
                <Form.Control type="file" accept="image/*,.pdf" onChange={(e) => setCertFile(e.target.files[0])} />
              </Col>
              <Col md={2}>
                <Button variant="outline-dark" className="w-100" disabled={uploadingCert} onClick={handleUploadCert}>
                  {uploadingCert ? <Spinner size="sm" /> : <Upload size={16} />}
                </Button>
              </Col>
            </Row>

            {status?.certificates?.length > 0 && (
              <div className="d-flex flex-wrap gap-2">
                {status.certificates.map((c) => (
                  <a key={c.certificateId} href={fileUrl(c.fileUrl)} target="_blank" rel="noreferrer"
                     className="badge bg-light text-dark border px-3 py-2 text-decoration-none">
                    <FileText size={14} className="me-1" /> {c.certificateName}
                  </a>
                ))}
              </div>
            )}
          </Card.Body>
        </Card> */}
      </Container>
    );
  }

  // ───────────────────────── MULTI-STEP FORM (4 steps) ─────────────────────────
  const steps = ['Personal', 'Identity Document', 'Payment Details', 'Review'];

  return (
    <Container className="py-5" style={{ maxWidth: 800 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">KYC Verification</h2>
        <Button variant="link" className="text-muted text-decoration-none" onClick={() => setEditing(false)}>Cancel</Button>
      </div>

      <div className="d-flex justify-content-between mb-4">
        {steps.map((s, i) => (
          <div key={s} className={`text-center flex-fill small fw-bold ${i + 1 === step ? 'text-dark' : 'text-muted'}`}>
            <div className={`rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center ${i + 1 <= step ? 'bg-dark text-white' : 'bg-light text-muted'}`} style={{ width: 32, height: 32 }}>
              {i + 1 < step ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            {s}
          </div>
        ))}
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4 p-lg-5">
          {step === 1 && (
            <>
              <h5 className="fw-bold mb-4">Personal Details</h5>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Label className="small fw-bold text-muted">Full Name *</Form.Label>
                  <Form.Control value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
                </Col>
                <Col md={3}>
                  <Form.Label className="small fw-bold text-muted">Date of Birth *</Form.Label>
                  <Form.Control type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
                </Col>
                <Col md={3}>
                  <Form.Label className="small fw-bold text-muted">Gender *</Form.Label>
                  <Form.Select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Label className="small fw-bold text-muted">Mobile Number *</Form.Label>
                  <Form.Control
                    value={form.mobileNumber}
                    onChange={(e) => update('mobileNumber', e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label className="small fw-bold text-muted">Email *</Form.Label>
                  <Form.Control type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                </Col>
                {/* <Col md={6}>
                  <Form.Label className="small fw-bold text-muted">Profile Photo *</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setFiles((f) => ({ ...f, profilePhoto: e.target.files[0] }))} />
                </Col> */}
              </Row>

              <hr />
              <h6 className="fw-bold mb-3">Address</h6>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Label className="small fw-bold text-muted">Address Line *</Form.Label>
                  <Form.Control value={form.addressLine} onChange={(e) => update('addressLine', e.target.value)} />
                </Col>
                <Col md={4}>
                  <Form.Label className="small fw-bold text-muted">City *</Form.Label>
                  <Form.Control value={form.city} onChange={(e) => update('city', e.target.value)} />
                </Col>
                <Col md={4}>
                  <Form.Label className="small fw-bold text-muted">State *</Form.Label>
                  <Form.Control value={form.state} onChange={(e) => update('state', e.target.value)} />
                </Col>
                <Col md={4}>
                  <Form.Label className="small fw-bold text-muted">PIN Code *</Form.Label>
                  <Form.Control value={form.pincode} onChange={(e) => update('pincode', e.target.value)} />
                </Col>
              </Row>
            </>
          )}

          {step === 2 && (
            <>
              <h5 className="fw-bold mb-4">Identity Document</h5>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Label className="small fw-bold text-muted">Document Type *</Form.Label>
                  <Form.Select value={form.documentType} onChange={(e) => update('documentType', e.target.value)}>
                    <option value="">Select document type</option>
                    {DOC_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Label className="small fw-bold text-muted">Document Number *</Form.Label>
                  <Form.Control value={form.documentNumber} onChange={(e) => update('documentNumber', e.target.value.toUpperCase())} />
                </Col>
                {/* <Col md={6}>
                  <Form.Label className="small fw-bold text-muted">Front Image *</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => setFiles((f) => ({ ...f, documentFront: e.target.files[0] }))} />
                </Col>
                {selectedDoc?.needsBack && (
                  <Col md={6}>
                    <Form.Label className="small fw-bold text-muted">Back Image *</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(e) => setFiles((f) => ({ ...f, documentBack: e.target.files[0] }))} />
                  </Col>
                )} */}
              </Row>
            </>
          )}

          {step === 3 && (
            <>
              <h5 className="fw-bold mb-4">Payment / Payout Details</h5>
              <Form.Label className="small fw-bold text-muted d-block mb-2">Payout Method *</Form.Label>
              <div className="d-flex gap-3 mb-4">
                <Form.Check
                  type="radio" name="payoutMethod" label="UPI" id="payout-upi"
                  checked={form.payoutMethod === 'UPI'} onChange={() => update('payoutMethod', 'UPI')}
                />
                <Form.Check
                  type="radio" name="payoutMethod" label="Bank Account" id="payout-bank"
                  checked={form.payoutMethod === 'BANK_ACCOUNT'} onChange={() => update('payoutMethod', 'BANK_ACCOUNT')}
                />
              </div>

              {form.payoutMethod === 'UPI' && (
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">UPI ID *</Form.Label>
                  <Form.Control placeholder="yourname@bank" value={form.upiId} onChange={(e) => update('upiId', e.target.value)} />
                </Form.Group>
              )}

              {form.payoutMethod === 'BANK_ACCOUNT' && (
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="small fw-bold text-muted">Account Holder Name *</Form.Label>
                    <Form.Control value={form.bankAccountHolderName} onChange={(e) => update('bankAccountHolderName', e.target.value)} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small fw-bold text-muted">Bank Name *</Form.Label>
                    <Form.Control value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small fw-bold text-muted">Account Number *</Form.Label>
                    <Form.Control value={form.bankAccountNumber} onChange={(e) => update('bankAccountNumber', e.target.value)} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small fw-bold text-muted">IFSC Code *</Form.Label>
                    <Form.Control value={form.ifscCode} onChange={(e) => update('ifscCode', e.target.value.toUpperCase())} />
                  </Col>
                </Row>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h5 className="fw-bold mb-4">Review & Submit</h5>
              <Alert variant="light" className="border">
                <Row className="g-2 small">
                  <Col md={6}><strong>Name:</strong> {form.fullName}</Col>
                  <Col md={6}><strong>Mobile:</strong> {form.mobileNumber}</Col>
                  <Col md={6}><strong>Document:</strong> {selectedDoc?.label} — {form.documentNumber}</Col>
                  <Col md={6}><strong>Payout:</strong> {form.payoutMethod === 'UPI' ? form.upiId : `${form.bankName} ••••${form.bankAccountNumber.slice(-4)}`}</Col>
                  <Col md={12}><strong>Address:</strong> {form.addressLine}, {form.city}, {form.state} - {form.pincode}</Col>
                </Row>
              </Alert>
              <p className="text-muted small">By submitting, you confirm all details are accurate. False information may lead to permanent rejection.</p>
            </>
          )}

          <div className="d-flex justify-content-between mt-5">
            <Button variant="light" onClick={back} disabled={step === 1}>
              <ArrowLeft size={16} className="me-1" /> Back
            </Button>
            {step < 4 ? (
              <Button variant="dark" className="rounded-pill px-4 fw-bold" onClick={next}>
                Next <ArrowRight size={16} className="ms-1" />
              </Button>
            ) : (
              <Button variant="warning" className="rounded-pill px-4 fw-bold text-dark" disabled={submitting} onClick={handleSubmit}>
                {submitting ? <Spinner size="sm" /> : 'Submit for Verification'}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default KycSubmissionPage;
