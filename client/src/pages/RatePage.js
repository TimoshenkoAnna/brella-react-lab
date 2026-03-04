import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, Form, Alert, FormSelect, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

const RATE_API_URL = 'http://localhost:5000/api/rate';
const CURRENCY_API_URL = 'http://localhost:5000/api/currency';

const rateSchema = yup.object().shape({
  fromCurrencyId: yup.number().required('From Currency is required'),
  toCurrencyId: yup.number().required('To Currency is required'),
  rate: yup.number().required('Rate is required').positive('Rate must be positive'),
});

function RatePage() {
  const [rates, setRates] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ratesRes, currenciesRes] = await Promise.all([
        axios.get(RATE_API_URL),
        axios.get(CURRENCY_API_URL)
      ]);
      setRates(ratesRes.data.rows);
      setCurrencies(currenciesRes.data.rows);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setEditingRate(null);
    setAlert(null);
  };
  const handleShowAdd = () => {
    setEditingRate(null);
    setShowModal(true);
  };
  const handleShowEdit = (rate) => {
    setEditingRate(rate);
    setShowModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (editingRate) {
        const response = await axios.put(`${RATE_API_URL}/${editingRate.id}`, values);
        
        fetchData(); 
        setAlert({ variant: 'success', message: 'Rate updated successfully!' });
      } else {
        await axios.post(RATE_API_URL, values);
        fetchData(); 
        setAlert({ variant: 'success', message: 'Rate added successfully!' });
        resetForm();
      }
      handleClose();
    } catch (error) {
        const msg = error.response?.data?.message || error.message;
        setAlert({ variant: 'danger', message: msg || 'Failed to save rate.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rate?')) {
      try {
        await axios.delete(`${RATE_API_URL}/${id}`);
        setRates(prev => prev.filter(item => item.id !== id));
        setAlert({ variant: 'success', message: 'Rate deleted successfully!' });
      } catch (error) {
        const msg = error.response?.data?.message || error.message;
        setAlert({ variant: 'danger', message: msg || 'Failed to delete rate.' });
      }
    }
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Exchange Rates</h1>
      {alert && <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>{alert.message}</Alert>}
      <Button variant="primary" onClick={handleShowAdd} className="mb-3">Add New Rate</Button>

      {loading && <div className="text-center"><Spinner animation="border" /> <p>Loading...</p></div>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>From Currency</th>
              <th>To Currency</th>
              <th>Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr key={rate.id}>
                <td>{rate.id}</td>
                <td>{rate.fromCurrency ? rate.fromCurrency.code : 'N/A'}</td>
                <td>{rate.toCurrency ? rate.toCurrency.code : 'N/A'}</td>
                <td>{rate.rate}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEdit(rate)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(rate.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRate ? 'Edit Rate' : 'Add New Rate'}</Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={rateSchema}
          onSubmit={handleSubmit}
          initialValues={editingRate || { fromCurrencyId: '', toCurrencyId: '', rate: '' }}
        >
          {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="rateFromCurrency">
                  <Form.Label>From Currency</Form.Label>
                  <FormSelect
                    name="fromCurrencyId"
                    value={values.fromCurrencyId}
                    onChange={handleChange}
                    isInvalid={!!errors.fromCurrencyId && touched.fromCurrencyId}
                  >
                    <option value="">Select currency</option>
                    {currencies.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                    ))}
                  </FormSelect>
                  <Form.Control.Feedback type="invalid">{errors.fromCurrencyId}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="rateToCurrency">
                  <Form.Label>To Currency</Form.Label>
                  <FormSelect
                    name="toCurrencyId"
                    value={values.toCurrencyId}
                    onChange={handleChange}
                    isInvalid={!!errors.toCurrencyId && touched.toCurrencyId}
                  >
                    <option value="">Select currency</option>
                    {currencies.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                    ))}
                  </FormSelect>
                  <Form.Control.Feedback type="invalid">{errors.toCurrencyId}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="rateValue">
                  <Form.Label>Rate Value</Form.Label>
                  <Form.Control
                    type="number"
                    name="rate"
                    value={values.rate}
                    onChange={handleChange}
                    isInvalid={!!errors.rate && touched.rate}
                  />
                  <Form.Control.Feedback type="invalid">{errors.rate}</Form.Control.Feedback>
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
export default RatePage;