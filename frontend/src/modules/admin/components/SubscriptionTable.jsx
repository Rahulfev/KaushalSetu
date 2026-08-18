import React from 'react';

const SubscriptionTable = ({ subscriptions }) => {
  if (!subscriptions.length) return <div className="p-4 text-center">No active subscriptions.</div>;

  return (
    <div className="card shadow border-0 rounded-3 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3 text-secondary small fw-bold text-uppercase">Subscriber</th>
              <th className="py-3 text-secondary small fw-bold text-uppercase">Plan</th>
              <th className="py-3 text-secondary small fw-bold text-uppercase">Status</th>
              <th className="py-3 text-secondary small fw-bold text-uppercase">Renewal Date</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className="ps-4 fw-bold text-dark">{sub.user}</td>
                <td><span className="badge bg-primary bg-opacity-10 text-primary">{sub.plan}</span></td>
                <td>
                  <span className={`badge rounded-pill px-3 py-2 ${
                    sub.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="text-muted small">{sub.nextBilling}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionTable;