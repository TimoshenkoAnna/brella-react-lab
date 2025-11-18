import './ProductCard.css';

function ProductCard({ product, onViewDetails, onDelete, onSelect, isSelected }) {

  const cardClasses = `product-card ${isSelected ? 'selected' : ''}`;

  return (
   
    <div className={cardClasses} onClick={() => onSelect(product.id)}>
      <img className="product-card-image" src={product.image} alt={product.name} />
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">{product.price} BYN</p>
        <div className="product-card-actions">
          {

          }
          <button className="product-card-button details" onClick={(e) => { e.stopPropagation(); onViewDetails(product); }}>
            Подробнее
          </button>
          <button className="product-card-button delete" onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;