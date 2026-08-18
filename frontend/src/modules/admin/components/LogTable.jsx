import React from 'react';

const LogTable = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return <div className="p-4 text-center text-muted">No logs available.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4 py-3 text-secondary text-uppercase small fw-bold">Timestamp</th>
            <th className="py-3 text-secondary text-uppercase small fw-bold">Level</th>
            <th className="py-3 text-secondary text-uppercase small fw-bold">Module</th>
            <th className="pe-4 py-3 text-secondary text-uppercase small fw-bold">Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="ps-4 text-muted small">{log.timestamp}</td>
              <td>
                <span className={`badge rounded-pill px-3 py-2 ${
                  log.level === 'Error' ? 'bg-danger bg-opacity-10 text-danger' : 
                  log.level === 'Warning' ? 'bg-warning bg-opacity-10 text-warning' : 
                  'bg-info bg-opacity-10 text-info'
                }`}>
                  {log.level}
                </span>
              </td>
              <td className="fw-bold text-dark small">{log.module}</td>
              <td className={`pe-4 ${log.level === 'Error' ? 'text-danger fw-medium' : 'text-dark'}`}>
                {log.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;