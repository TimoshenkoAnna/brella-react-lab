import { Col, Card } from 'react-bootstrap';
import './ProductCard.css';

function ProductCard({ product, onViewDetails, onDelete, onSelect, isSelected, onEdit }) {
  const cardClasses = isSelected ? 'border-primary border-2' : '';

  return (
    <Col md={6} lg={4} className="mb-4">
      <Card className={`${cardClasses} h-100`} onClick={() => onSelect(product.id)}>
        <Card.Img 
          variant="top" 
          src={product.image.replace('%PUBLIC_URL%', process.env.PUBLIC_URL)} 
          className="product-card-image"
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{product.name}</Card.Title>
          <Card.Text className="text-muted">{product.type}</Card.Text>
          
          <div className="mt-auto">
            <Card.Text as="h5" className="mb-3">{product.price} BYN</Card.Text>
            {/* Старые кнопки и стили пока остаются без изменений */}
            <div className="product-card-actions">
              <button className="product-card-button details" onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}>
                Подробнее
              </button>
              <button className="product-card-button edit" onClick={(e) => { e.stopPropagation(); onEdit(product); }}>
                Изменить
              </button>
              <button className="product-card-button delete" onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>
                Удалить
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ProductCard;