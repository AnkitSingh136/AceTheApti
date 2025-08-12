// File: frontend/src/pages/ProfilePage.js
import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, loading: userLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if not logged in
    if (!userLoading && !user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get("/api/users/profile", config);
        setProfileData(data);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, userLoading, navigate]);

  if (loading || userLoading) {
    return (
      <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div className="bg-dark min-vh-100 text-white">
      <Navbar bg="dark" variant="dark" className="px-4">
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-success">
          AceTheApti
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Button as={Link} to="/" variant="outline-light">
            Back to Home
          </Button>
        </Nav>
      </Navbar>
      <Container className="py-5">
        <h1 className="text-center fw-bolder mb-5">My Profile</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {profileData && (
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="bg-secondary text-white">
                <Card.Header className="fs-4 fw-bold">User Details</Card.Header>
                <Card.Body>
                  <p>
                    <strong>Name:</strong> {profileData.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {profileData.email}
                  </p>
                  <p className="fw-bold text-warning">
                    <strong>Coins:</strong> {profileData.coins}
                  </p>
                  <p>
                    <strong>Questions Solved:</strong>{" "}
                    {profileData.solvedQuestions.length}
                  </p>
                  <p>
                    <strong>Test Series Unlocked:</strong>{" "}
                    {profileData.unlockedTestSeries.length}
                  </p>
                  <p>
                    <strong>Member Since:</strong>{" "}
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ProfilePage;
