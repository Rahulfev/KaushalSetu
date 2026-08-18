import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import {
  getMyContractsApi,
  acceptContractApi,
  rejectContractApi,
  submitWorkApi,
  approveWorkApi,
} from '../services/contractApi';
import axiosInstance from '@/services/axiosInstance';
import { getAuth } from '@/shared/utils/authUtils';
import {
  FileCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Briefcase,
  Signature,
  XCircle,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import ReviewModal from '@/modules/reviews/components/ReviewModal';

const STATUS_STYLE = {
  PENDING_ACCEPTANCE: { bg: 'warning', text: 'dark', icon: <Clock size={14} className="me-1" />, label: 'Awaiting Worker' },
  ACCEPTED: { bg: 'info', text: 'white', icon: <FileCheck size={14} className="me-1" />, label: 'Funding Escrow' },
  ACTIVE: { bg: 'success', text: 'white', icon: <CheckCircle size={14} className="me-1" />, label: 'Work In Progress' },
  WORK_SUBMITTED: { bg: 'primary', text: 'white', icon: <ShieldCheck size={14} className="me-1" />, label: 'Awaiting Approval' },
  COMPLETED: { bg: 'dark', text: 'white', icon: <CheckCircle size={14} className="me-1" />, label: 'Completed' },
  REJECTED: { bg: 'danger', text: 'white', icon: <XCircle size={14} className="me-1" />, label: 'Rejected' },
  CANCELLED: { bg: 'secondary', text: 'white', icon: <AlertCircle size={14} className="me-1" />, label: 'Cancelled' },
};

const ContractsPage = () => {
  const { role } = getAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null); // { contractId, revieweeName }

  const loadContracts = async () => {
    try {
      setLoading(true);
      const res = await getMyContractsApi();
      setContracts(res.data || []);
    } catch (err) {
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const run = async (id, action, successMsg) => {
    setBusyId(id);
    try {
      await action();
      toast.success(successMsg);
      await loadContracts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  // CLIENT ONLY: pay the worker directly via Razorpay once work is submitted.
  const payViaRazorpay = async (contract) => {
    setBusyId(contract.contractId);
    try {
      const { data } = await axiosInstance.post('/payments/create-order', {
        amount: contract.agreedAmount,
        contractId: contract.contractId,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: contract.agreedAmount * 100,
        currency: 'INR',
        name: 'KaushalSetu',
        description: `Payment for Contract #${contract.contractId}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await axiosInstance.post('/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Funds added to worker wallet.');
            await loadContracts();
          } catch (err) {
            toast.error('Payment captured but verification failed. Refreshing...');
            await loadContracts();
          } finally {
            setBusyId(null);
          }
        },
        modal: { ondismiss: () => setBusyId(null) },
        theme: { color: '#0d6efd' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setBusyId(null);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start payment');
      setBusyId(null);
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark mb-1">Contract Management</h2>
          <p className="text-muted">Review, accept, and track your professional engagements</p>
        </div>
        <div className="bg-white px-4 py-3 rounded-4 shadow-sm border d-flex align-items-center">
          <span className="text-muted small fw-bold text-uppercase me-3">Total Contracts</span>
          <span className="h4 fw-bold text-primary mb-0">{contracts.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Retrieving contract records...</p>
        </div>
      ) : contracts.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-4 p-5 text-center">
          <FileCheck size={48} className="text-muted mb-3 mx-auto" />
          <h5 className="text-muted">No contracts found in your dashboard</h5>
        </Card>
      ) : (
        <Row className="g-4">
          {contracts.map((c) => {
            const style = STATUS_STYLE[c.status] || { bg: 'secondary', text: 'white', icon: null, label: c.status };
            const isWorker = role === 'WORKER';
            const isOrgOrClient = role === 'ORGANIZATION' || role === 'CLIENT';
            const busy = busyId === c.contractId;

            return (
              <Col md={6} key={c.contractId}>
                <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden hover-up transition-all">
                  <Card.Header className="bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h5 className="fw-bold text-dark mb-0">{c.jobTitle}</h5>
                        <small className="text-muted">ID: #CON-{c.contractId}</small>
                      </div>
                    </div>
                    <Badge bg={style.bg} text={style.text} className="px-3 py-2 rounded-pill d-flex align-items-center">
                      {style.icon} {style.label}
                    </Badge>
                  </Card.Header>

                  <Card.Body className="px-4 pb-4">
                    <Row className="mt-3 mb-4 g-3">
                      <Col xs={6}>
                        <div className="p-3 bg-light rounded-3">
                          <small className="text-muted d-block mb-1">Agreement Value</small>
                          <span className="fw-bold text-dark h5 mb-0 d-flex align-items-center">
                            <IndianRupee size={16} className="me-1" /> {c.agreedAmount}
                          </span>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="p-3 bg-light rounded-3 h-100">
                          <small className="text-muted d-block mb-1">
                            {isWorker ? 'Client / Organization' : 'Worker'}
                          </small>
                          <span className="text-dark small fw-semibold">
                            {isWorker ? c.clientName : c.workerName}
                          </span>
                        </div>
                      </Col>
                    </Row>

                    {/* ACTION HUB */}
                    <div className="d-grid gap-2">
                      {/* WORKER: accept / reject a freshly generated contract */}
                      {isWorker && c.status === 'PENDING_ACCEPTANCE' && (
                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            className="rounded-pill py-2 fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                            disabled={busy}
                            onClick={() => run(c.contractId, () => acceptContractApi(c.contractId), 'Contract accepted!')}
                          >
                            <Signature size={18} /> Accept
                          </Button>
                          <Button
                            variant="outline-danger"
                            className="rounded-pill py-2 fw-bold"
                            disabled={busy}
                            onClick={() => run(c.contractId, () => rejectContractApi(c.contractId), 'Contract rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}

                      {/* WORKER: waiting on org to fund escrow */}
                      {isWorker && c.status === 'ACCEPTED' && (
                        <div className="text-center py-2 bg-info bg-opacity-10 rounded-pill text-info fw-bold small border border-info border-opacity-25">
                          Waiting for the organization to fund escrow
                        </div>
                      )}

                      {/* WORKER: mark work as completed */}
                      {isWorker && c.status === 'ACTIVE' && (
                        <Button
                          variant="primary"
                          className="rounded-pill py-2 fw-bold"
                          disabled={busy}
                          onClick={() => run(c.contractId, () => submitWorkApi(c.contractId), 'Marked as completed — awaiting approval/payment')}
                        >
                          Mark Work as Completed
                        </Button>
                      )}

                      {isWorker && c.status === 'WORK_SUBMITTED' && (
                        <div className="text-center py-2 bg-primary bg-opacity-10 rounded-pill text-primary fw-bold small border border-primary border-opacity-25">
                          Submitted — awaiting approval / payment
                        </div>
                      )}

                      {/* ORGANIZATION: needs to fund escrow before work can start */}
                      {role === 'ORGANIZATION' && c.status === 'ACCEPTED' && (
                        <Button as={Link} to="/organization/payments" variant="warning" className="rounded-pill py-2 fw-bold text-dark d-flex align-items-center justify-content-center gap-2">
                          <ShieldCheck size={18} /> Fund Escrow to Activate
                        </Button>
                      )}

                      {isOrgOrClient && c.status === 'ACTIVE' && (
                        <div className="text-center py-2 bg-success bg-opacity-10 rounded-pill text-success fw-bold small border border-success border-opacity-25">
                          Work currently in progress
                        </div>
                      )}

                      {/* ORGANIZATION: approve submitted work -> releases escrow */}
                      {role === 'ORGANIZATION' && c.status === 'WORK_SUBMITTED' && (
                        <Button
                          variant="dark"
                          className="rounded-pill py-2 fw-bold"
                          disabled={busy}
                          onClick={() => run(c.contractId, () => approveWorkApi(c.contractId), 'Work approved — payment released to worker!')}
                        >
                          Approve Work & Release Payment
                        </Button>
                      )}

                      {/* CLIENT: pay directly via Razorpay once work is submitted */}
                      {role === 'CLIENT' && c.status === 'WORK_SUBMITTED' && (
                        <Button
                          variant="dark"
                          className="rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                          disabled={busy}
                          onClick={() => payViaRazorpay(c)}
                        >
                          <CreditCard size={18} /> {busy ? 'Processing...' : `Pay ₹${c.agreedAmount} via Razorpay`}
                        </Button>
                      )}

                      {c.status === 'COMPLETED' && (
                        <Button
                          variant="outline-dark"
                          className="rounded-pill py-2 fw-bold"
                          onClick={() => setReviewTarget({
                            contractId: c.contractId,
                            revieweeName: isWorker ? c.clientName : c.workerName,
                          })}
                        >
                          Rate & Review
                        </Button>
                      )}

                      {c.status === 'REJECTED' && (
                        <div className="text-center py-2 bg-danger bg-opacity-10 rounded-pill text-danger fw-bold small border border-danger border-opacity-25">
                          This contract was rejected
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
          contractId={reviewTarget.contractId}
          revieweeName={reviewTarget.revieweeName}
        />
      )}

      <style>{`
        .hover-up:hover {
            transform: translateY(-4px);
            box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08) !important;
        }
        .transition-all {
            transition: all 0.3s ease;
        }
      `}</style>
    </Container>
  );
};

export default ContractsPage;
