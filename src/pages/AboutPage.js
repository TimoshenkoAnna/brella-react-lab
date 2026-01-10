import { useTranslation } from 'react-i18next';
import './AboutPage.css';

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="about-container">
      <h1 className="about-title">{t('about_page.title')}</h1>
      <div className="about-content">
        <p>{t('about_page.p1')}</p>
        <p>{t('about_page.p2')}</p>
        <p>{t('about_page.p3')}</p>
      </div>
    </div>
  );
}

export default AboutPage;