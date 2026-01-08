import { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Form, Image } from 'react-bootstrap';
import ProductCard from '../components/ProductCard/ProductCard.js';
import initialProducts from '../data/products.json';

const emptyProduct = {
  name: '',
  type: '',
  description: '',
  price: '',
  image: '%PUBLIC_URL%/images/new-item.jpg'
};

const ProductDetails = ({ product }) => (
  <Row>
    <Col md={6}>
      <Image src={product.image.replace('%PUBLIC_URL%', process.env.PUBLIC_URL)} fluid rounded />
    </Col>
    <Col md={6} className="d-flex flex-column justify-content-center">
      <h3>{product.name}</h3>
      <p className="text-muted">{product.type}</p>
      <p>{product.description}</p>
      <h4 className="mt-3">Цена: {product.price} BYN</h4>
    </Col>
  </Row>
);

const ProductForm = ({ product, onSave }) => {
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
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3"><Form.Label>Название</Form.Label><Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Тип</Form.Label><Form.Control type="text" name="type" value={formData.type} onChange={handleChange} required /></Form.Group>
      <Form.Group className="mb-3"><Form.Label>Описание</Form.Label><Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required /></Form.Group>
      <Row>
        <Col><Form.Group className="mb-3"><Form.Label>Цена (BYN)</Form.Label><Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required /></Form.Group></Col>
        <Col><Form.Group className="mb-3"><Form.Label>URL изображения</Form.Label><Form.Control type="text" name="image" value={formData.image} onChange={handleChange} required /></Form.Group></Col>
      </Row>
      <div className="d-flex justify-content-end"><Button variant="primary" type="submit">Сохранить</Button></div>
    </Form>
  );
};

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ type: 'view', product: null });
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // <-- НОВАЯ ФУНКЦИЯ: состояние для поиска

  useEffect(() => {
    setProducts(initialProducts);
  }, []);
  
  const handleClose = () => setShowModal(false);
  const handleViewDetails = (product) => { setModalContent({ type: 'view', product }); setShowModal(true); };
  const handleOpenAddModal = () => { setModalContent({ type: 'add', product: { ...emptyProduct } }); setShowModal(true); };
  const handleOpenEditModal = (product) => { setModalContent({ type: 'edit', product }); setShowModal(true); };
  const handleDeleteProduct = (productId) => { if (window.confirm('Вы уверены?')) { setProducts(products.filter(p => p.id !== productId)); } };
  const handleSaveProduct = (productToSave) => {
    if (modalContent.type === 'add') { setProducts([{ ...productToSave, id: Date.now() }, ...products]); } 
    else if (modalContent.type === 'edit') { setProducts(products.map(p => p.id === productToSave.id ? productToSave : p)); }
    handleClose();
  };
  const handleSelectProduct = (productId) => { setSelectedIds(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]); };
  

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Row className="mb-4 align-items-center">
        <Col md={4}>
          <h2>Каталог</h2>
          <p className="text-muted mb-0">Выбрано: {selectedIds.length}</p>
        </Col>
        <Col md={5}>
          {

          }
          <Form.Control 
            type="text"
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3} className="text-end">
          <Button variant="success" onClick={handleOpenAddModal}>+ Добавить товар</Button>
        </Col>
      </Row>

      <Row>
        {
          
        }
        {filteredProducts.map(product => (
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
      
      {modalContent.product && ( <Modal show={showModal} onHide={handleClose} centered size="lg"> <Modal.Header closeButton> <Modal.Title> { {'view': 'Подробная информация', 'edit': 'Редактирование товара', 'add': 'Добавление товара'}[modalContent.type] } </Modal.Title> </Modal.Header> <Modal.Body> {modalContent.type === 'view' ? <ProductDetails product={modalContent.product} /> : <ProductForm product={modalContent.product} onSave={handleSaveProduct} /> } </Modal.Body> </Modal> )}
    </div>
  );
}

export default CatalogPage;