import { useTranslation } from 'react-i18next';
import { Container, Stack } from 'react-bootstrap';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark text-white mt-auto py-3">
      <Container>
        <Stack direction="horizontal" gap={3} className="justify-content-center">
          <div>{t('footer.copyright')}</div>
          <div className="vr" />
          <div>{t('footer.rights')}</div>
        </Stack>
      </Container>
    </footer>
  );
}

export default Footer;