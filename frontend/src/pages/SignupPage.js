// File: frontend/src/pages/SignupPage.js (Corrected Version)

import React, { useState } from "react";
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

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      console.log(res.data);
      setLoading(false);
      navigate("/login");
    } catch (err) {
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
                <h2 className="text-center fw-bold mb-4">Create Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      name="name"
                      value={name}
                      onChange={onChange}
                      required
                    />
                  </Form.Group>
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
                      minLength="6"
                      required
                    />
                  </Form.Group>{" "}
                  {/* <-- THIS IS THE CORRECTED LINE */}
                  <Button
                    variant="success"
                    type="submit"
                    className="w-100 fw-bold mt-3"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </Form>
                <p className="text-center text-white-50 mt-3">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary fw-bold">
                    Login
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

export default SignupPage;
