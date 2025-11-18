import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img className="product-card-image" src={product.image} alt={product.name} />
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">{product.price} BYN</p>
        <button className="product-card-button">
          Подробнее
        </button>
      </div>
    </div>
  );
}

export default ProductCard;