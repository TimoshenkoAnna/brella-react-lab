import './ProductCard.css';

function ProductCard({ product, onViewDetails, onDelete }) {
  return (
    <div className="product-card">
      <img className="product-card-image" src={product.image} alt={product.name} />
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">{product.price} BYN</p>
        <div className="product-card-actions"> {}
          <button className="product-card-button details" onClick={() => onViewDetails(product)}>
            Подробнее
          </button>
          {}
          <button className="product-card-button delete" onClick={() => onDelete(product.id)}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;