import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Form, Button } from 'react-bootstrap';

function ProductForm({ product, onSave }) {
  const { t, i18n } = useTranslation();

 
  const initialFormData = {
    ...product,
    name: product.i18n?.[i18n.language]?.name || product.i18n?.ru?.name || '',
    type: product.i18n?.[i18n.language]?.type || product.i18n?.ru?.type || '',
    description: product.i18n?.[i18n.language]?.description || product.i18n?.ru?.description || '',
  };
  
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSave = {
      ...formData,
      i18n: {
        ...formData.i18n,
        ru: {
          name: formData.name,
          type: formData.type,
          description: formData.description,
        },
        
        en: formData.i18n?.en ? {
            ...formData.i18n.en,
            name: formData.name,
            type: formData.type,
            description: formData.description,
        } : {
            name: formData.name,
            type: formData.type,
            description: formData.description,
        }
      }
    };
    onSave(dataToSave);
  };

  return (
    <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3"><Form.Label>{t('modal.form_name')}</Form.Label><Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>{t('modal.form_type')}</Form.Label><Form.Control type="text" name="type" value={formData.type} onChange={handleChange} required /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>{t('modal.form_description')}</Form.Label><Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required /></Form.Group>
        <Row>
            <Col><Form.Group className="mb-3"><Form.Label>{t('modal.form_price')}</Form.Label><Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required /></Form.Group></Col>
            <Col><Form.Group className="mb-3"><Form.Label>{t('modal.form_image_url')}</Form.Label><Form.Control type="text" name="image" value={formData.image} onChange={handleChange} required /></Form.Group></Col>
        </Row>
        <div className="d-flex justify-content-end"><Button variant="primary" type="submit">{t('modal.save_button')}</Button></div>
    </Form>
  );
}

export default ProductForm;