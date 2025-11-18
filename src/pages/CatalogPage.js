import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard.js';
import initialProducts from '../data/products.json';
import './CatalogPage.css';

function CatalogPage() {
  
  const [products, setProducts] = useState([]);

  
  useEffect(() => {
    setProducts(initialProducts);
  }, []); 

  return (
    <div>
      <h2>Каталог наших работ</h2>
      <div className="catalog-grid">
        {}
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default CatalogPage;