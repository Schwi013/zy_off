import React from 'react';
import LogoZoff from '../assets/logo.png'; 
import { Search, ShoppingBag, Heart, User, Menu } from 'lucide-react'; // <--- Importamos 'Menu'

const Navbar = ({ onOpenAuth }) => {
  return (
    // 'sticky top-0' mantiene el menú fijo al hacer scroll
    <nav className="border-b border-gray-200 sticky top-0 bg-white z-50 font-sans shadow-sm">
      
      {/* 1. Contenedor Principal: Define el ancho máximo y el espaciado lateral */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        
        {/* === IZQUERDA: LOGO === */}
        <div className="flex-none flex items-center">
          <div className="cursor-pointer">
            <img 
              src={LogoZoff} 
              alt="Logo Z-OFF" 
              className="w-19 md:w-28 object-contain" // <--- Logo más pequeño en móvil, grande en desktop
            />
          </div>
        </div>

        {/* === CENTRO: ENLACES DE TEXTO === */}
        {/* 'hidden md:flex' significa: oculto en pantallas pequeñas, visible y flexible en medianas (768px+) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-10 text-sm font-bold uppercase tracking-widest text-gray-900">
          <a href="#" className="hover:text-red-600 transition-colors">Mujer</a>
          <a href="#" className="hover:text-red-600 transition-colors">Hombre</a>
          <a href="#" className="hover:text-red-600 transition-colors">Niños</a>
          {/* El subrayado rojo se aplica SOLO al texto */}
          <a href="#" className="text-red-600 border-b-2 border-red-600 pb-1 hover:text-red-500 transition-all">
            Destacados
          </a>
        </div>

        {/* === DERECHA: ICONOS === */}
        <div className="flex-none flex items-center justify-end gap-5 md:gap-7 text-gray-800">
          
          {/* Opcional: El icono de búsqueda puede estar oculto en móvil */}
          <Search size={30} className="cursor-pointer hover:scale-110 transition-transform" />
          
          <Heart size={30} className="cursor-pointer hover:scale-110 transition-transform" />
          
          {/* Carrito con número */}
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

          {/* === ICONO DE MENÚ HAMBURGUESA: Solo visible en móvil === */}
          {/* 'flex md:hidden' significa: visible en pantallas pequeñas, oculto en medianas+ */}
          <div className="flex md:hidden cursor-pointer hover:text-red-600">
            <Menu size={24} />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;