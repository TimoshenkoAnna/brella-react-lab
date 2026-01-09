import { useTranslation } from 'react-i18next';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, ButtonGroup, Button } from 'react-bootstrap';

function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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
              <Nav.Link>{t('nav.home')}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/catalog">
              <Nav.Link>{t('nav.catalog')}</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>{t('nav.about')}</Nav.Link>
            </LinkContainer>
            <ButtonGroup size="sm" className="ms-3">
              <Button variant={i18n.language === 'ru' ? 'primary' : 'outline-primary'} onClick={() => changeLanguage('ru')}>RU</Button>
              <Button variant={i18n.language === 'en' ? 'primary' : 'outline-primary'} onClick={() => changeLanguage('en')}>EN</Button>
            </ButtonGroup>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;