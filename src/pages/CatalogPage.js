import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Button, Modal, Form, Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';

import ProductCard from '../components/ProductCard/ProductCard.js';
import ProductDetails from '../components/ProductDetails.js'; 
import ProductForm from '../components/ProductForm.js';   
import { addProduct, deleteProduct, updateProduct, selectAllProducts } from '../features/products/productsSlice';
import { setSearchTerm, setSortOrder, openModal, closeModal } from '../features/ui/uiSlice';

function CatalogPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const products = useSelector(selectAllProducts);
  const { searchTerm, sortOrder, modal } = useSelector((state) => state.ui);
  
  const [selectedIds, setSelectedIds] = useState([]);

  const handleClose = () => dispatch(closeModal());
  const handleViewDetails = (product) => dispatch(openModal({ type: 'view', data: product }));
  const handleOpenAddModal = () => dispatch(openModal({ type: 'add', data: { price: '', image: '%PUBLIC_URL%/images/new-item.jpg', status: 'in_stock', i18n: { ru: { name: '', type: '', description: '' }, en: { name: '', type: '', description: '' } } } }));
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
    .filter(product => {
      const productLocale = product.i18n[i18n.language] || product.i18n.ru;
      return productLocale.name && productLocale.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOrder === 'price_asc') { return a.price - b.price; }
      if (sortOrder === 'price_desc') { return b.price - a.price; }
      return 0;
    });

  const getModalTitle = () => {
      if (modal.type === 'view') return t('modal.view_title');
      if (modal.type === 'edit') return t('modal.edit_title');
      if (modal.type === 'add') return t('modal.add_title');
      return '';
  }

  return (
    <div>
      <Row className="mb-4 align-items-center gy-3">
        <Col md={4}>
            <h2 className="mb-0">{t('catalog_page.title')}</h2>
            <p className="text-muted mb-0">{t('catalog_page.found')}: {processedProducts.length} | {t('catalog_page.selected')}: {selectedIds.length}</p>
        </Col>
        <Col md={5}>
          <Form.Control 
            type="text"
            placeholder={t('catalog_page.search_placeholder')}
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          />
        </Col>
        <Col md={3} className="d-flex justify-content-end gap-2">
          <DropdownButton id="dropdown-basic-button" title={t('catalog_page.sort_button')} variant="outline-secondary" size="sm">
            <Dropdown.Item onClick={() => dispatch(setSortOrder('default'))}>{t('catalog_page.sort_default')}</Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(setSortOrder('price_asc'))}>{t('catalog_page.sort_price_asc')}</Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(setSortOrder('price_desc'))}>{t('catalog_page.sort_price_desc')}</Dropdown.Item>
          </DropdownButton>
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add-product">{t('catalog_page.add_tooltip')}</Tooltip>}>
            <Button variant="success" size="sm" onClick={handleOpenAddModal}>{t('catalog_page.add_button')}</Button>
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
            <Modal.Title>{getModalTitle()}</Modal.Title>
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