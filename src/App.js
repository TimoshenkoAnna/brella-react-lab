import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import './App.css';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
         <h1>Содержимое страницы будет здесь</h1>
      </main>
      <Footer />
    </div>
  );
}
export default App;