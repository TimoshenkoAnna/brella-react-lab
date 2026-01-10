import { useTranslation } from 'react-i18next';
import './HomePage.css';

function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      <h1 className="home-title">{t('home_page.title')}</h1>
      <p className="home-subtitle">{t('home_page.subtitle')}</p>
      <p className="home-text">{t('home_page.text')}</p>
    </div>
  );
}

export default HomePage;