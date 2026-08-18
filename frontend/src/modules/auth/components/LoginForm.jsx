import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { loginSchema, validateWithYup } from '../validation/authSchemas';

const LoginForm = () => {
  const { login, loading } = useAuth();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const values = {
      username: data.get('username'),
      password: data.get('password'),
    };

    const { valid, errors: validationErrors } = await validateWithYup(loginSchema, values);
    setErrors(validationErrors);
    if (!valid) return;

    login(values);
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Form.Group className="mb-3">
        <Form.Label className="small fw-bold text-secondary">Email or Phone</Form.Label>
        <InputGroup className="bg-light rounded-3 p-1">
          <InputGroup.Text className="bg-transparent border-0"><i className="bi bi-envelope"></i></InputGroup.Text>
          <Form.Control
            name="username"
            className="bg-transparent border-0 py-2"
            placeholder="name@company.com"
            isInvalid={!!errors.username}
          />
        </InputGroup>
        {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
      </Form.Group>

      <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <Form.Label className="small fw-bold text-secondary mb-0">Password</Form.Label>
          <Link to="/forgot-password" style={{fontSize: '0.75rem'}} className="text-decoration-none fw-bold">Forgot?</Link>
        </div>
        <InputGroup className="bg-light rounded-3 p-1">
          <InputGroup.Text className="bg-transparent border-0"><i className="bi bi-lock"></i></InputGroup.Text>
          <Form.Control
            type="password"
            name="password"
            className="bg-transparent border-0 py-2"
            placeholder="••••••••"
            isInvalid={!!errors.password}
          />
        </InputGroup>
        {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
      </Form.Group>

      <Button type="submit" className="w-100 py-3 fw-bold rounded-3 shadow-sm border-0" 
              style={{ background: '#facc15', color: '#000' }} disabled={loading}>
        {loading ? 'Verifying...' : 'Sign In'}
      </Button>
    </Form>
  );
};

export default LoginForm;
