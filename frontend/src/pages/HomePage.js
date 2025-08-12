// File: frontend/src/pages/HomePage.js (Final, Complete, and Workable Version)

import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
  ProgressBar,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import BackgroundImage from "../assets/images/homepage-bg.jpg";

// Helper component for the clickable glass-style cards with the corrected progress bar
const StatCard = ({ title, icon, percentage = 0 }) => (
  <Link
    to={`/practice?category=${title.split(" ")[0]}`}
    className="text-decoration-none h-100 d-block"
  >
    <Card
      className="text-white text-center h-100"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 150, 255, 0.5)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Card.Body className="d-flex flex-column justify-content-between p-4">
        <div>
          <div className="fs-3 mb-3">{icon}</div>
          <Card.Title className="fw-bold fs-4">{title}</Card.Title>
        </div>
        <div className="mt-4">
          <div className="d-flex align-items-center">
            <ProgressBar
              now={percentage}
              variant="warning"
              style={{ height: "8px", flexGrow: 1 }}
            />
            <span className="fw-bold ms-3">{percentage}%</span>
          </div>
          <small className="text-white-50 mt-2 d-block">Completed</small>
        </div>
      </Card.Body>
    </Card>
  </Link>
);

// Footer Component
const Footer = () => (
  <footer className="bg-transparent text-white-50 text-center py-3 mt-auto">
    <Container>
      <p className="mb-0">&copy; 2025 AceTheApti. All Rights Reserved.</p>
    </Container>
  </footer>
);

const HomePage = () => {
  const { user, logout, loading: userLoading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!userLoading && user && user.token) {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get("/api/users/stats", config);
          setStats(data.stats);
        } catch (error) {
          console.error("Could not fetch user stats", error);
        }
      }
    };
    fetchUserStats();
  }, [user, userLoading]);

  const pageStyle = {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  const ProfileDropdown = () => {
    const profileIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="currentColor"
        className="bi bi-person-circle text-white"
        viewBox="0 0 16 16"
      >
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path
          fillRule="evenodd"
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
        />
      </svg>
    );
    return (
      <NavDropdown
        title={profileIcon}
        id="profile-dropdown"
        align="end"
        menuVariant="dark"
      >
        {user ? (
          <>
            <NavDropdown.Item as={Link} to="/profile">
              Profile
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </NavDropdown.Item>
          </>
        ) : (
          <NavDropdown.Item as={Link} to="/login">
            Login
          </NavDropdown.Item>
        )}
      </NavDropdown>
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={pageStyle}>
      <Navbar bg="transparent" variant="dark" className="px-4">
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-4 text-success me-auto"
          >
            AceTheApti
          </Navbar.Brand>
          <Nav className="align-items-center">
            {user && (
              <Nav.Item className="text-warning fw-bold me-3">
                💰 Coins: {user.coins}
              </Nav.Item>
            )}
            <ProfileDropdown />
          </Nav>
        </Container>
      </Navbar>

      <Container className="d-flex flex-column justify-content-center text-white text-center flex-grow-1">
        <div className="my-5">
          <h1
            className="display-2 fw-bolder"
            style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}
          >
            Conquer Aptitude, Unlock Your Potential
          </h1>
          <p className="lead text-white-50 my-4">
            The ultimate gamified platform to master your skills.
          </p>
          <Button
            as={Link}
            to="/practice"
            size="lg"
            variant="success"
            className="fw-bold px-5 py-3"
          >
            Start Practicing Now
          </Button>
        </div>

        {user && (
          <Row className="my-5">
            <Col md={4} className="mb-4">
              <StatCard
                title="Quantitative Aptitude"
                icon="🧮"
                percentage={stats?.quantitative?.percentage || 0}
              />
            </Col>
            <Col md={4} className="mb-4">
              <StatCard
                title="Logical Reasoning"
                icon="🧠"
                percentage={stats?.logical?.percentage || 0}
              />
            </Col>
            <Col md={4} className="mb-4">
              <StatCard
                title="Verbal Ability"
                icon="🗣️"
                percentage={stats?.verbal?.percentage || 0}
              />
            </Col>
          </Row>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default HomePage;
