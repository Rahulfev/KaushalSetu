import React, { useState } from 'react';
import useUserManagement from '../hooks/useUserManagement';
import { Modal, Button, Row, Col, InputGroup, Form, Badge } from 'react-bootstrap';

const UsersPage = () => {
    const { users, loading, error, handleToggleStatus } = useUserManagement();
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const filteredUsers = (users || []).filter(user => {
        if (!user) return false;
        const term = searchTerm.toLowerCase();
        const roleName = typeof user.role === 'object' ? user.role?.roleName : user.role;
        return (
            (user.fullName?.toLowerCase() || user.name?.toLowerCase() || "").includes(term) ||
            (user.email?.toLowerCase() || "").includes(term) ||
            (roleName?.toLowerCase() || "").includes(term)
        );
    });

    const getRoleStyles = (role) => {
        const roleStr = (typeof role === 'object' ? role?.roleName : role) || "USER";
        switch (roleStr.toUpperCase()) {
            case 'ADMIN': return { bg: '#0f172a', color: '#facc15' }; // Night Slate + Yellow
            case 'ORGANIZATION': return { bg: '#4f46e5', color: '#ffffff' }; 
            case 'WORKER': return { bg: '#10b981', color: '#ffffff' }; 
            case 'CLIENT': return { bg: '#0ea5e9', color: '#ffffff' }; 
            default: return { bg: '#64748b', color: '#ffffff' }; 
        }
    };

    if (loading) return (
        <div className="p-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }}></div>
            <h5 className="fw-bold text-muted">Indexing User Directory...</h5>
        </div>
    );

    return (
        <div className="container-fluid py-4 px-4 bg-light min-vh-100">
            {/* --- HEADER & SEARCH --- */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold text-dark mb-1">User Access Control</h2>
                    <p className="text-muted small mb-0">Manage global permissions and account statuses.</p>
                </div>
                
                <div className="d-flex gap-2">
                    <InputGroup className="shadow-sm rounded-3 overflow-hidden" style={{ maxWidth: '300px' }}>
                        <InputGroup.Text className="bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </InputGroup.Text>
                        <Form.Control 
                            placeholder="Search identity..." 
                            className="border-start-0 ps-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    {/* <button className="btn btn-dark shadow-sm fw-bold px-4 rounded-3">
                        <i className="bi bi-person-plus-fill me-2"></i>Provision
                    </button> */}
                </div>
            </div>

            {/* --- USER TABLE --- */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light border-bottom">
                            <tr className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                                <th className="ps-4 py-3">Full Identity</th>
                                <th>Access Level</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user?.userId || user?.id || Math.random()}>
                                    <td className="ps-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle bg-secondary bg-opacity-10 text-secondary d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                                                {(user?.fullName || user?.name || "U").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{user?.fullName || user?.name || "New User"}</div>
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <Badge style={{ backgroundColor: getRoleStyles(user?.role).bg, color: getRoleStyles(user?.role).color, padding: '8px 12px' }} className="border-0 shadow-sm fw-bold">
                                            {typeof user?.role === 'object' ? user.role?.roleName : (user?.role || "USER")}
                                        </Badge>
                                    </td>
                                    <td>
                                        <span className={`small fw-bold ${user?.status === 'ACTIVE' ? 'text-success' : 'text-danger'}`}>
                                            <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.5rem' }}></i>
                                            {user?.status === 'ACTIVE' ? 'ACTIVE' : 'SUSPENDED'}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="btn-group shadow-sm border rounded-pill overflow-hidden bg-white">
                                            <button onClick={() => handleViewUser(user)} className="btn btn-white btn-sm fw-bold px-3 py-2 border-end">View</button>
                                            <button 
                                                onClick={() => handleToggleStatus(user?.userId || user?.id, user?.status)} 
                                                className={`btn btn-sm fw-bold px-3 py-2 ${user?.status === 'ACTIVE' ? 'text-danger' : 'text-success'}`}
                                            >
                                                {user?.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- USER DOSSIER MODAL --- */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Body className="p-0 overflow-hidden rounded-4 shadow-lg border-0">
                    {/* Header: Night Slate Theme */}
                    <div className="p-4 text-white d-flex align-items-center justify-content-between" style={{ background: '#0f172a' }}>
                        <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold shadow-sm me-3" style={{ width: '60px', height: '60px', fontSize: '1.2rem' }}>
                                {(selectedUser?.fullName || selectedUser?.name)?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="fw-bold mb-0">{selectedUser?.fullName || selectedUser?.name}</h4>
                                <span className="text-white-50 small">{selectedUser?.email}</span>
                            </div>
                        </div>
                        <Badge pill bg={selectedUser?.status === 'ACTIVE' ? 'success' : 'danger'} className="px-3 py-2">
                            {selectedUser?.status}
                        </Badge>
                    </div>

                    <div className="p-4 bg-white">
                        <Row className="mb-4 g-3">
                            <Col md={4}>
                                <div className="p-3 bg-light rounded-3 border-start border-primary border-4">
                                    <label className="text-muted small fw-bold d-block mb-1">Internal UID</label>
                                    <span className="fw-bold">#USR-{selectedUser?.userId || selectedUser?.id}</span>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="p-3 bg-light rounded-3 border-start border-info border-4">
                                    <label className="text-muted small fw-bold d-block mb-1">Access Level</label>
                                    <span className="fw-bold text-primary">{typeof selectedUser?.role === 'object' ? selectedUser.role?.roleName : selectedUser?.role}</span>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="p-3 bg-light rounded-3 border-start border-success border-4">
                                    <label className="text-muted small fw-bold d-block mb-1">Phone Contact</label>
                                    <span className="fw-bold">{selectedUser?.phoneNumber || "Not Provided"}</span>
                                </div>
                            </Col>
                        </Row>

                        <h6 className="text-uppercase text-muted fw-bold small mb-3" style={{ letterSpacing: '1px' }}>Security Audit</h6>
                        <div className="border rounded-4 p-3 mb-4 bg-light bg-opacity-50">
                            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                                <span className="text-muted small fw-bold">KYC Status</span>
                                <Badge bg={selectedUser?.kycStatus === 'VERIFIED' ? 'success' : 'warning'} text={selectedUser?.kycStatus === 'VERIFIED' ? 'white' : 'dark'}>
                                    {selectedUser?.kycStatus || "PENDING"}
                                </Badge>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                                <span className="text-muted small fw-bold">Created On</span>
                                <span className="fw-bold small">{selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted small fw-bold">MFA Enabled</span>
                                <span className={`fw-bold small ${selectedUser?.mfaEnabled ? 'text-success' : 'text-muted'}`}>
                                    {selectedUser?.mfaEnabled ? 'YES' : 'NO'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-light border-top d-flex justify-content-end gap-2">
                        <Button variant="outline-dark" className="fw-bold px-4 rounded-pill" onClick={() => setShowModal(false)}>Close</Button>
                        <Button 
                            variant={selectedUser?.status === 'ACTIVE' ? "danger" : "success"} 
                            onClick={() => {
                                handleToggleStatus(selectedUser?.userId || selectedUser?.id, selectedUser?.status);
                                setShowModal(false);
                            }} 
                            className="fw-bold px-4 rounded-pill shadow-sm"
                        >
                            {selectedUser?.status === 'ACTIVE' ? 'Suspend Access' : 'Restore Access'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UsersPage;