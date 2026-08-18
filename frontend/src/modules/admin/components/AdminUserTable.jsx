import React from 'react';
import { toast } from 'react-toastify';

const AdminUserTable = ({ users, onStatusChange, onRoleChange }) => {
  if (!users || users.length === 0) {
    return <div className="alert alert-warning text-center m-4">No users match your search.</div>;
  }

  const handleViewProfile = (user) => {
    // Placeholder for View Profile Modal
    toast.info(`${user.name} — ${user.role} — ${user.email}`);
  };

  return (
    <div className="card shadow border-0 rounded-3 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3 small fw-bold text-uppercase text-secondary">User</th>
              <th className="py-3 small fw-bold text-uppercase text-secondary">Role</th>
              <th className="py-3 small fw-bold text-uppercase text-secondary">Status</th>
              <th className="pe-4 py-3 text-end small fw-bold text-uppercase text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="ps-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{user.name}</div>
                      <div className="text-muted small">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <select 
                    className="form-select form-select-sm border-0 bg-light fw-medium" 
                    value={user.role} 
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    style={{ width: '130px' }}
                  >
                    <option value="Worker">Worker</option>
                    <option value="Client">Client</option>
                    <option value="Organization">Org</option>
                  </select>
                </td>
                <td>
                  <span className={`badge rounded-pill px-3 py-2 ${
                    user.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="pe-4 text-end">
                  <div className="btn-group">
                    {/* View Profile Button */}
                    <button 
                      className="btn btn-sm btn-light border text-muted" 
                      onClick={() => handleViewProfile(user)}
                      title="View Details"
                    >
                      👁️
                    </button>

                    {/* Block/Activate Button */}
                    {user.status === 'Blocked' ? (
                      <button onClick={() => onStatusChange(user.id, 'Active')} className="btn btn-sm btn-success fw-bold">
                        Activate
                      </button>
                    ) : (
                      <button onClick={() => onStatusChange(user.id, 'Blocked')} className="btn btn-sm btn-outline-danger fw-bold">
                        Block
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserTable;