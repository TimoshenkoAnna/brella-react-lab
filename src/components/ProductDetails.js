import { useTranslation } from 'react-i18next';
import { Row, Col, Image } from 'react-bootstrap';

function ProductDetails({ product }) {
  const { t, i18n } = useTranslation();
  const productLocale = product.i18n[i18n.language] || product.i18n.ru;

  return (
    <Row>
      <Col md={6}>
        <Image src={product.image.replace('%PUBLIC_URL%', process.env.PUBLIC_URL)} fluid rounded />
      </Col>
      <Col md={6} className="d-flex flex-column justify-content-center">
        <h3>{productLocale.name}</h3>
        <p className="text-muted">{productLocale.type}</p>
        <p>{productLocale.description}</p>
        <h4 className="mt-3">{t('modal.price_label')}: {product.price} {t('currency')}</h4>
      </Col>
    </Row>
  );
}

export default ProductDetails;