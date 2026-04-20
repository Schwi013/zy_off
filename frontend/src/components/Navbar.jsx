import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoZoff from '../assets/logo.png'; 
import { Search, ShoppingBag, Heart, User, Menu, LogOut, ChevronRight } from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  
  // === ESTADOS DE AUTENTICACIÓN Y DATOS DEL USUARIO ===
  const [isLogged, setIsLogged] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState(''); // Nuevo estado para el nombre

  // 1. Vigía del Token y Carga de Perfil
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLogged(true);
        // Si no tenemos el nombre todavía, lo pedimos al Backend
        if (!userName) {
          try {
            const response = await fetch('http://localhost:8000/perfil', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
              const data = await response.json();
              setUserName(data.name); // Guardamos el nombre real
            } else {
              // Si el token falló, limpiamos
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

    // Revisión periódica simple
    const interval = setInterval(fetchUserData, 1000);
    return () => clearInterval(interval);
  }, [userName]);

  const handleUserClick = () => {
    if (isLogged) {
      setShowUserMenu(!showUserMenu);
    } else {
      onOpenAuth();
    }
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

  return (
    <nav 
      className="border-b border-gray-200 sticky top-0 bg-white z-50 font-sans shadow-sm relative"
      onMouseLeave={() => {
        setActiveMenu(null);
        setShowUserMenu(false);
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 lg:h-15 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex-none flex items-center">
          <Link to="/" className="cursor-pointer" onClick={() => setActiveMenu(null)}>
            <img src={LogoZoff} alt="Logo Z-OFF" className="w-19 md:w-24 object-contain" />
          </Link>
        </div>

        {/* ENLACES CENTRALES */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-10 text-[10px] lg:text-sm font-black uppercase tracking-widest text-gray-900 h-full">
          {['mujer', 'hombres', 'ninos'].map((ruta) => (
            <div 
              key={ruta}
              className="h-full flex items-center"
              onMouseEnter={() => {
                setActiveMenu(ruta);
                setShowUserMenu(false);
              }}
            >
              <Link to={`/${ruta}`} className="hover:text-red-600 transition-colors h-full flex items-center">
                {ruta === 'ninos' ? 'Niños' : ruta}
              </Link>
            </div>
          ))}

          <Link 
            to="/destacados" 
            className="text-red-600 border-b-2 border-red-600 hover:text-red-500 transition-all flex items-center h-full"
            onMouseEnter={() => {
              setActiveMenu(null);
              setShowUserMenu(false);
            }} 
          >
            Destacados
          </Link>
        </div>

        {/* ICONOS DERECHA */}
        <div className="flex-none flex items-center justify-end gap-4 md:gap-7 text-gray-800">
          <Search size={35} className="cursor-pointer hover:scale-110 transition-transform" />
          <Heart size={35} className="cursor-pointer hover:scale-110 transition-transform" />
          
          <div className="relative cursor-pointer group">
            <ShoppingBag size={35} className="group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-black">
              0
            </span>
          </div>

          {/* 3. ÍCONO DE USUARIO: Siempre negro, sin importar el login */}
          <div className="relative">
            <User 
              size={40} 
              className="cursor-pointer hover:scale-110 transition-transform text-gray-800" 
              onClick={handleUserClick} 
            />

            {/* MINI MENÚ DESPLEGABLE */}
            {isLogged && showUserMenu && (
              <div className="absolute right-0 mt-6 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col">
                
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cuenta oficial</p>
                  {/* 4. NOMBRE DINÁMICO DESDE EL BACKEND */}
                  <p className="text-sm font-black text-gray-900 mt-1 truncate">
                    Hola, {userName || 'Cargando...'}
                  </p>
                </div>
                
                <div className="flex flex-col py-2">
                  <a href="#" className="px-5 py-3 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50/50 flex justify-between items-center transition-colors">
                    Mi Perfil <ChevronRight size={14}/>
                  </a>
                  <a href="#" className="px-5 py-3 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50/50 flex justify-between items-center transition-colors">
                    Mis Pedidos <ChevronRight size={14}/>
                  </a>
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-4 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white flex items-center gap-3 transition-all duration-300 border-t border-gray-100"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          <div className="flex md:hidden cursor-pointer hover:text-red-600">
            <Menu size={24} />
          </div>
        </div>
      </div>

      {/* PANEL DESPLEGABLE (MEGA MENÚ) */}
      {activeMenu && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl transition-all duration-300 z-40">
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