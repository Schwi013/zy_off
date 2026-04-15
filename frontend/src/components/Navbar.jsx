import React, { useState, useEffect } from 'react'; // Agregamos hooks
import { Link } from 'react-router-dom';
import LogoZoff from '../assets/logo.png'; 
import { Search, ShoppingBag, Heart, User } from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  // 1. Lógica para detectar el ancho de pantalla
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Limpiamos el evento al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Definimos tamaños dinámicos basados en el ancho (Breakpoints)
  const isMobile = windowWidth < 768;
  const dynamicIconSize = isMobile ? 24 : 40; // 24px en móvil, 40px en desktop
  const dynamicLogoWidth = isMobile ? "w-20" : "w-32";

  return (
    <nav className="border-b border-gray-200 sticky top-0 bg-white z-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center">
        
        {/* LOGO */}
        <div className="flex-1 flex justify-start items-center">
          <Link to="/" className="cursor-pointer">
            <img 
              src={LogoZoff} 
              alt="Logo Z-OFF" 
              className={`${dynamicLogoWidth} object-contain transition-all duration-300`} 
            />
          </Link>
        </div>

        {/* ENLACES (Se ocultan en móvil automáticamente con 'hidden md:flex') */}
        <div className="hidden md:flex items-center justify-center gap-10 lg:gap-22.5 text-md font-bold uppercase tracking-widest text-gray-900">
          <Link to="/mujer" className="hover:text-gray-500 transition-all">Mujer</Link>
          <Link to="/hombres" className="hover:text-gray-500 transition-all">Hombre</Link>
          <Link to="/ninos" className="hover:text-gray-500 transition-all">Niños</Link>
          <Link to="/destacados" className="text-red-600 border-b-2 border-red-600 pb-1 hover:text-red-500 transition-all">
            Destacados
          </Link>
        </div>

        {/* ICONOS */}
        <div className="flex-1 flex items-center justify-end gap-4 md:gap-7 text-gray-800">
          <Search size={dynamicIconSize} className="cursor-pointer hover:scale-110 transition-transform" />
          <Heart size={dynamicIconSize} className="cursor-pointer hover:scale-110 transition-transform" />
          
          <div className="relative cursor-pointer group">
            <ShoppingBag size={dynamicIconSize} className="group-hover:scale-110 transition-transform" />
            <span className={`absolute -top-1 -right-1 bg-black text-white rounded-full flex items-center justify-center font-black ${isMobile ? 'text-[8px] w-3 h-3' : 'text-[10px] w-4 h-4'}`}>
              0
            </span>
          </div>

          <User 
            size={dynamicIconSize} 
            className="cursor-pointer hover:scale-110 transition-transform" 
            onClick={onOpenAuth} 
          />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;