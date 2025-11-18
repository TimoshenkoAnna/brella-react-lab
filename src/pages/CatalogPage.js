import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard.js';
import Modal from '../components/Modal/Modal.js'; 
import initialProducts from '../data/products.json';
import './CatalogPage.css';

function CatalogPage() {
  const [products, setProducts] = useState([]);

  const [modalActive, setModalActive] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

  useEffect(() => {
    setProducts(initialProducts);
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product); 
    setModalActive(true);       
  };

  return (
    <div>
      <h2>Каталог наших работ</h2>
      <div className="catalog-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={handleViewDetails} 
          />
        ))}
      </div>

      {}
      <Modal active={modalActive} setActive={setModalActive}>
        {}
        {selectedProduct && (
          <div className="product-details">
            <img className="product-details-image" src={selectedProduct.image} alt={selectedProduct.name} />
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.description}</p>
            <h3>Цена: {selectedProduct.price} BYN</h3>
            {}
            <button className="modal-close-button" onClick={() => setModalActive(false)}>Закрыть</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CatalogPage;