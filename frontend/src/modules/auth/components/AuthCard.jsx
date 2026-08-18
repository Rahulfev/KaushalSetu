import { Card } from 'react-bootstrap';

const AuthCard = ({ title, children }) => {
  return (
    <Card className="mx-auto mt-5 shadow" style={{ maxWidth: 420 }}>
      <Card.Body>
        <h4 className="text-center mb-4">{title}</h4>
        {children}
      </Card.Body>
    </Card>
  );
};

export default AuthCard;
