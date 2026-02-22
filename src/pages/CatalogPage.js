import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Button, DropdownButton, OverlayTrigger, Tooltip, Form, Modal } from 'react-bootstrap';

import ProductCard from '../components/ProductCard/ProductCard.js';
import ProductDetails from '../components/ProductDetails.js';
import ProductForm from '../components/ProductForm.js';

import { fetchProducts, addNewProduct, deleteProductById } from '../features/products/productsSlice';
import { selectAllProducts, getProductsStatus } from '../features/products/productsSlice';
import { setSearchTerm, setSortOrder, openModal, closeModal } from '../features/ui/uiSlice';

const downloadFile = async (format) => {
    const response = await fetch('http://localhost:5000/api/products/export', {
        headers: { 'Accept': `application/${format}` }
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function CatalogPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const products = useSelector(selectAllProducts);
  const productsStatus = useSelector(getProductsStatus);
  const { searchTerm, sortOrder, modal } = useSelector((state) => state.ui);
  
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
    }
    handleClose();
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

  let content;
  if (productsStatus === 'loading') {
    content = <p>"Загрузка товаров..."</p>;
  } else if (productsStatus === 'succeeded') {
    content = processedProducts.map(product => (
      <ProductCard
        key={product.id}
        product={product}
        onViewDetails={handleViewDetails}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteProduct}
        onSelect={() => {}} 
        isSelected={false}
      />
    ));
  }

  return (
    <div>
      <Row className="mb-4 align-items-center gy-3">
        <Col md={4}><h2 className="mb-0">{t('catalog_page.title')}</h2></Col>
        <Col md={8} className="d-flex justify-content-end gap-2">
            {

            }
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
            {

            }
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