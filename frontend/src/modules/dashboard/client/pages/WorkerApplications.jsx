import { useApplications } from "../hooks/useApplications";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const WorkerApplications = () => {
  const { applications, loading, updateStatus } = useApplications();
  const navigate = useNavigate();

  const handleAction = async (applicationId, status, name) => {
    try {
      await updateStatus(applicationId, status);
      toast.success(`${name} ${status.toLowerCase()} successfully!`);
    } catch {
      toast.error(`Failed to ${status.toLowerCase()} ${name}!`);
    }
  };

  const handleCreateContract = (app) => {
    console.log('Application object:', app); // Debug log
    navigate('/client/contracts/create', {
      state: {
        jobId: app.jobId,
        workerId: app.applicantUserId,
        jobTitle: app.jobTitle,
        applicantName: app.applicantName
      }
    });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4">Worker Applications</h2>
        <div className="alert alert-info text-center">
          <h5>No Applications Yet</h5>
          <p>No workers have applied for your jobs yet. Make sure your job postings are attractive!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Worker Applications</h2>
        <span className="badge bg-primary">{applications.length} Applications</span>
      </div>

      {applications.map(app => (
        <div key={app.applicationId} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="card-title mb-1">{app.applicantName}</h5>
                <small className="text-muted">{app.applicantEmail}</small>
              </div>
              <div className="text-end">
                <span className={`badge ${
                  app.status === 'APPLIED' ? 'bg-warning' :
                  app.status === 'SHORTLISTED' ? 'bg-info' :
                  app.status === 'REJECTED' ? 'bg-danger' : 'bg-secondary'
                }`}>
                  {app.status}
                </span>
                <br />
                <small className="text-muted">Applied: {new Date(app.appliedAt).toLocaleDateString()}</small>
              </div>
            </div>
            
            <p className="card-text mb-3">
              <strong>Job:</strong> {app.jobTitle}
            </p>
            
            {app.status === 'APPLIED' && (
              <div className="d-flex gap-2">
                <button
                  onClick={() => handleAction(app.applicationId, 'SHORTLISTED', app.applicantName)}
                  className="btn btn-success btn-sm"
                >
                  ✅ Shortlist
                </button>
                <button
                  onClick={() => handleAction(app.applicationId, 'REJECTED', app.applicantName)}
                  className="btn btn-danger btn-sm"
                >
                  ❌ Reject
                </button>
              </div>
            )}
            
            {app.status === 'SHORTLISTED' && (
              <div className="d-flex justify-content-end">
                <button
                  onClick={() => handleCreateContract(app)}
                  className="btn btn-primary btn-sm"
                >
                  📄 Contract
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkerApplications;