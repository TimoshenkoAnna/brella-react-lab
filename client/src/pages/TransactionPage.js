import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, Form, Alert, FormSelect, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

const TRANSACTION_API_URL = 'http://localhost:5000/api/transaction';
const RATE_API_URL = 'http://localhost:5000/api/rate';

const transactionSchema = yup.object().shape({
  rateId: yup.number().required('Rate is required'),
  amountFrom: yup.number().required('Amount From is required').positive('Amount From must be positive'),
  amountTo: yup.number().required('Amount To is required').positive('Amount To must be positive'),
});

function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, ratesRes] = await Promise.all([
        axios.get(TRANSACTION_API_URL),
        axios.get(RATE_API_URL)
      ]);
      setTransactions(transactionsRes.data.rows);
      setRates(ratesRes.data.rows);
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
    setEditingTransaction(null);
    setAlert(null);
  };
  const handleShowAdd = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };
  const handleShowEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (editingTransaction) {
        await axios.put(`${TRANSACTION_API_URL}/${editingTransaction.id}`, values);
        fetchData();
        setAlert({ variant: 'success', message: 'Transaction updated successfully!' });
      } else {
        await axios.post(TRANSACTION_API_URL, values);
        fetchData();
        setAlert({ variant: 'success', message: 'Transaction added successfully!' });
        resetForm();
      }
      handleClose();
    } catch (error) {
        const msg = error.response?.data?.message || error.message;
        setAlert({ variant: 'danger', message: msg || 'Failed to save transaction.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`${TRANSACTION_API_URL}/${id}`);
        setTransactions(prev => prev.filter(item => item.id !== id));
        setAlert({ variant: 'success', message: 'Transaction deleted successfully!' });
      } catch (error) {
        const msg = error.response?.data?.message || error.message;
        setAlert({ variant: 'danger', message: msg || 'Failed to delete transaction.' });
      }
    }
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Transactions History</h1>
      {alert && <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>{alert.message}</Alert>}
      <Button variant="primary" onClick={handleShowAdd} className="mb-3">Add New Transaction</Button>

      {loading && <div className="text-center"><Spinner animation="border" /> <p>Loading...</p></div>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Rate</th>
              <th>Amount From</th>
              <th>Amount To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>
                  {transaction.rate 
                      ? `${transaction.rate.fromCurrency.code} -> ${transaction.rate.toCurrency.code} (${transaction.rate.rate})` 
                      : 'N/A'}
                </td>
                <td>{transaction.amountFrom}</td>
                <td>{transaction.amountTo}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEdit(transaction)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(transaction.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</Modal.Title>
        </Modal.Header>
        <Formik
          validationSchema={transactionSchema}
          onSubmit={handleSubmit}
          initialValues={editingTransaction || { rateId: '', amountFrom: '', amountTo: '' }}
        >
          {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="transactionRate">
                  <Form.Label>Exchange Rate</Form.Label>
                  <FormSelect
                    name="rateId"
                    value={values.rateId}
                    onChange={handleChange}
                    isInvalid={!!errors.rateId && touched.rateId}
                  >
                    <option value="">Select rate</option>
                    {rates.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.fromCurrency ? `${r.fromCurrency.code} -> ${r.toCurrency.code} (${r.rate})` : `Rate ID: ${r.id}`}
                        </option>
                    ))}
                  </FormSelect>
                  <Form.Control.Feedback type="invalid">{errors.rateId}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="transactionAmountFrom">
                  <Form.Label>Amount From</Form.Label>
                  <Form.Control
                    type="number"
                    name="amountFrom"
                    value={values.amountFrom}
                    onChange={handleChange}
                    isInvalid={!!errors.amountFrom && touched.amountFrom}
                  />
                  <Form.Control.Feedback type="invalid">{errors.amountFrom}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="transactionAmountTo">
                  <Form.Label>Amount To</Form.Label>
                  <Form.Control
                    type="number"
                    name="amountTo"
                    value={values.amountTo}
                    onChange={handleChange}
                    isInvalid={!!errors.amountTo && touched.amountTo}
                  />
                  <Form.Control.Feedback type="invalid">{errors.amountTo}</Form.Control.Feedback>
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
export default TransactionPage;