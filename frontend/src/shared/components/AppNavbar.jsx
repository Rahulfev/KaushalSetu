import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Dropdown,
  Button,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, clearAuth } from "@/shared/utils/authUtils";
import axiosInstance from "@/services/axiosInstance";

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role, name } = getAuth();
  const [notifications, setNotifications] = useState([]);

  const fetchAlerts = async () => {
    if (!token) return;
    try {
      const res = await axiosInstance.get("/notifications/unread");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Notification sync failed");
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // ✅ Role Check Helpers
  const isAdmin = token && role === "ADMIN";
  const isWorker = token && role === "WORKER";
  const isClient = token && role === "CLIENT";
  const isOrg = token && role === "ORGANIZATION";

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="shadow-sm py-3"
      style={{ background: "#0f172a", borderBottom: "1px solid #1e293b" }}
      variant="dark"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to={
            isAdmin
              ? "/admin/dashboard"
              : isOrg
                ? "/organization/home"
                : isWorker
                  ? "/worker/dashboard"
                  : isClient
                    ? "/client/dashboard"
                    : "/"
          }
          className="fw-bold fs-4"
        >
          <span className="text-warning me-2">Kaushal</span>Setu
          {isAdmin && (
            <Badge
              bg="warning"
              text="dark"
              className="ms-2 small fw-bold"
              style={{ fontSize: "0.6rem" }}
            >
              ADMIN
            </Badge>
          )}
          {isOrg && (
            <Badge
              bg="primary"
              text="white"
              className="ms-2 small fw-bold"
              style={{ fontSize: "0.6rem" }}
            >
              ORG
            </Badge>
          )}
          {isWorker && (
            <Badge
              bg="info"
              text="dark"
              className="ms-2 small fw-bold"
              style={{ fontSize: "0.6rem" }}
            >
              WORKER
            </Badge>
          )}
          {isClient && (
            <Badge
              bg="success"
              text="white"
              className="ms-2 small fw-bold"
              style={{ fontSize: "0.6rem" }}
            >
              CLIENT
            </Badge>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ms-lg-4 gap-2">
            {/* 🌍 PUBLIC LINKS */}
            {!token && (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className={isActive("/") ? "text-warning fw-bold" : ""}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/about"
                  className={isActive("/about") ? "text-warning fw-bold" : ""}
                >
                  About Us
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className={isActive("/contact") ? "text-warning fw-bold" : ""}
                >
                  Contact Us
                </Nav.Link>
              </>
            )}

            {/* 🛡️ ADMIN ROUTES */}
            {isAdmin && (
              <>
                <div className="vr d-none d-lg-block mx-2 text-warning opacity-25"></div>
                <Nav.Link
                  as={Link}
                  to="/admin/dashboard"
                  className={
                    isActive("/admin/dashboard") ? "text-warning fw-bold" : ""
                  }
                >
                  Monitoring
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/admin/users"
                  className={
                    isActive("/admin/users") ? "text-warning fw-bold" : ""
                  }
                >
                  Users
                </Nav.Link>
                {/* <Nav.Link
                  as={Link}
                  to="/admin/inventory"
                  className={
                    isActive("/admin/inventory") ? "text-warning fw-bold" : ""
                  }
                >
                  Inventory
                </Nav.Link> */}
                <Nav.Link
                  as={Link}
                  to="/admin/payments"
                  className={
                    isActive("/admin/payments") ? "text-warning fw-bold" : ""
                  }
                >
                  Ledger
                </Nav.Link>
                {/* <Nav.Link
                  as={Link}
                  to="/admin/settings"
                  className={
                    isActive("/admin/settings") ? "text-warning fw-bold" : ""
                  }
                >
                  Settings
                </Nav.Link> */}
                {/* <Nav.Link
                  as={Link}
                  to="/admin/orders"
                  className={isActive("/admin/orders") ? "text-warning fw-bold" : ""}
                >
                  <i className="bi bi-clipboard-data me-1"></i> Worker Orders
                </Nav.Link> */}
                <Nav.Link
                  as={Link}
                  to="/admin/kyc"
                  className={isActive("/admin/kyc") ? "text-warning fw-bold" : ""}
                >
                  <i className="bi bi-person-vcard me-1"></i> KYC
                </Nav.Link>
              </>
            )}

            {/* 🏢 ORGANIZATION ROUTES */}
            {isOrg && (
              <>
                <div className="vr d-none d-lg-block mx-2 text-primary opacity-25"></div>
                <Nav.Link
                  as={Link}
                  to="/organization/home"
                  className={
                    isActive("/organization/home") ? "text-warning fw-bold" : ""
                  }
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/organization/post-job"
                  className={
                    isActive("/organization/post-job")
                      ? "text-warning fw-bold"
                      : ""
                  }
                >
                  Post Job
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/organization/applications"
                  className={
                    isActive("/organization/applications")
                      ? "text-warning fw-bold"
                      : ""
                  }
                >
                  Applicants
                </Nav.Link>

                <Nav.Link as={Link} to="/organization/contracts"
                  className={isActive("/organization/contracts") ? "text-warning fw-bold" : ""}>
                  Contracts
                </Nav.Link>

                <Nav.Link
                  as={Link}
                  to="/organization/payments"
                  className={
                    isActive("/organization/payments")
                      ? "text-warning fw-bold"
                      : ""
                  }
                >
                  Payments
                </Nav.Link>
              </>
            )}

            {/* 👷 WORKER ROUTES */}
{isWorker && (
  <>
    <div className="vr d-none d-lg-block mx-2 text-info opacity-25"></div>

    <Nav.Link
      as={Link}
      to="/worker/dashboard"
      className={isActive("/worker/dashboard") ? "text-warning fw-bold" : ""}
    >
      Dashboard
    </Nav.Link>

    <Nav.Link
      as={Link}
      to="/worker/find-jobs"
      className={isActive("/worker/find-jobs") ? "text-warning fw-bold" : ""}
    >
      Find Jobs
    </Nav.Link>

    <Nav.Link
      as={Link}
      to="/worker/my-applications"
      className={isActive("/worker/my-applications") ? "text-warning fw-bold" : ""}
    >
      Applications
    </Nav.Link>

    <Nav.Link
      as={Link}
      to="/worker/contracts"
      className={isActive("/worker/contracts") ? "text-warning fw-bold" : ""}
    >
      Contracts
    </Nav.Link>

    <Nav.Link
      as={Link}
      to="/worker/active-jobs"
      className={isActive("/worker/active-jobs") ? "text-warning fw-bold" : ""}
    >
      Active Work
    </Nav.Link>

    {/* ✅ Compact Dropdown */}
    {/* <NavDropdown
      title={
        <>
          <i className="bi bi-grid-3x3-gap me-1"></i> Resources
        </>
      }
      id="worker-resources-dropdown"
      className={
        isActive("/worker/store") ||
        isActive("/worker/wallet") ||
        isActive("/worker/my-orders")
          ? "text-warning fw-bold"
          : ""
      }
    >
      <NavDropdown.Item
        as={Link}
        to="/worker/store"
        active={isActive("/worker/store")}
      >
        <i className="bi bi-shop me-2"></i> Equipment Store
      </NavDropdown.Item>

      <NavDropdown.Item
        as={Link}
        to="/worker/wallet"
        active={isActive("/worker/wallet")}
      >
        <i className="bi bi-wallet2 me-2"></i> Wallet
      </NavDropdown.Item>

      <NavDropdown.Item
        as={Link}
        to="/worker/my-orders"
        active={isActive("/worker/my-orders")}
      >
        <i className="bi bi-bag-check me-2"></i> My Orders
      </NavDropdown.Item>
    </NavDropdown> */}
  </>
)}


            {/* 🤝 CLIENT ROUTES */}
            {isClient && (
              <>
                <div className="vr d-none d-lg-block mx-2 text-success opacity-25"></div>
                <Nav.Link
                  as={Link}
                  to="/client/dashboard"
                  className={
                    isActive("/client/dashboard") ? "text-warning fw-bold" : ""
                  }
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/client/post-job"
                  className={
                    isActive("/client/post-job") ? "text-warning fw-bold" : ""
                  }
                >
                  Post Job
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/client/my-jobs"
                  className={
                    isActive("/client/my-jobs") ? "text-warning fw-bold" : ""
                  }
                >
                  My Postings
                </Nav.Link>

                <Nav.Link as={Link} to="/client/applications" className={isActive("/client/applications") ? "text-warning fw-bold" : ""}>Applications</Nav.Link>


                {/* <Nav.Link
                  as={Link}
                  to="/client/contracts"
                  className={
                    isActive("/client/contracts") ? "text-warning fw-bold" : ""
                  }
                >
                  Contracts
                </Nav.Link> */}
              </>
            )}
          </Nav>

          {/* ✅ GLOBAL ACCOUNT ACTIONS */}
          <Nav className="align-items-center gap-3">
            {!token ? (
              <Button
                as={Link}
                to="/login"
                variant="warning"
                className="rounded-pill px-4 fw-bold border-0 shadow-sm"
                style={{ color: "#000" }}
              >
                Login
              </Button>
            ) : (
              <>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="transparent"
                    className="p-0 border-0 no-caret"
                  >
                    <i className="bi bi-bell-fill fs-5 text-white-50"></i>
                    {notifications.length > 0 && (
                      <Badge
                        pill
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: "0.5rem" }}
                      >
                        {notifications.length}
                      </Badge>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="dropdown-menu-dark shadow border-0 mt-3"
                    style={{ background: "#1e293b" }}
                  >
                    <div className="p-2 px-3 small fw-bold border-bottom border-secondary text-white-50">
                      System Alerts
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <Dropdown.Item key={n.id} className="small py-2">
                          {n.message}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <div className="p-3 text-center text-muted small">
                        No new updates
                      </div>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <NavDropdown
                  title={
                    <span className="text-white">
                      <i
                        className={`bi ${isAdmin ? "bi-shield-lock-fill text-warning" : isOrg ? "bi-building text-info" : "bi-person-circle text-warning"} me-2`}
                      ></i>
                      {name || "Account"}
                    </span>
                  }
                  align="end"
                >
                  <NavDropdown.Item
                    as={Link}
                    to={
                      isAdmin
                        ? "/admin/settings"
                        : isOrg
                          ? "/organization/profile"
                          : isWorker
                            ? "/worker/profile"
                            : "/client/profile"
                    }
                  >
                    Security & Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="text-danger fw-bold"
                  >
                    <i className="bi bi-power me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style>{`.no-caret::after { display: none !important; }`}</style>
    </Navbar>
  );
};

export default AppNavbar;
