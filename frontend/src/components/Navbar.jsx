import React from 'react';
import { Link } from 'react-router-dom'; // Importante para que no recargue la página
import LogoZoff from '../assets/logo.png'; 
import { Search, ShoppingBag, Heart, User } from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  return (
    <nav className="border-b border-gray-200 sticky top-0 bg-white z-50 font-sans">
      <div className="max-w-7xl mx-auto px-10 h-20 flex items-center">
        
        {/* LOGO vinculado a "/" */}
        <div className="flex-1 flex justify-start items-center">
          <Link to="/" className="cursor-pointer">
            <img src={LogoZoff} alt="Logo Z-OFF" className="w-32 object-contain" />
          </Link>
        </div>

        {/* ENLACES usando <Link> */}
        <div className="hidden md:flex items-center justify-center gap-14 text-sm font-bold uppercase tracking-widest text-gray-900">
          <Link to="/mujer" className="hover:text-gray-400 transition-all">Mujer</Link>
          <Link to="/hombres" className="hover:text-gray-400 transition-all">Hombre</Link>
          <Link to="/ninos" className="hover:text-gray-400 transition-all">Niños</Link>
          <Link to="/destacados" className="text-red-600 border-b-2 border-red-600 pb-1 hover:text-red-500 transition-all">Destacados</Link>
        </div>

        {/* ICONOS */}
        <div className="flex-1 flex items-center justify-end gap-7 text-gray-800">
          <Search size={28} className="cursor-pointer hover:scale-110 transition-transform" />
          <Heart size={28} className="cursor-pointer hover:scale-110 transition-transform" />
          <div className="relative cursor-pointer group">
            <ShoppingBag size={28} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              0
            </span>
          </div>
          <User 
            size={28} 
            className="cursor-pointer hover:scale-110 transition-transform" 
            onClick={onOpenAuth} 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;