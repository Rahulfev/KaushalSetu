import useClientContracts from "../hooks/useClientContracts";
import ClientContractCard from "../components/ClientContractCard";
import { getAuth } from "@/shared/utils/authUtils";
import { Container, Row, Col, Spinner, Badge } from "react-bootstrap";

const ClientContracts = () => {
  const { userId } = getAuth();
  const clientId = userId || 1;
  const { contracts, loading, changeStatus } = useClientContracts(clientId);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '80vh' }}>
      <Spinner animation="border" variant="warning" />
    </div>
  );

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        {/* 🚀 Header Section */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="fw-bold text-dark mb-1">Active Engagements</h2>
            <p className="text-muted mb-0">Monitor contract performance and authorize milestone releases.</p>
          </div>
          <Badge bg="dark" className="px-3 py-2 rounded-pill shadow-sm">
            {contracts.length} Active Contracts
          </Badge>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-5 shadow-sm border">
            <i className="bi bi-file-earmark-lock2 display-1 text-muted opacity-25"></i>
            <h4 className="text-muted mt-3">No contracts initialized</h4>
            <p className="small text-muted">Initialize a contract by selecting an applicant from your job postings.</p>
          </div>
        ) : (
          <Row className="g-4">
            {contracts.map((contract) => (
              <Col xs={12} key={contract.contractId}>
                <ClientContractCard
                  contract={contract}
                  onStatusChange={changeStatus}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ClientContracts;