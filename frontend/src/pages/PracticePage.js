import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Container, Row, Col, Card, Button, Nav, Navbar, Table, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
        case 'Easy': return 'success';
        case 'Medium': return 'warning';
        case 'Hard': return 'danger';
        default: return 'secondary';
    }
};

const PracticePage = () => {
    const { user, loading: userLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const categoryFilter = searchParams.get('category');

    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/login');
        }
    }, [user, userLoading, navigate]);

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                const url = categoryFilter ? `/api/practice/problems?category=${categoryFilter}` : '/api/practice/problems';
                const { data } = await axios.get(url);
                setProblems(data);
            } catch (err) {
                setError('Failed to load problems. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        if (!userLoading && user) {
            fetchProblems();
        }
    }, [categoryFilter, user, userLoading]);

    const searchedProblems = useMemo(() => {
        return problems.filter(p =>
            p && p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [problems, searchTerm]);

    if (userLoading) {
        return <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="light" /></div>;
    }

    return (
        <div className="bg-dark min-vh-100 text-white">
            <Navbar bg="dark" variant="dark" className="px-4 shadow-sm">
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-success">AceTheApti</Navbar.Brand>
                <Nav className="ms-auto align-items-center">
                    {user && <span className="text-warning fw-bold me-3">💰 Coins: {user.coins}</span>}
                    <Button as={Link} to="/" variant="outline-light">Back to Home</Button>
                </Nav>
            </Navbar>

            <Container fluid className="py-4 px-4">
                {/* --- THIS SECTION IS NOW CORRECTED --- */}
                <Row className="mb-4">
                    <Col md={4} className="mb-3">
                        <Card className="bg-secondary p-3">
                            <h4>Top Interview Questions</h4>
                            <p className="text-white-50">Must-do questions for your next interview.</p>
                            <Button variant="primary">Start</Button>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="bg-secondary p-3">
                            <h4>Data Structures Course</h4>
                            <p className="text-white-50">Master the fundamentals of data structures.</p>
                            <Button variant="primary">Start</Button>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="bg-warning text-dark p-3">
                            <h4>30 Days Challenge</h4>
                            <p>Solve one problem a day for 30 days.</p>
                            <Button variant="dark">Start</Button>
                        </Card>
                    </Col>
                </Row>

                <Card className="bg-secondary">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <Form.Control type="text" placeholder="Search questions..." className="bg-dark text-white border-secondary w-50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        {categoryFilter && (
                            <div className="d-flex align-items-center">
                                <Badge bg="primary" className="fs-6 me-3">{categoryFilter}</Badge>
                                <Button variant="light" size="sm" onClick={() => navigate('/practice')}>Show All</Button>
                            </div>
                        )}
                    </Card.Header>
                    <Card.Body className="p-0">
                        {loading ? (
                             <div className="text-center p-5"><Spinner animation="border" variant="light" /></div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : searchedProblems.length > 0 ? (
                            <Table hover variant="dark" className="mb-0" responsive>
                                <thead><tr><th className="ps-3">Status</th><th>Title</th><th>Acceptance</th><th>Difficulty</th></tr></thead>
                                <tbody>
                                    {searchedProblems.map(problem => (
                                        <tr key={problem.slug}>
                                            <td className="ps-3"><Badge bg="success" text="dark">✓</Badge></td>
                                            <td><Link to={`/problems/${problem.slug}`} className="text-white text-decoration-none">{problem.title}</Link></td>
                                            <td>{problem.acceptance}</td>
                                            <td><Badge bg={getDifficultyBadge(problem.difficulty)}>{problem.difficulty}</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center p-5">
                                <h4>No Problems Found</h4>
                                <p className="text-white-50">There are no problems matching the current filters.</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default PracticePage;