import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoZoff from '../assets/logo.png'; 
import { Search, ShoppingBag, Heart, User, Menu } from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  // Estado para controlar qué menú está abierto
  const [activeMenu, setActiveMenu] = useState(null);

  // Lista curada con las categorías más importantes
  const categoriasPopulares = {
    mujer: ["Novedades", "Originals", "Running", "Gimnasio y Entrenamiento", "Pádel", "Outdoor"],
    hombres: ["Novedades", "Originals", "Sportswear", "Running", "Tacos de Fútbol", "Basketball"],
    ninos: ["Novedades", "Originals", "Sportswear", "Tacos de Fútbol", "Basketball", "Tennis"]
  };

  return (
    // Se cierra el menú si el ratón sale completamente de la Navbar
    <nav 
      className="border-b border-gray-200 sticky top-0 bg-white z-50 font-sans shadow-sm relative"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex-none flex items-center">
          <Link to="/" className="cursor-pointer" onClick={() => setActiveMenu(null)}>
            <img src={LogoZoff} alt="Logo Z-OFF" className="w-19 md:w-28 object-contain" />
          </Link>
        </div>

        {/* ENLACES CENTRALES CON EVENTO HOVER */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-10 text-sm font-bold uppercase tracking-widest text-gray-900 h-full">
          
          {['mujer', 'hombres', 'ninos'].map((ruta) => (
            <div 
              key={ruta}
              className="h-full flex items-center"
              onMouseEnter={() => setActiveMenu(ruta)}
            >
              <Link to={`/${ruta}`} className="hover:text-red-600 transition-colors h-full flex items-center">
                {ruta === 'ninos' ? 'Niños' : ruta}
              </Link>
            </div>
          ))}

          <Link 
            to="/destacados" 
            className="text-red-600 border-b-2 border-red-600 hover:text-red-500 transition-all"
            onMouseEnter={() => setActiveMenu(null)} // Destacados no tiene submenú
          >
            Destacados
          </Link>
        </div>

        {/* ICONOS DERECHA */}
        <div className="flex-none flex items-center justify-end gap-5 md:gap-7 text-gray-800">
          <Search size={30} className="cursor-pointer hover:scale-110 transition-transform" />
          <Heart size={30} className="cursor-pointer hover:scale-110 transition-transform" />
          <div className="relative cursor-pointer group">
            <ShoppingBag size={30} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              0
            </span>
          </div>
          <User size={30} className="cursor-pointer hover:scale-110 transition-transform" onClick={onOpenAuth} />
          <div className="flex md:hidden cursor-pointer hover:text-red-600">
            <Menu size={24} />
          </div>
        </div>
      </div>

      {/* === EL PANEL DESPLEGABLE (MEGA MENÚ) === */}
      {activeMenu && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-xl transition-all duration-300 z-40">
          <div className="max-w-7xl mx-auto px-10 py-8">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-gray-400">
              Categorías de {activeMenu === 'ninos' ? 'Niños' : activeMenu}
            </h3>
            <ul className="flex flex-wrap gap-x-12 gap-y-4">
              {categoriasPopulares[activeMenu].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-bold text-gray-800 hover:text-red-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;