import React from 'react';
import { Link } from 'react-router-dom'; // <--- 1. Importamos Link
import LogoZoff from '../assets/logo.png'; 
import { Search, ShoppingBag, Heart, User, Menu } from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  return (
    <nav className="border-b border-gray-200 sticky top-0 bg-white z-50 font-sans shadow-sm">
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        
        {/* === IZQUERDA: LOGO === */}
        <div className="flex-none flex items-center">
          {/* Opcional pero recomendado: Que el logo te regrese al inicio */}
          <Link to="/" className="cursor-pointer">
            <img 
              src={LogoZoff} 
              alt="Logo Z-OFF" 
              className="w-19 md:w-28 object-contain" 
            />
          </Link>
        </div>

        {/* === CENTRO: ENLACES DE TEXTO === */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-10 text-sm font-bold uppercase tracking-widest text-gray-900">
          {/* 2. Cambiamos las 'a' por 'Link' y los 'href' por 'to' apuntando a tus rutas en App.jsx */}
          <Link to="/mujer" className="hover:text-red-600 transition-colors">Mujer</Link>
          <Link to="/hombres" className="hover:text-red-600 transition-colors">Hombre</Link>
          <Link to="/ninos" className="hover:text-red-600 transition-colors">Niños</Link>
          
          <Link to="/destacados" className="text-red-600 border-b-2 border-red-600 pb-1 hover:text-red-500 transition-all">
            Destacados
          </Link>
        </div>

        {/* === DERECHA: ICONOS === */}
        <div className="flex-none flex items-center justify-end gap-5 md:gap-7 text-gray-800">
          
          <Search size={30} className="cursor-pointer hover:scale-110 transition-transform" />
          
          <Heart size={30} className="cursor-pointer hover:scale-110 transition-transform" />
          
          <div className="relative cursor-pointer group">
            <ShoppingBag size={30} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              0
            </span>
          </div>

          <User 
            size={30} 
            className="cursor-pointer hover:scale-110 transition-transform" 
            onClick={onOpenAuth} 
          />

          <div className="flex md:hidden cursor-pointer hover:text-red-600">
            <Menu size={24} />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;