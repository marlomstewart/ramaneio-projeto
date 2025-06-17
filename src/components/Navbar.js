import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
          🏗️ Romaneio System
        </div>

        {/* Botão hamburguer */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? '✖️' : '☰'}
          </button>
        </div>

        {/* Links */}
        <div
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:flex gap-6 text-white`}
        >
          <Link
            to="/"
            className="block md:inline-block hover:text-yellow-300 no-underline"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/romaneio"
            className="block md:inline-block hover:text-yellow-300 no-underline"
            onClick={() => setMenuOpen(false)}
          >
            Romaneio
          </Link>
          <Link
            to="/embalagem"
            className="block md:inline-block hover:text-yellow-300 no-underline"
            onClick={() => setMenuOpen(false)}
          >
            Embalagem
          </Link>
        </div>
      </div>
    </nav>
  );
}
