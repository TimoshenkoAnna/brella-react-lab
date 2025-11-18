import { Link } from 'react-router-dom'; 
import './Header.css';

function Header() {
  return (
    <header className="header">
        <div className="header-container">
          {}
          <Link to="/" className="header-logo">Custom Clothes</Link>
          <nav className="header-nav">
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/about">О нас</Link>
          </nav>
        </div>
    </header>
  );
}
export default Header;