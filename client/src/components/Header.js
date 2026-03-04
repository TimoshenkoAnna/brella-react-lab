import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Currency Exchange</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/currencies"><Nav.Link>Currencies</Nav.Link></LinkContainer>
            <LinkContainer to="/rates"><Nav.Link>Rates</Nav.Link></LinkContainer>
            <LinkContainer to="/transactions"><Nav.Link>Transactions</Nav.Link></LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Header;