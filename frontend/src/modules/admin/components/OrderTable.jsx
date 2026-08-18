import React from 'react';

const OrderTable = ({ orders }) => {
  if (!orders || orders.length === 0) return <div className="p-4 text-center">No orders found.</div>;

  return (
    <div className="card shadow border-0 rounded-3 overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th className="ps-4 py-3 small fw-bold text-uppercase text-secondary">Order ID</th>
              <th className="py-3 small fw-bold text-uppercase text-secondary">Worker</th>
              <th className="py-3 small fw-bold text-uppercase text-secondary">Item</th>
              <th className="py-3 small fw-bold text-uppercase text-secondary">Total</th>
              <th className="py-3 small fw-bold text-uppercase text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="ps-4 fw-bold text-primary small">{order.id}</td>
                <td>
                  <div className="fw-bold text-dark">{order.worker}</div>
                  <div className="text-muted small">{order.date}</div>
                </td>
                <td>
                  <div className="text-dark">{order.product}</div>
                  <div className="text-muted small">Qty: {order.qty}</div>
                </td>
                <td className="fw-bold">₹{order.total}</td>
                <td>
                  <span className={`badge rounded-pill px-3 py-2 ${
                    order.status === 'Delivered' ? 'bg-success bg-opacity-10 text-success' :
                    order.status === 'Processing' ? 'bg-warning bg-opacity-10 text-warning' :
                    'bg-info bg-opacity-10 text-info'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;