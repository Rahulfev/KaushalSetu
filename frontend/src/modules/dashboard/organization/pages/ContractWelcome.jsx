import { useParams } from 'react-router-dom';

const ContractWelcome = () => {
  const { applicationId } = useParams();

  return (
    <div className="container mt-5 text-center">
      <h2>Welcome to Contract</h2>
      <p className="text-muted">
        Application ID: <strong>{applicationId}</strong>
      </p>
    </div>
  );
};

export default ContractWelcome;
