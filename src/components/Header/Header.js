import './Header.css';

function Header() {
  return (
    <header className="header">
        <div className="header-container">
          <div className="header-logo">Custom Clothes</div>
          <nav className="header-nav">
            <a href="/">Главная</a>
            <a href="/catalog">Каталог</a>
            <a href="/about">О нас</a>
          </nav>
        </div>
    </header>
  );
}
export default Header;