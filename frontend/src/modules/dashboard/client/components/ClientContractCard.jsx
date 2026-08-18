import ContractStatusBadge from "./ContractStatusBadge";

const ClientContractCard = ({ contract, onStatusChange }) => {
  return (
    <div className="card p-3 mb-3 shadow-sm">
      <h5>{contract.job?.title || "Job Contract"}</h5>

      <p>
        <strong>Worker:</strong> {contract.worker?.name}
      </p>

      <p>
        <strong>Amount:</strong> ₹{contract.agreedAmount}
      </p>

      <p>
        <strong>Duration:</strong> {contract.startDate} → {contract.endDate}
      </p>

      <ContractStatusBadge status={contract.status} />

      <div className="mt-3">
        {contract.status === "DRAFT" && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onStatusChange(contract.contractId, "SIGNED")}
          >
            Sign Contract
          </button>
        )}

        {contract.status === "SIGNED" && (
          <button
            className="btn btn-success btn-sm"
            onClick={() => onStatusChange(contract.contractId, "ACTIVE")}
          >
            Activate
          </button>
        )}

        {contract.status === "ACTIVE" && (
          <button
            className="btn btn-dark btn-sm"
            onClick={() => onStatusChange(contract.contractId, "COMPLETED")}
          >
            Mark Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientContractCard;
