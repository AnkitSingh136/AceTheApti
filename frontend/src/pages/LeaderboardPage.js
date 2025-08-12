import React from "react";
import { Container, Table, Image, Button, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

// Mock data - later this will come from your backend
const topPlayers = [
  {
    rank: 1,
    name: "Ankit Singh",
    score: 9850,
    avatar: "https://i.pravatar.cc/40?u=1",
  },
  {
    rank: 2,
    name: "Priya Sharma",
    score: 9500,
    avatar: "https://i.pravatar.cc/40?u=2",
  },
  {
    rank: 3,
    name: "Rahul Verma",
    score: 9200,
    avatar: "https://i.pravatar.cc/40?u=3",
  },
  {
    rank: 4,
    name: "Sneha Patel",
    score: 8900,
    avatar: "https://i.pravatar.cc/40?u=4",
  },
];

const LeaderboardPage = () => {
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
        <h1 className="text-center fw-bolder mb-5">Top Rankers</h1>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th># Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player) => (
              <tr key={player.rank}>
                <td className="fw-bold fs-5">{player.rank}</td>
                <td>
                  <Image src={player.avatar} roundedCircle className="me-3" />
                  {player.name}
                </td>
                <td className="fw-bold fs-5 text-success">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default LeaderboardPage;
