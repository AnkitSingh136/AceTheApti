import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Import our AuthContext

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get the login function from our context

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send the email and password to the backend login endpoint
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // Use the login function from our context to save the user's data globally
      login(res.data);

      setLoading(false);
      navigate("/"); // On successful login, redirect to the homepage
    } catch (err) {
      // If the backend sends an error (e.g., "Invalid credentials"), display it
      setError(err.response.data.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card bg="secondary" text="white" className="p-4">
              <Card.Body>
                <h2 className="text-center fw-bold mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 fw-bold mt-3"
                    disabled={loading}
                  >
                    {loading ? "Logging In..." : "Login"}
                  </Button>
                </Form>
                <p className="text-center text-white-50 mt-3">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary fw-bold">
                    Sign Up
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
