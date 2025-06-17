import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa o Navbar
import Navbar from './components/Navbar';

// Importa as páginas
import Home from './pages/Home';
import RomaneioPage from './pages/RomaneioPage';
import EmbalagemPage from './pages/EmbalagemPage';

// Função principal
function App() {
  return (
    <Router>
      {/* Navbar visível em todas as páginas */}
      <Navbar />

      {/* Rotas do sistema */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/romaneio" element={<RomaneioPage />} />
        <Route path="/embalagem" element={<EmbalagemPage />} />
      </Routes>
    </Router>
  );
}

export default App;
