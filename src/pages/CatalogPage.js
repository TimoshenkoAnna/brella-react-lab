import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import ProductCard from '../components/ProductCard/ProductCard.js';
import ProductDetails from '../components/ProductDetails.js';
import ProductForm from '../components/ProductForm.js';
import { fetchProducts, addNewProduct, deleteProductById, updateProduct } from '../features/products/productsSlice';
import { selectAllProducts, getProductsStatus, getProductsError } from '../features/products/productsSlice';
import { openModal, closeModal } from '../features/ui/uiSlice';

const downloadFile = async (format) => {
    try {
        const response = await fetch(`http://localhost:5000/api/products/export`, {
            headers: { 'Accept': format === 'html' ? 'text/html' : `application/${format}` }
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
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const products = useSelector(selectAllProducts);
    const productsStatus = useSelector(getProductsStatus);
    const error = useSelector(getProductsError);
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
        content = <p>Загрузка товаров...</p>;
    } else if (productsStatus === 'succeeded') {
        
        if (Array.isArray(products) && products.length > 0) {
            content = products.map(product => (
              
    <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
        <ProductCard
            product={product}
            onView={handleViewDetails}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteProduct}
            onSelect={handleSelectProduct}
            isSelected={selectedIds.includes(product.id)}
        />
    </Col>
));
        } else {
            content = <p>В каталоге пока нет товаров. Добавьте первый!</p>;
        }
    } else if (productsStatus === 'failed') {
        content = <p>Ошибка загрузки товаров: {error}</p>
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{t('catalog_page.title')}</h2>
                <div>
                    <DropdownButton id="dropdown-basic-button" title="Экспорт" variant="secondary" size="sm" className="me-2 d-inline-block">
                        <Dropdown.Item onClick={() => downloadFile('json')}>Скачать JSON</Dropdown.Item>
                        <Dropdown.Item onClick={() => downloadFile('xml')}>Скачать XML</Dropdown.Item>
                        <Dropdown.Item onClick={() => downloadFile('html')}>Скачать HTML</Dropdown.Item>
                    </DropdownButton>
                    <Button variant="primary" onClick={handleOpenAddModal}>{t('catalog_page.add_button')}</Button>
                </div>
            </div>

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