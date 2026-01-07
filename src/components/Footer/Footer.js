import { Container, Stack } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto py-3">
      <Container>
        <Stack direction="horizontal" gap={3} className="justify-content-center">
          <div>© 2025 Custom Clothes</div>
          <div className="vr" />
          <div>Все права защищены</div>
        </Stack>
      </Container>
    </footer>
  );
}

export default Footer;