import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard.js';
import Modal from '../components/Modal/Modal.js';
import initialProducts from '../data/products.json';
import './CatalogPage.css';

const emptyProduct = {
  name: '',
  type: '',
  description: '',
  price: '',
  image: '%PUBLIC_URL%/images/new-item.jpg'
};

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [modalActive, setModalActive] = useState(false);
  const [modalContent, setModalContent] = useState({ type: 'view', product: null });
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setProducts(initialProducts);
  }, []);

  const handleViewDetails = (product) => {
    setModalContent({ type: 'view', product });
    setModalActive(true);
  };

  const handleOpenAddModal = () => {
    setModalContent({ type: 'add', product: emptyProduct });
    setModalActive(true);
  };

  const handleOpenEditModal = (product) => {
    setModalContent({ type: 'edit', product });
    setModalActive(true);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleSaveProduct = (productToSave) => {
    if (modalContent.type === 'add') {

      const newProduct = { ...productToSave, id: Date.now() };
      setProducts([newProduct, ...products]);
    } else if (modalContent.type === 'edit') {

      setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
    }
    setModalActive(false);
  };

  const handleSelectProduct = (productId) => {
    setSelectedIds(prevSelectedIds =>
      prevSelectedIds.includes(productId)
        ? prevSelectedIds.filter(id => id !== productId)
        : [...prevSelectedIds, productId]
    );
  };

  return (
    <div>
      <h2>Каталог наших работ</h2>
      <button className="add-product-button" onClick={handleOpenAddModal}>
        Добавить новый товар
      </button>

      <div className="catalog-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={handleViewDetails}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteProduct}
            onSelect={handleSelectProduct}
            isSelected={selectedIds.includes(product.id)}
          />
        ))}
      </div>

      <Modal active={modalActive} setActive={setModalActive}>
        {modalContent.product && (
          <>
            {modalContent.type === 'view' && 
              <ProductDetails product={modalContent.product} onClose={() => setModalActive(false)} />
            }
            {(modalContent.type === 'edit' || modalContent.type === 'add') && 
              <ProductForm 
                product={modalContent.product} 
                onSave={handleSaveProduct} 
                onClose={() => setModalActive(false)}
                formType={modalContent.type}
              />
            }
          </>
        )}
      </Modal>
    </div>
  );
}

const ProductDetails = ({ product, onClose }) => (
  <div className="product-details">
    <img className="product-details-image" src={product.image.replace('%PUBLIC_URL%', process.env.PUBLIC_URL)} alt={product.name} />
    <h2>{product.name}</h2>
    <p>{product.description}</p>
    <h3>Цена: {product.price} BYN</h3>
    <button className="modal-close-button" onClick={onClose}>Закрыть</button>
  </div>
);

const ProductForm = ({ product, onSave, onClose, formType }) => {
  const [formData, setFormData] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{formType === 'add' ? 'Добавление товара' : 'Редактирование товара'}</h2>
      <label>
        Название:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Тип:
        <input type="text" name="type" value={formData.type} onChange={handleChange} required />
      </label>
      <label>
        Описание:
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </label>
      <label>
        Цена (BYN):
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      </label>
      <label>
        URL изображения:
        <input type="text" name="image" value={formData.image.replace('%PUBLIC_URL%', process.env.PUBLIC_URL)} onChange={handleChange} required />
      </label>
      <div className="form-buttons">
        <button type="submit" className="form-button save">Сохранить</button>
        <button type="button" className="form-button cancel" onClick={onClose}>Отмена</button>
      </div>
    </form>
  );
};

export default CatalogPage;