import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const ClientNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/client/dashboard">
          KaushalSetu
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="client-navbar" />
        <Navbar.Collapse id="client-navbar">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/client/dashboard"
              active={location.pathname === '/client/dashboard'}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/client/post-job"
              active={location.pathname === '/client/post-job'}
            >
              Post Job
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/client/my-jobs"
              active={location.pathname === '/client/my-jobs'}
            >
              My Jobs
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/client/applications"
              active={location.pathname === '/client/applications'}
            >
              Applications
            </Nav.Link>

               {/* ✅ CONTRACTS */}
            <Nav.Link
              as={Link}
              to="/client/contracts"
              active={location.pathname.startsWith('/client/contracts')}
            >
              Contracts
            </Nav.Link>
            
              {/* ✅ JOB HISTORY (ADDED) */}
            <Nav.Link
              as={Link}
              to="/client/job-history"
              active={location.pathname === '/client/job-history'}
            >
              Job History
            </Nav.Link>

          

             
          </Nav>

          <Nav>
            <NavDropdown title="Account" id="account-dropdown">
              <NavDropdown.Item as={Link} to="/client/profile">Profile</NavDropdown.Item>
             
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default ClientNavbar;
