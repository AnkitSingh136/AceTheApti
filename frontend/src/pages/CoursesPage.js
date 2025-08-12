import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";
import { Link } from "react-router-dom";

// Mock data
const courses = [
  {
    title: "Complete Aptitude Mastery",
    price: "₹499",
    image: "https://via.placeholder.com/300x200.png?text=Aptitude",
  },
  {
    title: "Advanced Data Interpretation",
    price: "₹299",
    image: "https://via.placeholder.com/300x200.png?text=Data",
  },
  {
    title: "Verbal Ability Bootcamp",
    price: "₹299",
    image: "https://via.placeholder.com/300x200.png?text=Verbal",
  },
];

const CoursesPage = () => {
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
        <h1 className="text-center fw-bolder mb-5">Our Courses</h1>
        <Row>
          {courses.map((course, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="bg-secondary text-white h-100">
                <Card.Img variant="top" src={course.image} />
                <Card.Body>
                  <Card.Title className="fw-bold">{course.title}</Card.Title>
                  <Card.Text className="fs-4 fw-bold text-success my-3">
                    {course.price}
                  </Card.Text>
                  <Button variant="primary" className="w-100 fw-bold">
                    Enroll Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default CoursesPage;
