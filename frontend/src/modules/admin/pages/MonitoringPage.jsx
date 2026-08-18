import React from 'react';
import useAdminDashboard from '../hooks/useAdminDashboard';

const MonitoringPage = () => {
    // const { stats, logs, loading, error } = useAdminDashboard();

    const { stats, loading, error } = useAdminDashboard();

    if (loading) return (
        <div className="d-flex flex-column justify-content-center align-items-center w-100 bg-light" style={{ minHeight: '80vh' }}>
            <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
            <h5 className="text-dark fw-bold">Connecting to Cluster...</h5>
            <p className="text-muted small">Aggregating real-time telemetry data.</p>
        </div>
    );

    if (error) return (
        <div className="container py-5">
            <div className="alert alert-custom bg-danger bg-opacity-10 text-danger border-danger border-opacity-25 shadow-sm">
                <i className="bi bi-exclamation-octagon-fill me-2"></i> {error}
            </div>
        </div>
    );

    return (
        <div className="container-fluid py-4 px-4 bg-light min-vh-100">
            
            {/* --- 🛡️ PLATFORM STATUS BAR --- */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="card-body p-4 d-flex justify-content-between align-items-center text-white" 
                     style={{ background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)' }}>
                    <div>
                        <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.025em' }}>System Monitoring</h2>
                        <p className="opacity-75 small mb-0 d-flex align-items-center">
                            <i className="bi bi-cpu me-2"></i>
                            <span className="text-success fw-bold ms-1"></span> 
                            <span className="mx-2 opacity-25">|</span> 
                            <span className="fw-bold"></span>
                        </p>
                    </div>
                    <div className="text-end">
                        <div className={`badge rounded-pill px-4 py-2 fs-6 border ${
                            stats.status === 'Healthy' 
                            ? 'bg-success bg-opacity-10 text-success border-success' 
                            : 'bg-danger bg-opacity-10 text-danger border-danger'
                        }`}>
                            <span className="spinner-grow spinner-grow-sm me-2" role="status"></span>
                            {stats.status === 'Healthy' ? 'OPERATIONAL' : 'DEGRADED'}
                        </div>
                        <div className="small mt-2 opacity-50 fw-bold">Refreshed: {new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>

            {/* --- 📊 CORE PERFORMANCE METRICS --- */}
            <div className="row g-4 mb-4">
                {[
                    { title: 'User Base', val: stats.totalUsers, icon: 'people', color: '#0f172a', trend: '', trendColor: 'text-success' },
                    { title: 'Live Sessions', val: stats.activeUsers, icon: 'broadcast', color: '#1e293b', trend: '', trendColor: 'text-primary' }
                ].map((item, i) => (
                    <div className="col-md-6" key={i}>
                        <div className="card border-0 shadow-sm rounded-4 h-100 p-4 transition-hover">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="p-3 rounded-4 shadow-sm" style={{ backgroundColor: item.color, color: item.iconColor || 'white' }}>
                                    <i className={`bi bi-${item.icon} fs-4`}></i>
                                </div>
                                <span className={`small fw-bold px-2 py-1 rounded bg-light ${item.trendColor}`}>{item.trend}</span>
                            </div>
                            <h6 className="text-muted small text-uppercase fw-bold mb-1" style={{ letterSpacing: '0.5px' }}>{item.title}</h6>
                            <h2 className="fw-bold text-dark mb-0">{item.val}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- 🛠️ WORKLOAD STATISTICS --- */}
            <div className="row g-4 mb-4">
                {[
                    { label: 'Total Jobs', val: stats.totalJobs, color: '#4f46e5', icon: '📢' },
                    { label: 'Ongoing', val: stats.ongoingJobs, color: '#0ea5e9', icon: '⏳' },
                    { label: 'Completed', val: stats.completedJobs, color: '#10b981', icon: '✅' }
                ].map((job, idx) => (
                    <div className="col-md-4" key={idx}>
                        <div className="card border-0 shadow-sm rounded-4 p-4 border-start border-5 h-100" style={{ borderColor: job.color }}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small mb-1 fw-bold text-uppercase">{job.label}</p>
                                    <h3 className="fw-bold mb-0 text-dark">{job.val}</h3>
                                </div>
                                <span className="display-6">{job.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

         
            <div className="row g-4">
                {/* Modern Event Stream */}
                {/* <div className="col-lg-12">
                    <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-bottom border-light py-3 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-terminal-fill text-dark me-2"></i>
                                <h6 className="fw-bold mb-0 text-uppercase small">Real-time Event Stream</h6>
                            </div>
                            <button className="btn btn-sm btn-outline-secondary fw-bold rounded-pill px-3 py-1 small">
                                Clear Log
                            </button>
                        </div>
                        <div className="table-responsive" style={{ maxHeight: '420px' }}>
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light sticky-top">
                                    <tr className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                                        <th className="ps-4">Timestamp</th>
                                        <th>Level</th>
                                        <th>Module</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs && logs.length > 0 ? logs.map((log, index) => (
                                        <tr key={index} className="small border-bottom border-light">
                                            <td className="ps-4 text-muted">
                                                {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-2 py-1 ${
                                                    log.level === 'ERROR' 
                                                    ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25' 
                                                    : 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25'
                                                }`}>
                                                    {log.level || 'INFO'}
                                                </span>
                                            </td>
                                            <td className="fw-bold text-dark">{log.module || 'CORE'}</td>
                                            <td className="text-secondary">{log.message}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="text-center py-5 text-muted">No active logs found in the stream.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div> */}
            </div>

            <style>{`
                .transition-hover { transition: transform 0.2s ease-in-out; }
                .transition-hover:hover { transform: translateY(-5px); }
                .fw-bold { font-weight: 700 !important; }
                .table-responsive::-webkit-scrollbar { width: 6px; }
                .table-responsive::-webkit-scrollbar-thumb { background-color: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default MonitoringPage;