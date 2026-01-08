import { useState, useEffect } from 'react';
import { Row, Button, Modal } from 'react-bootstrap';
import ProductCard from '../components/ProductCard/ProductCard.js';
import initialProducts from '../data/products.json';

const emptyProduct = {
  name: '',
  type: '',
  description: '',
  price: '',
  image: '%PUBLIC_URL%/images/new-item.jpg'
};

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [modalContent, setModalContent] = useState({ type: 'view', product: null });
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setProducts(initialProducts);
  }, []);

  const handleClose = () => setShowModal(false); 

  const handleViewDetails = (product) => {
    setModalContent({ type: 'view', product });
    setShowModal(true);
  };
  
  const handleOpenAddModal = () => {
    setModalContent({ type: 'add', product: { ...emptyProduct } });
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setModalContent({ type: 'edit', product });
    setShowModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleSaveProduct = (productToSave) => {
    if (modalContent.type === 'add') {
      const newProduct = { ...productToSave, id: Date.now() };
      setProducts([newProduct, ...products]);
    } else if (modalContent.type === 'edit') {
      setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
    }
    handleClose();
  };
  
  const handleSelectProduct = (productId) => {
    setSelectedIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Каталог наших работ</h2>
          <p className="text-muted mb-0">Выбрано товаров: {selectedIds.length}</p>
        </div>
        <Button variant="success" onClick={handleOpenAddModal}>
          + Добавить товар
        </Button>
      </div>

      <Row>
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
      </Row>
      
      {modalContent.product && (
        <Modal show={showModal} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {
                {'view': 'Подробная информация', 'edit': 'Редактирование товара', 'add': 'Добавление товара'}[modalContent.type]
              }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Здесь будет контент...</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default CatalogPage;