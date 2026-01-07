import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import HomePage from './pages/HomePage.js';
import CatalogPage from './pages/CatalogPage.js';
import AboutPage from './pages/AboutPage.js';
import NotFoundPage from './pages/NotFoundPage.js';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;