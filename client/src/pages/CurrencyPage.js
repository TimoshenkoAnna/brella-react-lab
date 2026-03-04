import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, Form, Alert, Image, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

const API_URL = 'http://localhost:5000/api/currency';

const currencySchema = yup.object().shape({
  code: yup.string().required('Code is required').min(3, 'Code must be at least 3 characters'),
  name: yup.string().required('Name is required'),
  photo: yup.string().url('Must be a valid URL').required('Photo URL is required'),
});

function CurrencyPage() {

  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setCurrencies(response.data.rows); 
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setEditingCurrency(null);
    setAlert(null);
  };
  const handleShowAdd = () => {
    setEditingCurrency(null);
    setShowModal(true);
  };
  const handleShowEdit = (currency) => {
    setEditingCurrency(currency);
    setShowModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (editingCurrency) {
       
        const response = await axios.put(`${API_URL}/${editingCurrency.id}`, values);
        
        setCurrencies(prev => prev.map(item => item.id === editingCurrency.id ? response.data : item));
        setAlert({ variant: 'success', message: 'Currency updated successfully!' });
      } else {
        
        const response = await axios.post(API_URL, values);
        
        setCurrencies(prev => [...prev, response.data]);
        setAlert({ variant: 'success', message: 'Currency added successfully!' });
        resetForm();
      }
      handleClose();
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setAlert({ variant: 'danger', message: msg || 'Failed to save currency.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this currency?')) {
      try {
       
        await axios.delete(`${API_URL}/${id}`);
        
        setCurrencies(prev => prev.filter(item => item.id !== id));
        setAlert({ variant: 'success', message: 'Currency deleted successfully!' });
      } catch (error) {
        const msg = error.response?.data?.message || error.message;
        setAlert({ variant: 'danger', message: msg || 'Failed to delete currency.' });
      }
    }
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Currencies</h1>
      {alert && <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>{alert.message}</Alert>}
      <Button variant="primary" onClick={handleShowAdd} className="mb-3">Add New Currency</Button>

      {loading && <div className="text-center"><Spinner animation="border" /> <p>Loading...</p></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      
      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currencies.map((currency) => (
              <tr key={currency.id}>
                <td>{currency.id}</td>
                <td>{currency.code}</td>
                <td>{currency.name}</td>
                <td><Image src={currency.photo} thumbnail style={{width: '50px'}} /></td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEdit(currency)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(currency.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCurrency ? 'Edit Currency' : 'Add New Currency'}</Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={currencySchema}
          onSubmit={handleSubmit}
          initialValues={editingCurrency || { code: '', name: '', photo: '' }}
        >
          {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="currencyCode">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={values.code}
                    onChange={handleChange}
                    isInvalid={!!errors.code && touched.code}
                  />
                  <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="currencyName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name && touched.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="currencyPhoto">
                  <Form.Label>Photo URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="photo"
                    value={values.photo}
                    onChange={handleChange}
                    isInvalid={!!errors.photo && touched.photo}
                  />
                  <Form.Control.Feedback type="invalid">{errors.photo}</Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </Container>
  );
}
export default CurrencyPage;