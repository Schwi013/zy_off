import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoZoff from '../assets/logo.png'; 
import { Search, ShoppingBag, Heart, User, Menu, LogOut, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = ({ onOpenAuth }) => {
  // === ESTADOS DE INTERFAZ ===
  const [activeMenu, setActiveMenu] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Nuevo estado para el menú de celular
  const { cartCount } = useCart(); // Traemos la cantidad total
  
  // === ESTADOS DE AUTENTICACIÓN Y RESPONSIVE ===
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState(''); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Vigía de Tamaño de Pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Vigía del Token
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLogged(true);
        if (!userName) {
          try {
            const response = await fetch('http://localhost:8000/perfil', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
              const data = await response.json();
              setUserName(data.name); 
            } else {
              localStorage.removeItem('token');
              setIsLogged(false);
            }
          } catch (error) {
            console.error("Error al cargar perfil:", error);
          }
        }
      } else {
        setIsLogged(false);
        setUserName('');
      }
    };
    const interval = setInterval(fetchUserData, 1000);
    return () => clearInterval(interval);
  }, [userName]);

  // Manejadores de clics
  const handleUserClick = () => {
    setShowSearch(false);
    setShowMobileMenu(false);
    if (isLogged) {
      setShowUserMenu(!showUserMenu);
    } else {
      onOpenAuth();
    }
  };

  const handleSearchClick = () => {
    setShowUserMenu(false);
    setActiveMenu(null);
    setShowMobileMenu(false);
    setShowSearch(!showSearch);
  };

  const handleMobileMenuClick = () => {
    setShowSearch(false);
    setShowUserMenu(false);
    setShowMobileMenu(!showMobileMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    setUserName('');
    setShowUserMenu(false);
  };

  const categoriasPopulares = {
    mujer: ["Novedades", "Originals", "Running", "Gimnasio y Entrenamiento", "Pádel", "Outdoor"],
    hombres: ["Novedades", "Originals", "Sportswear", "Running", "Tacos de Fútbol", "Basketball"],
    ninos: ["Novedades", "Originals", "Sportswear", "Tacos de Fútbol", "Basketball", "Tennis"]
  };

  // Tamaño dinámico de íconos: 24 en móvil, 32 en PC
  const iconSize = isMobile ? 24 : 32;

  return (
    <nav 
      className="border-b border-gray-200 sticky top-0 bg-white z-50 font-sans shadow-sm relative"
      onMouseLeave={() => {
        if (!isMobile) {
          setActiveMenu(null);
          setShowUserMenu(false);
          setShowSearch(false);
        }
      }}
    >
      {/* ESTE ES EL CONTENEDOR DE LA NAV */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-[100px] flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex-none flex items-center">
          <Link to="/" className="cursor-pointer" onClick={() => { setActiveMenu(null); setShowSearch(false); setShowMobileMenu(false); }}>
            <img src={LogoZoff} alt="Logo Z-OFF" className="w-20 md:w-25 object-contain" />
          </Link>
        </div>

        {/* === SECCIÓN CENTRAL (SOLO DESKTOP) === */}
        <div className="hidden md:flex flex-1 items-center justify-center h-full relative px-10">
          {showSearch ? (
            <form 
              className="w-full max-w-2xl relative flex items-center animate-fade-in"
              onSubmit={(e) => { e.preventDefault(); setShowSearch(false); }}
            >
              <Search size={20} className="absolute left-4 text-gray-400" />
              <input 
                type="text" 
                name="search"
                placeholder="Busca por marca, modelo o color..." 
                className="w-full bg-gray-100 text-gray-900 rounded-full py-2.5 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:font-medium"
                autoFocus 
              />
            </form>
          ) : (
            /* Configuracion de las categorias */
            <div className="flex gap-8 lg:gap-24 text-xs lg:text-sm font-black uppercase tracking-widest text-gray-900 h-full">
              {['mujer', 'hombres', 'ninos'].map((ruta) => (
                <div 
                  key={ruta}
                  className="h-full flex items-center"
                  onMouseEnter={() => { setActiveMenu(ruta); setShowUserMenu(false); }}
                >
                  <Link to={`/${ruta}`} className="hover:text-red-600 transition-colors h-full flex items-center">
                    {ruta === 'ninos' ? 'Niños' : ruta}
                  </Link>
                </div>
              ))}
              <Link 
                to="/destacados" 
                className="text-red-600 border-b-2 border-red-600 hover:text-red-500 transition-all flex items-center h-full"
                onMouseEnter={() => setActiveMenu(null)} 
              >
                Destacados
              </Link>
            </div>
          )}
        </div>

        {/* === ICONOS DERECHA === */}
        <div className="flex-none flex items-center justify-end gap-5 md:gap-6 text-gray-800">
          
          {/* LUPA: Con onMouseEnter para PC y onClick para Móvil */}
          <button 
            onMouseEnter={() => { if (!isMobile) { setShowSearch(true); setActiveMenu(null); setShowUserMenu(false); } }}
            onClick={handleSearchClick}
            className="focus:outline-none flex items-center"
          >
            <Search size={iconSize} className={`cursor-pointer hover:scale-110 transition-transform ${showSearch ? 'text-red-600' : 'text-gray-800'}`} />
          </button>
          
          <Heart size={iconSize} className="cursor-pointer hover:scale-110 transition-transform hidden md:block" />
          
          <Link to="/carrito" className="relative cursor-pointer group flex items-center">
          <ShoppingBag size={iconSize} className="group-hover:scale-110 transition-transform" />
           {/* El contador ahora es dinámico */}
          <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-black animate-in fade-in zoom-in duration-300"> {cartCount} </span>
    </Link>

          <div className="relative">
            <User size={iconSize} className="cursor-pointer hover:scale-110 transition-transform text-gray-800" onClick={handleUserClick} />
            {isLogged && showUserMenu && (
              <div className="absolute right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 mt-6 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cuenta oficial</p>
                  <p className="text-sm font-black text-gray-900 mt-1 truncate">Hola, {userName || 'Cargando...'}</p>
                </div>
                <div className="flex flex-col py-2">
                  <Link to="/perfil" className="px-5 py-3 text-xs font-bold text-gray-600 hover:text-red-600 flex justify-between items-center">Mi Perfil <ChevronRight size={14}/></Link>
                  {/* Cambio para carrito  */}
                  <Link to="/pedidos" onClick={() => setShowUserMenu(false)} className="px-5 py-3 text-xs font-bold text-gray-600 hover:text-red-600 flex justify-between items-center">Mis Pedidos <ChevronRight size={14}/> </Link>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-5 py-4 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white flex items-center gap-3 transition-all border-t border-gray-100">
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* Menú Hamburguesa (Solo Móvil) */}
          <button className="flex md:hidden cursor-pointer hover:text-red-600 focus:outline-none" onClick={handleMobileMenuClick}>
            {showMobileMenu ? <X size={iconSize} /> : <Menu size={iconSize} />}
          </button>
        </div>
      </div>

      {/* === BUSCADOR DESPLEGABLE (SOLO MÓVIL) === */}
      {isMobile && showSearch && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-md z-40 p-4 animate-fade-in">
          <form className="relative flex items-center w-full" onSubmit={(e) => { e.preventDefault(); setShowSearch(false); }}>
            <Search size={18} className="absolute left-4 text-gray-400" />
            <input type="text" placeholder="Buscar tenis..." className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600" autoFocus />
          </form>
        </div>
      )}

      {/* === MENÚ DESPLEGABLE MÓVIL (MUJER, HOMBRE, NIÑOS) === */}
      {isMobile && showMobileMenu && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl z-40 flex flex-col">
          {['mujer', 'hombres', 'ninos'].map((ruta) => (
            <Link 
              key={ruta} 
              to={`/${ruta}`} 
              onClick={() => setShowMobileMenu(false)}
              className="px-6 py-4 border-b border-gray-50 text-sm font-black uppercase tracking-widest flex justify-between items-center text-gray-800 hover:text-red-600"
            >
              {ruta === 'ninos' ? 'Niños' : ruta} <ChevronRight size={18} className="text-gray-300"/>
            </Link>
          ))}
          <Link 
            to="/destacados" 
            onClick={() => setShowMobileMenu(false)}
            className="px-6 py-4 text-sm font-black uppercase tracking-widest text-red-600 flex justify-between items-center bg-red-50/30"
          >
            Destacados <ChevronRight size={18} className="text-red-300"/>
          </Link>
        </div>
      )}

      {/* === MEGA MENÚ (SOLO DESKTOP) === */}
      {!isMobile && activeMenu && !showSearch && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl transition-all duration-300 z-30">
          <div className="max-w-7xl mx-auto px-10 py-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-gray-400">
              Categorías {activeMenu === 'ninos' ? 'Infantiles' : 'de ' + activeMenu}
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