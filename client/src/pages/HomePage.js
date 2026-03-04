import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <Container className="text-center my-5 p-5 bg-light rounded shadow-sm"> {}
      <h1 className="display-4 fw-bold mb-3">Welcome to Currency Exchange App!</h1> {}
      <p className="lead mb-4">Manage your currencies, exchange rates, and transactions efficiently.</p> {}
      <p>
        <Link to="/currencies" className="text-decoration-none"> {}
          <Button variant="primary" size="lg" className="me-2 mb-2">View Currencies</Button> {}
        </Link>
        <Link to="/rates" className="text-decoration-none">
          <Button variant="secondary" size="lg" className="me-2 mb-2">View Rates</Button>
        </Link>
        <Link to="/transactions" className="text-decoration-none">
          <Button variant="info" size="lg" className="mb-2">View Transactions</Button>
        </Link>
      </p>
    </Container>
  );
}
export default HomePage;