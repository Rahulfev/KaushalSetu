const statusColor = {
  DRAFT: "gray",
  SIGNED: "blue",
  ACTIVE: "green",
  COMPLETED: "purple",
};

const ContractStatusBadge = ({ status }) => {
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "12px",
        backgroundColor: statusColor[status],
        color: "white",
        fontSize: "12px",
      }}
    >
      {status}
    </span>
  );
};

export default ContractStatusBadge;
