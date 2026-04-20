import React, { useState } from 'react';
import { X } from 'lucide-react';
import LogoZoff from '../assets/logo.png';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tu lógica de fetch aquí...
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-8}">
      {/* 1. Ancho equilibrado a 400px y más redondeado */}
      <div className="bg-white w-full max-w-[600px] rounded-3xl p-10 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
          <X size={22} />
        </button>

        {/* 2. Logo con mejor presencia */}
        <div className="flex justify-center mb-8">
          <img src={LogoZoff} alt="Z-OFF Logo" className="h-16 object-contain" />
        </div>

        {/* 3. Selector de pestañas con mejor tamaño */}
        <div className="flex bg-gray-100 rounded-full p-1.5 mb-8">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all duration-300 ${isLogin ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            INICIAR SESIÓN
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-full text-xs font-black transition-all duration-300 ${!isLogin ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            REGISTRARSE
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre" 
                required
                className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-red-600 transition-colors text-sm"
              />
              <input 
                type="text" 
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Apellidos" 
                required
                className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-red-600 transition-colors text-sm"
              />
            </div>
          )}

          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail" 
            required
            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-red-600 transition-colors text-sm"
          />
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña" 
            required
            className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-red-600 transition-colors text-sm"
          />

          {/* 4. Botón con más "punch" */}
          <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all duration-300 mt-4 shadow-lg shadow-red-200">
            {isLogin ? 'Entrar' : 'Crear Cuenta'}
          </button>

          {isLogin && (
            <p className="text-center">
              <a href="#" className="text-[10px] font-black uppercase text-gray-400 hover:text-red-600 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;