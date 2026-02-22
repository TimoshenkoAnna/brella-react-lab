import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Button, Modal, Form, Image, Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';

import ProductCard from '../components/ProductCard/ProductCard.js';
import ProductDetails from '../components/ProductDetails.js';
import ProductForm from '../components/ProductForm.js';

import { fetchProducts, addNewProduct, deleteProductById, updateProduct } from '../features/products/productsSlice';
import { selectAllProducts, getProductsStatus } from '../features/products/productsSlice';
import { openModal, closeModal } from '../features/ui/uiSlice';

const downloadFile = async (format) => {
    try {
        const response = await fetch(`http://localhost:5000/api/products/export`, {
            headers: { 'Accept': format === 'html' ? `text/html` : `application/${format}` }
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Ошибка при скачивании файла:", error);
    }
}

function CatalogPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const products = useSelector(selectAllProducts);
  const productsStatus = useSelector(getProductsStatus);
  const { modal } = useSelector((state) => state.ui);
  
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productsStatus, dispatch]);
  
  const handleClose = () => dispatch(closeModal());
  const handleViewDetails = (product) => dispatch(openModal({ type: 'view', data: product }));
  const handleOpenAddModal = () => dispatch(openModal({ type: 'add', data: { i18n: { ru: {}, en: {} } } }));
  const handleOpenEditModal = (product) => dispatch(openModal({ type: 'edit', data: product }));
  
  const handleDeleteProduct = (productId) => { 
    if (window.confirm('Вы уверены?')) { 
      dispatch(deleteProductById(productId)); 
    } 
  };
  
  const handleSaveProduct = (productToSave) => {
    if (modal.type === 'add') {
      dispatch(addNewProduct(productToSave));
    } else if (modal.type === 'edit') {
      dispatch(updateProduct(productToSave));
    }
    handleClose();
  };
  
  const handleSelectProduct = (productId) => {
    setSelectedIds(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const getModalTitle = () => {
    if (modal.type === 'view') return t('modal.view_title');
    if (modal.type === 'edit') return t('modal.edit_title');
    if (modal.type === 'add') return t('modal.add_title');
    return '';
  }

  let content;
  if (productsStatus === 'loading') {
    content = <Col><p>"Загрузка товаров..."</p></Col>;
  } else if (productsStatus === 'succeeded') {
   
    content = products.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        onViewDetails={handleViewDetails}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteProduct}
        onSelect={handleSelectProduct}
        isSelected={selectedIds.includes(product.id)}
      />
    ));
  } else if (productsStatus === 'failed') {
      content = <Col><p>Ошибка загрузки товаров.</p></Col>
  }

  return (
    <div>
      <Row className="mb-4 align-items-center gy-3">
        <Col md={4}><h2 className="mb-0">{t('catalog_page.title')}</h2></Col>
        <Col md={8} className="d-flex justify-content-end gap-2">
            <Button variant="info" size="sm" onClick={() => downloadFile('json')}>Скачать JSON</Button>
            <Button variant="info" size="sm" onClick={() => downloadFile('xml')}>Скачать XML</Button>
            <Button variant="info" size="sm" onClick={() => downloadFile('html')}>Скачать HTML</Button>
            <Button variant="success" size="sm" onClick={handleOpenAddModal}>{t('catalog_page.add_button')}</Button>
        </Col>
      </Row>

      <Row>{content}</Row>
      
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