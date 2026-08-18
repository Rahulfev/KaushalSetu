import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../services/axiosInstance';
import { Container, Table, Badge, Button, Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const OrganizationPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchMyPayments = async () => {
        try {
            setLoading(true);
            // ✅ Path aligned with SecurityConfig: /api prefix handled by axiosInstance
            const res = await axiosInstance.get('/organization/payments'); 
            setPayments(res.data || []);
        } catch (err) {
            console.error("Database Sync Error:", err);
            if (err.response?.status === 403) toast.error("Access denied. Please refresh your session.");
            else toast.error("Could not load payments. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMyPayments(); }, []);

    const handleFundNow = async (escrowId) => {
        if (!window.confirm("Fund this escrow now? The amount will be locked in escrow and the contract will activate.")) return;
        setProcessingId(escrowId);
        try {
            await axiosInstance.post(`/organization/payments/fund/${escrowId}`);
            toast.success("Funds successfully secured in escrow! 🛡️");
            fetchMyPayments();
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not fund escrow. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleRelease = async (escrowId) => {
        if (!window.confirm("Release these secured funds to the worker? This cannot be undone.")) return;
        setProcessingId(escrowId);
        try {
            await axiosInstance.post(`/organization/payments/release/${escrowId}`);
            toast.success("Funds released to the worker! 💸");
            fetchMyPayments();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to release funds.");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return (
        <Container className="p-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 fw-bold text-muted">Syncing Project Financials...</p>
        </Container>
    );

    return (
        <Container fluid className="p-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Project Funding Oversight</h2>
                {/* <Button variant="outline-primary" onClick={fetchMyPayments}>🔄 Sync Database</Button> */}
            </div>

            <Card className="border-0 shadow-sm rounded-3 overflow-hidden">
                <Table hover responsive align="middle" className="mb-0">
                    <thead className="bg-white text-secondary small fw-bold border-bottom">
                        <tr>
                            <th className="ps-4">ASSIGNED WORKER</th>
                            <th className="text-center">AMOUNT</th>
                            <th className="text-center">STATUS</th>
                            <th className="text-end pe-4">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center text-muted py-5">
                                    No payments yet. Once a worker marks a job as completed, it will show up here ready to be funded.
                                </td>
                            </tr>
                        )}
                        {payments.map(txn => (
                            <tr key={txn.escrowId}>
                                <td className="ps-4 fw-bold">
                                    {txn.workerName || "Unknown Worker"}
                                    <div className="small text-muted fw-normal">
                                        {txn.jobTitle ? `${txn.jobTitle} · ` : ''}Contract #{txn.contractId}
                                    </div>
                                    <Link
                                        to={`/organization/worker/${txn.workerId}/documents`}
                                        className="small text-decoration-none fw-bold"
                                    >
                                        <i className="bi bi-shield-check me-1"></i>View KYC
                                    </Link>
                                </td>
                                <td className="text-center fw-bold text-primary">₹{txn.amount.toLocaleString()}</td>
                                <td className="text-center">
                                    {txn.paymentStatus === 'RELEASED' && (
                                        <Badge pill bg="primary">✔ PAID TO WORKER</Badge>
                                    )}
                                    {txn.paymentStatus === 'ESCROW_HELD' && (
                                        <Badge pill bg="success">🛡️ SECURED IN ESCROW</Badge>
                                    )}
                                    {txn.paymentStatus === 'PENDING' && (
                                        <Badge pill bg="info" text="dark">AWAITING PAYMENT</Badge>
                                    )}
                                </td>
                                <td className="text-end pe-4">
                                    {txn.paymentStatus === 'PENDING' && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            disabled={processingId === txn.escrowId}
                                            onClick={() => handleFundNow(txn.escrowId)}
                                        >
                                            {processingId === txn.escrowId ? 'Processing...' : 'Fund Now'}
                                        </Button>
                                    )}
                                    {txn.paymentStatus === 'ESCROW_HELD' && (
                                        <Button
                                            variant="dark"
                                            size="sm"
                                            disabled={processingId === txn.escrowId}
                                            onClick={() => handleRelease(txn.escrowId)}
                                        >
                                            {processingId === txn.escrowId ? 'Releasing...' : 'Release to Worker'}
                                        </Button>
                                    )}
                                    {txn.paymentStatus === 'RELEASED' && (
                                        <span className="text-success small fw-bold">✔ Complete</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Container>
    );
};

export default OrganizationPayments;
