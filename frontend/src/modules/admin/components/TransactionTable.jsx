import React from 'react';

const TransactionTable = ({ transactions, onRelease }) => {
  if (!transactions || transactions.length === 0) return <div className="p-4 text-center">No transactions found.</div>;

  return (
    <div className="card shadow border-0 rounded-3 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3 text-secondary text-uppercase small fw-bold">ID & Date</th>
              <th className="py-3 text-secondary text-uppercase small fw-bold">Parties</th>
              <th className="py-3 text-secondary text-uppercase small fw-bold">Type</th>
              <th className="py-3 text-secondary text-uppercase small fw-bold">Amount</th>
              <th className="py-3 text-secondary text-uppercase small fw-bold">Status</th>
              <th className="pe-4 py-3 text-end text-secondary text-uppercase small fw-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td className="ps-4">
                  <div className="fw-bold text-primary small">{txn.id}</div>
                  <div className="text-muted small">{txn.date}</div>
                </td>
                <td>
                  <div className="fw-bold text-dark">{txn.client}</div>
                  <div className="text-muted small">➞ {txn.worker}</div>
                </td>
                <td><span className="badge bg-light text-dark border">{txn.type}</span></td>
                <td className="fw-bold text-dark">₹{txn.amount.toLocaleString()}</td>
                <td>
                  <span className={`badge rounded-pill px-3 py-2 ${
                    txn.status === 'Released' ? 'bg-success bg-opacity-10 text-success' :
                    txn.status === 'Held in Escrow' ? 'bg-warning bg-opacity-10 text-warning' :
                    txn.status === 'Failed' ? 'bg-danger bg-opacity-10 text-danger' :
                    'bg-secondary bg-opacity-10 text-secondary'
                  }`}>
                    {txn.status}
                  </span>
                </td>
                <td className="pe-4 text-end">
                  {txn.status === 'Held in Escrow' && (
                    <button 
                      onClick={() => onRelease(txn.id)}
                      className="btn btn-sm btn-primary fw-bold shadow-sm"
                    >
                      Release
                    </button>
                  )}
                  {txn.status === 'Failed' && (
                    <button className="btn btn-sm btn-outline-danger fw-bold disabled">
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;