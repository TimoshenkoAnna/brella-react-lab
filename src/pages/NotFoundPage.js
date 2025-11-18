import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Страница не найдена</h2>
      <p className="not-found-text">
        К сожалению, страница, которую вы ищете, не существует.
      </p>
      <Link to="/" className="not-found-link">
        Вернуться на главную
      </Link>
    </div>
  );
}

export default NotFoundPage;