import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Button, Modal, Form, Image, Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';

import ProductCard from '../components/ProductCard/ProductCard.js';
import { addProduct, deleteProduct, updateProduct, selectAllProducts } from '../features/products/productsSlice';
import { setSearchTerm, setSortOrder, openModal, closeModal } from '../features/ui/uiSlice';

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

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const products = useSelector(selectAllProducts);
  const { searchTerm, sortOrder, modal } = useSelector((state) => state.ui);
  
  const [selectedIds, setSelectedIds] = useState([]);

  const handleClose = () => dispatch(closeModal());
  const handleViewDetails = (product) => dispatch(openModal({ type: 'view', data: product }));
  const handleOpenAddModal = () => dispatch(openModal({ type: 'add', data: { name: '', type: '', description: '', price: '', image: '%PUBLIC_URL%/images/new-item.jpg', status: 'in_stock' } }));
  const handleOpenEditModal = (product) => dispatch(openModal({ type: 'edit', data: product }));
  const handleDeleteProduct = (productId) => { if (window.confirm('Вы уверены?')) { dispatch(deleteProduct(productId)); } };
  
  const handleSaveProduct = (productToSave) => {
    if (modal.type === 'add') {
      dispatch(addProduct(productToSave));
    } else if (modal.type === 'edit') {
      dispatch(updateProduct(productToSave));
    }
    handleClose();
  };

  const handleSelectProduct = (productId) => {
    setSelectedIds(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };
  
  const processedProducts = [...products]
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'price_asc') { return a.price - b.price; }
      if (sortOrder === 'price_desc') { return b.price - a.price; }
      return 0;
    });

  return (
    <div>
      <Row className="mb-4 align-items-center gy-3">
        <Col md={4}>
           <h2 className="mb-0">{t('catalog_page.title')}</h2>
            <p className="text-muted mb-0">Найдено: {processedProducts.length} | Выбрано: {selectedIds.length}</p>
        </Col>
        <Col md={5}>
          <Form.Control 
            type="text"
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </Col>
        <Col md={3} className="d-flex justify-content-end gap-2">
          <DropdownButton id="dropdown-basic-button" title="Сортировка" variant="outline-secondary" size="sm">
            <Dropdown.Item onClick={() => dispatch(setSortOrder('default'))}>По умолчанию</Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(setSortOrder('price_asc'))}>Сначала дешевле</Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(setSortOrder('price_desc'))}>Сначала дороже</Dropdown.Item>
          </DropdownButton>
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add-product">Создать новый товар</Tooltip>}>
            <Button variant="success" size="sm" onClick={handleOpenAddModal}>+ Добавить</Button>
          </OverlayTrigger>
        </Col>
      </Row>

      <Row>
        {processedProducts.map(product => (
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
      
      {modal.data && (
        <Modal show={modal.isOpen} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              { {'view': 'Подробная информация', 'edit': 'Редактирование товара', 'add': 'Добавление товара'}[modal.type] }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modal.type === 'view' ? 
              <ProductDetails product={modal.data} /> :
              <ProductForm 
                product={modal.data} 
                onSave={handleSaveProduct}
              />
            }
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default CatalogPage;