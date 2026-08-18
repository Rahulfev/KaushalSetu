const WorkerCard = ({ application, onSelect, onReject }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title mb-1">{application.applicantName}</h5>
            <small className="text-muted">{application.applicantEmail}</small>
          </div>
          <div className="text-end">
            <span className={`badge ${
              application.status === 'APPLIED' ? 'bg-warning' :
              application.status === 'SHORTLISTED' ? 'bg-info' :
              application.status === 'REJECTED' ? 'bg-danger' : 'bg-secondary'
            }`}>
              {application.status}
            </span>
            <br />
            <small className="text-muted">Applied: {new Date(application.appliedAt).toLocaleDateString()}</small>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="card-text mb-2">
            <strong>Job:</strong> {application.jobTitle}
          </p>
          <p className="card-text mb-2">
            <strong>Skills:</strong> {application.skills || 'Not specified'}
          </p>
          <p className="card-text mb-2">
            <strong>Experience:</strong> {application.experience || 0} years
          </p>
          <p className="card-text mb-2">
            <strong>KYC:</strong> {application.kycVerified ? "✅ Verified" : "⏳ Pending"}
          </p>
        </div>
        
        {application.status === 'APPLIED' && (
          <div className="d-flex gap-2">
            <button
              onClick={() => onSelect(application.applicationId, application.applicantName)}
              className="btn btn-success btn-sm"
            >
              ✅ Select
            </button>
            <button
              onClick={() => onReject(application.applicationId, application.applicantName)}
              className="btn btn-danger btn-sm"
            >
              ❌ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerCard;
