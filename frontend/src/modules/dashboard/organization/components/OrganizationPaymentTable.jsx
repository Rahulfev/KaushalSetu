const OrganizationPaymentTable = ({ payments }) => {
  return (
    <div className="table-container">
      <table className="payment-table">
        <thead>
          <tr>
            <th>Escrow ID</th>
            <th>Contract ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No payments found
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.escrowId}>
                <td>{payment.escrowId}</td>
                <td>{payment.contractId}</td>
                <td>₹ {payment.amount}</td>
                <td>{payment.paymentStatus}</td>
                <td>{payment.transactionType}</td>
                <td>
                  {new Date(payment.transactionDate).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizationPaymentTable;
