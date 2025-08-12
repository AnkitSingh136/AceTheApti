import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Navbar,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "success";
    case "Medium":
      return "warning";
    case "Hard":
      return "danger";
    default:
      return "secondary";
  }
};

const ProblemPage = () => {
  const {
    user,
    updateUserCoins,
    loading: userLoading,
  } = useContext(AuthContext);
  const { slug } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [navigation, setNavigation] = useState({ prev: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [correctAnswerId, setCorrectAnswerId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    setProblem(null);
    setNavigation({ prev: null, next: null });
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setFeedbackMessage("");
    setCorrectAnswerId(null);

    if (!userLoading && !user) {
      navigate("/login");
      return;
    }

    const fetchProblem = async () => {
      try {
        const { data } = await axios.get(`/api/practice/problems/${slug}`);
        setProblem(data.problem);
        setNavigation(data.navigation);
      } catch (err) {
        setError("Could not find this problem.");
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user) {
      fetchProblem();
    }
  }, [slug, user, userLoading, navigate]);

  const handleAnswerSubmit = async () => {
    if (!selectedOptionId || !user || !user.token) return;
    setIsSubmitted(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        "/api/practice/submit",
        {
          questionId: problem._id,
          answerId: selectedOptionId,
        },
        config
      );
      setFeedbackMessage(data.message);
      setCorrectAnswerId(data.correctAnswerId);
      if (data.newCoinTotal !== undefined) {
        updateUserCoins(data.newCoinTotal);
      }
    } catch (err) {
      setFeedbackMessage(err.response?.data?.message || "An error occurred.");
    }
  };

  const getOptionVariant = (optionId) => {
    if (!isSubmitted)
      return selectedOptionId === optionId ? "primary" : "outline-light";
    if (optionId === correctAnswerId) return "success";
    if (optionId === selectedOptionId && optionId !== correctAnswerId)
      return "danger";
    return "outline-light";
  };

  if (userLoading) {
    return (
      <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div
      className="bg-dark min-vh-100 text-white"
      style={{ backgroundColor: "#1d222e" }}
    >
      <Navbar bg="dark" variant="dark" className="px-4 shadow-sm">
        <Navbar.Brand
          as={Link}
          to="/practice"
          className="fw-bold fs-4 text-primary"
        >
          ← Back to Problems
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          {user && (
            <span className="text-warning fw-bold me-3">
              💰 Coins: {user.coins}
            </span>
          )}
        </Nav>
      </Navbar>

      <Container className="py-5">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="light" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : problem ? (
          <>
            <Row className="justify-content-center mb-4">
              <Col
                md={10}
                lg={8}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <Badge bg="secondary" className="me-2">
                    {problem.category}
                  </Badge>
                  <Badge bg={getDifficultyBadge(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </div>
                <div className="fw-bold text-success fs-5">
                  Reward: +
                  {problem.difficulty === "Easy"
                    ? 10
                    : problem.difficulty === "Medium"
                    ? 15
                    : 25}{" "}
                  Coins
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={10} lg={8}>
                <Card className="bg-secondary">
                  <Card.Body className="p-4 p-md-5">
                    <Card.Title as="h2" className="mb-4">
                      {problem.title}
                    </Card.Title>
                    <Card.Text
                      style={{ whiteSpace: "pre-wrap" }}
                      className="mb-4 fs-5"
                    >
                      {problem.questionText}
                    </Card.Text>
                    <hr />
                    <div className="d-grid gap-3">
                      {problem.options.map((option) => (
                        <Button
                          key={option._id}
                          variant={getOptionVariant(option._id)}
                          // --- THIS IS THE MODIFIED LINE ---
                          onClick={() => {
                            console.log(
                              "Option clicked. The captured ID is:",
                              option._id
                            );
                            setSelectedOptionId(option._id);
                          }}
                          disabled={isSubmitted}
                          size="lg"
                        >
                          {option.text}
                        </Button>
                      ))}
                    </div>
                    <Button
                      className="mt-4 w-100 fw-bold"
                      variant="primary"
                      onClick={handleAnswerSubmit}
                      disabled={!selectedOptionId || isSubmitted}
                      size="lg"
                    >
                      Submit
                    </Button>
                    {isSubmitted && (
                      <Alert
                        variant={
                          feedbackMessage.includes("Correct")
                            ? "success"
                            : "danger"
                        }
                        className="mt-4"
                      >
                        {feedbackMessage}
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="justify-content-center mt-4">
              <Col md={10} lg={8} className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  disabled={!navigation.prev}
                  onClick={() => navigate(`/problems/${navigation.prev}`)}
                >
                  &lt;&lt; Previous Problem
                </Button>
                <Button
                  variant="outline-secondary"
                  disabled={!navigation.next}
                  onClick={() => navigate(`/problems/${navigation.next}`)}
                >
                  Next Problem &gt;&gt;
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <Alert variant="warning">No problem found.</Alert>
        )}
      </Container>
    </div>
  );
};

export default ProblemPage;
