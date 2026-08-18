import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../services/axiosInstance';
import { Container, Row, Col, Card, Badge, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const WalletPage = () => {
    const [wallet, setWallet] = useState(null); // { balance, totalEarned, totalWithdrawn, transactions }
    const [escrowPending, setEscrowPending] = useState([]); // still-held org escrow (not yet in wallet balance)
    const [loading, setLoading] = useState(true);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);

    const load = async () => {
        try {
            const [walletRes, escrowRes] = await Promise.all([
                axiosInstance.get('/wallet/me'),
                axiosInstance.get('/worker/payments/my-history').catch(() => ({ data: [] })),
            ]);
            setWallet(walletRes.data);
            setEscrowPending((escrowRes.data || []).filter(p => p.paymentStatus === 'ESCROW_HELD'));
        } catch (err) {
            toast.error("Could not load your wallet. Please refresh.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const heldInEscrow = escrowPending.reduce((acc, curr) => acc + curr.amount, 0);

    const handleWithdraw = async () => {
        const amount = Number(withdrawAmount);
        if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
        if (amount > (wallet?.balance || 0)) { toast.error('Amount exceeds your wallet balance'); return; }

        setWithdrawing(true);
        try {
            await axiosInstance.post('/wallet/withdraw', { amount });
            toast.success('Withdrawal submitted!');
            setShowWithdraw(false);
            setWithdrawAmount('');
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Withdrawal failed');
        } finally {
            setWithdrawing(false);
        }
    };

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
            <Spinner animation="border" variant="warning" className="mb-3" />
            <h6 className="text-muted fw-bold">Connecting to Secure Vault...</h6>
        </div>
    );

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                {/* 🚀 Header */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="fw-bold text-dark mb-1">Financial Portfolio</h2>
                        <p className="text-muted small mb-0">Manage your earnings and track escrow security.</p>
                    </div>
                </div>

                {/* --- METRICS --- */}
                <Row className="g-4 mb-5">
                    {/* Main Balance Card */}
                    <Col md={escrowPending.length > 0 ? 6 : 12}>
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden text-white h-100"
                              style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="small text-uppercase fw-bold text-warning">Wallet Balance</span>
                                    <i className="bi bi-wallet2 fs-4 text-warning"></i>
                                </div>
                                <h1 className="fw-black mb-0 display-4">₹{(wallet?.balance || 0).toLocaleString('en-IN')}</h1>
                                <p className="small opacity-50 mt-2">
                                    Lifetime earned: ₹{(wallet?.totalEarned || 0).toLocaleString('en-IN')} · Withdrawn: ₹{(wallet?.totalWithdrawn || 0).toLocaleString('en-IN')}
                                </p>
                                <Button
                                    variant="warning"
                                    className="mt-4 fw-bold px-4 rounded-pill w-100 text-dark border-0 shadow"
                                    disabled={!wallet?.balance}
                                    onClick={() => setShowWithdraw(true)}
                                >
                                    Withdraw Funds
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Escrow Status Card — only shown while an Organization contract has funds
                        held in escrow. Client household jobs don't use escrow at all, so this
                        stays hidden for workers who are only doing client jobs. */}
                    {escrowPending.length > 0 && (
                        <Col md={6}>
                            <Card className="border-0 shadow-sm rounded-4 p-2 h-100 bg-white border-start border-5 border-warning">
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="small text-uppercase fw-bold text-muted">Secured in Escrow</span>
                                        <i className="bi bi-shield-lock-fill fs-4 text-warning"></i>
                                    </div>
                                    <h1 className="fw-black text-dark mb-0 display-4">₹{heldInEscrow.toLocaleString('en-IN')}</h1>
                                    <div className="bg-warning bg-opacity-10 p-3 rounded-3 mt-4">
                                        <p className="small text-dark fw-bold mb-0">
                                            <i className="bi bi-info-circle-fill me-2"></i>
                                            Organization contract funds — locked until work is approved. Not yet in your wallet.
                                        </p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>

                {/* --- TRANSACTION HISTORY --- */}
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                    <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold mb-0 text-dark text-uppercase small">Wallet Transaction History</h6>
                        <Badge bg="light" text="dark" className="border">{wallet?.transactions?.length || 0} entries</Badge>
                    </Card.Header>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light small fw-bold text-muted text-uppercase" style={{ fontSize: '0.7rem' }}>
                                <tr>
                                    <th className="ps-4 py-3">Description & Date</th>
                                    <th>Type</th>
                                    <th className="text-end pe-4">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wallet?.transactions?.length > 0 ? wallet.transactions.map(t => (
                                    <tr key={t.transactionId}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-dark small">{t.description || `Transaction #${t.transactionId}`}</div>
                                            <div className="text-muted extra-small">{new Date(t.createdAt).toLocaleString('en-IN')}</div>
                                        </td>
                                        <td>
                                            <Badge pill className={`px-3 py-2 fw-bold ${t.type === 'CREDIT' ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'}`}>
                                                <i className={`bi bi-${t.type === 'CREDIT' ? 'arrow-down-circle-fill' : 'arrow-up-circle-fill'} me-2`}></i>
                                                {t.type}
                                            </Badge>
                                        </td>
                                        <td className={`text-end pe-4 fw-bold fs-5 ${t.type === 'CREDIT' ? 'text-success' : 'text-danger'}`}>
                                            {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="text-center py-5 text-muted">No transactions yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </Container>

            <Modal show={showWithdraw} onHide={() => setShowWithdraw(false)} centered>
                <Modal.Header closeButton><Modal.Title>Withdraw Funds</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p className="text-muted small">Available balance: <strong>₹{(wallet?.balance || 0).toLocaleString('en-IN')}</strong></p>
                    <Form.Group>
                        <Form.Label className="small fw-bold text-muted">Amount (₹)</Form.Label>
                        <Form.Control type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter amount" />
                    </Form.Group>
                    <p className="text-muted small mt-2">Funds go to the UPI/bank account on file in your KYC profile.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setShowWithdraw(false)}>Cancel</Button>
                    <Button variant="dark" onClick={handleWithdraw} disabled={withdrawing}>
                        {withdrawing ? <Spinner size="sm" /> : 'Confirm Withdrawal'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <style>{`.extra-small { font-size: 0.7rem; }`}</style>
        </div>
    );
};

export default WalletPage;
