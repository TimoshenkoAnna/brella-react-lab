import { useTranslation } from 'react-i18next';
import { Card, Button, ButtonGroup, Badge } from 'react-bootstrap'; 
import './ProductCard.css';


function ProductCard({ product, onView, onDelete, onSelect, isSelected, onEdit }) {
  const { t, i18n } = useTranslation();
  const cardClasses = isSelected ? 'border-primary border-2' : '';

  const productLocale = product.i18n[i18n.language] || product.i18n.ru;

  return (
    <Card className={`${cardClasses} h-100`} onClick={() => onSelect(product.id)}>
      <Card.Img 
        variant="top" 
        src={product.image.replace('%PUBLIC_URL%', process.env.PUBLIC_URL)} 
        className="product-card-image"
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title>{productLocale.name}</Card.Title>
          <Badge bg={product.status === 'in_stock' ? 'success' : 'warning'}>
            {t(product.status === 'in_stock' ? 'product_card.status_in_stock' : 'product_card.status_on_order')}
          </Badge>
        </div>

        <Card.Text className="text-muted">{productLocale.type}</Card.Text>
        
        <div className="mt-auto">
          <Card.Text as="h5" className="mb-3">{product.price} {t('currency')}</Card.Text>
          
          <ButtonGroup className="w-100">
            {
              
            }
            <Button variant="outline-primary" size="sm" onClick={(e) => { e.stopPropagation(); onView(product); }}>
              {t('product_card.details_button')}
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(product); }}>
              {t('product_card.edit_button')}
            </Button>
            <Button variant="outline-danger" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>
              {t('product_card.delete_button')}
            </Button>
          </ButtonGroup>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;