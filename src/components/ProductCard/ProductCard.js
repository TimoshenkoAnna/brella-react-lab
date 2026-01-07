import { Col, Card, Button } from 'react-bootstrap';
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
            
            <div className="product-card-actions">
              <Button variant="outline-primary" size="sm" className="w-100" onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}>
                Подробнее
              </Button>
              <Button variant="outline-secondary" size="sm" className="w-100" onClick={(e) => { e.stopPropagation(); onEdit(product); }}>
                Изменить
              </Button>
              <Button variant="outline-danger" size="sm" className="w-100" onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>
                Удалить
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ProductCard;