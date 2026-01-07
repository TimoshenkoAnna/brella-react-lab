import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg="light" expand="lg" sticky="top" collapseOnSelect className="border-bottom">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold">Custom Clothes</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>Главная</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/catalog">
              <Nav.Link>Каталог</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>О нас</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;