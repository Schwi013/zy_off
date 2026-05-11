import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Package, BarChart3, LogOut } from 'lucide-react';
import LogoZoff from '../assets/logo.png'; // Make sure path is correct

const SellerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    alert("Sesión de vendedor cerrada.");
    window.location.href = '/';
  };

  const navItems = [
    { name: 'Dashboard', path: '/vendedor/dashboard', icon: LayoutDashboard },
    { name: 'Añadir Producto', path: '/vendedor/nuevo-producto', icon: PlusCircle },
    { name: 'Inventario', path: '/vendedor/inventario', icon: Package },
    { name: 'Reportes', path: '/vendedor/reportes', icon: BarChart3 },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col hidden md:flex sticky top-0 h-screen shadow-sm shrink-0">
      <div className="p-8 border-b border-gray-100 flex items-center gap-3 justify-center flex-col">
        <img src={LogoZoff} alt="Z-OFF Logo" className="h-10 object-contain" />
        <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest mt-2">Seller Portal</span>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Menú Principal</p>
        
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.name}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-black text-white shadow-md shadow-gray-300' 
                  : 'text-gray-500 hover:text-black hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Perfil del Vendedor y Logout */}
      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-orange-400 flex items-center justify-center text-white font-black shadow-md shrink-0">
            RO
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black leading-tight truncate">Ricardo Ortega</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Administrador</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl text-sm font-bold transition-all shadow-sm"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default SellerSidebar;
