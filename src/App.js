import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa o Navbar
import Navbar from './components/Navbar';

// Importa as páginas
import Home from './pages/Home';
import RomaneioPage from './pages/RomaneioPage';
import EmbalagemPage from './pages/EmbalagemPage';
import ListagemRomaneiosPage from './pages/ListagemRomaneiosPage'; // 🔥 Importa a nova página

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
        <Route path="/lista-de-romaneios" element={<ListagemRomaneiosPage />} /> {/* 🔥 Nova rota */}
      </Routes>
    </Router>
  );
}

export default App;
