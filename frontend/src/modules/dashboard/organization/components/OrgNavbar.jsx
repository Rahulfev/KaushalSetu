import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const OrgNavbar = ({ orgName }) => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-3">
            <Container fluid className="px-4">
                <Navbar.Brand as={NavLink} to="/organization/dashboard" className="fw-bold fs-4 text-primary">
                    KaushalSetu <span className="text-white opacity-50 small fs-6 ms-2">| Org</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="org-navbar" />
                <Navbar.Collapse id="org-navbar">
                    <Nav className="mx-auto gap-3">
                        <Nav.Link as={NavLink} to="/organization/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={NavLink} to="/organization/home">Feed</Nav.Link>
                        <Nav.Link as={NavLink} to="/organization/post-job">Post Job</Nav.Link>
                        <Nav.Link as={NavLink} to="/organization/applications">Applications</Nav.Link>
                        {/* Highlighting the Payments link */}
                        <Nav.Link 
                            as={NavLink} 
                            to="/organization/payments" 
                            className="text-warning fw-bold border-start border-secondary ps-3"
                        >
                            💰 Payments
                        </Nav.Link>
                    </Nav>

                    <Nav>
                        <NavDropdown title={orgName || "Profile"} id="user-dropdown" align="end">
                            <NavDropdown.Item as={NavLink} to="/organization/profile">Company Info</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="text-danger">
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default OrgNavbar;