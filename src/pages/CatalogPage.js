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

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(), 
      name: "Новинка",
      type: "Одежда",
      description: "Это новый товар, добавленный для демонстрации работы со state.",
      price: 199,
      image: "https://images.unsplash.com/photo-1611312449412-6cefac5dc2d0?q=80&w=600"
    };
    setProducts([newProduct, ...products]);
  };

  return (
    <div>
      <h2>Каталог наших работ</h2>

      {}
      <button className="add-product-button" onClick={handleAddProduct}>
        Добавить новый товар
      </button>
      {}

      <div className="catalog-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={handleViewDetails}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>

      <Modal active={modalActive} setActive={setModalActive}>
        {selectedProduct && (
           <div className="product-details">
             <img className="product-details-image" src={selectedProduct.image} alt={selectedProduct.name} />
             <h2>{selectedProduct.name}</h2>
             <p>{selectedProduct.description}</p>
             <h3>Цена: {selectedProduct.price} BYN</h3>
             <button className="modal-close-button" onClick={() => setModalActive(false)}>Закрыть</button>
           </div>
         )}
      </Modal>
    </div>
  );
}

export default CatalogPage;