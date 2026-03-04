import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CurrencyPage from './pages/CurrencyPage';
import RatePage from './pages/RatePage';
import TransactionPage from './pages/TransactionPage';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/currencies" element={<CurrencyPage />} />
          <Route path="/rates" element={<RatePage />} />
          <Route path="/transactions" element={<TransactionPage />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;