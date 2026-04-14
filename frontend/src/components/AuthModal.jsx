import React, { useState } from 'react';
import { X } from 'lucide-react'; // Asegúrate de tener lucide-react instalado
import LogoZoff from '../assets/logo.png'; // Verifica que el archivo se llame exactamente logo.png

const AuthModal = ({ isOpen, onClose }) => {
  // Estado para alternar entre Login y Registro
  const [isLogin, setIsLogin] = useState(true);

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={LogoZoff} alt="Z-OFF Logo" className="h-20 object-contain" />
        </div>

        {/* Selector Rojo/Gris */}
        <div className="flex bg-gray-200 rounded-full p-1 mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${isLogin ? 'bg-red-600 text-white shadow-md' : 'text-gray-500'}`}
          >
            Iniciar sesión
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${!isLogin ? 'bg-red-600 text-white shadow-md' : 'text-gray-500'}`}
          >
            Registrarse
          </button>
        </div>

        <h2 className="text-center text-xl font-black mb-6 uppercase tracking-tight">Bienvenido a ZYOFF</h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          
          {/* Campos de Registro */}
          {!isLogin && (
            <>
              <input 
                type="text" 
                placeholder="Nombre completo" 
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-red-600 transition-colors text-sm"
              />
              <input 
                type="text" 
                placeholder="Usuario" 
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-red-600 transition-colors text-sm"
              />
            </>
          )}

          {/* Campos Comunes */}
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-red-600 transition-colors text-sm"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-red-600 transition-colors text-sm"
          />

          <button className="w-full bg-red-600 text-white py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-red-700 transition-all mt-4">
            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
          </button>

          {isLogin && (
            <p className="text-center mt-4">
              <a href="#" className="text-[10px] font-black uppercase text-gray-400 hover:text-black">
                Olvidé mi contraseña
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
