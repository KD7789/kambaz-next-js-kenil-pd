"use client";

import { Card, Container, ListGroup } from "react-bootstrap";

export default function LandingPage() {
  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h2 className="mb-4 text-danger text-center">
          Quizzes Project – Team Information
        </h2>

        {/* ========== TEAM MEMBERS ========== */}
        <h5 className="text-primary">Team Members (Section 04)</h5>
        <ListGroup className="mb-4">
          <ListGroup.Item>
            <strong>Kenil Prafulbhai Devani</strong> – Section 04
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Dhruhi Suryakant Patel</strong> – Section 04
          </ListGroup.Item>
        </ListGroup>

        {/* ========== GITHUB LINKS ========== */}
        <h5 className="text-primary">Project GitHub Repositories</h5>
        <ListGroup>
          <ListGroup.Item>
            <strong>Frontend Repository:</strong>
            <br />
            <a
              href="https://github.com/KD7789/kambaz-next-js-kenil-pd"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/KD7789/kambaz-next-js-kenil-pd
            </a>
          </ListGroup.Item>

          <ListGroup.Item>
            <strong>Backend Repository:</strong>
            <br />
            <a
              href="https://github.com/KD7789/kambaz-node-server-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/KD7789/kambaz-node-server-app
            </a>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Container>
  );
}