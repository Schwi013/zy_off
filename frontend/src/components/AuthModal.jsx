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
    const endpoint = isLogin ? "/login" : "/usuarios";
    // ... (misma lógica de fetch que ya tienes)
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      {/* Reducido a 320px de ancho máximo (xs) */}
      <div className="bg-white w-full max-w-[320px] rounded-2xl p-5 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black transition-colors">
          <X size={18} />
        </button>

        <div className="flex justify-center mb-3">
          <img src={LogoZoff} alt="Z-OFF Logo" className="h-12 object-contain" />
        </div>

        {/* Selector más pequeño */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-4">
          <button 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-1 rounded-full text-[10px] font-bold transition-all ${isLogin ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500'}`}
          >
            LOGIN
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-1 rounded-full text-[10px] font-bold transition-all ${!isLogin ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500'}`}
          >
            REGISTRO
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          
          {!isLogin && (
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre" 
                required
                className="w-full border-b border-gray-200 py-1 outline-none focus:border-red-600 transition-colors text-xs"
              />
              <input 
                type="text" 
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Apellidos" 
                required
                className="w-full border-b border-gray-200 py-1 outline-none focus:border-red-600 transition-colors text-xs"
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
            className="w-full border-b border-gray-200 py-1 outline-none focus:border-red-600 transition-colors text-xs"
          />
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña" 
            required
            className="w-full border-b border-gray-200 py-1 outline-none focus:border-red-600 transition-colors text-xs"
          />

          <button type="submit" className="w-full bg-red-600 text-white py-2.5 rounded-lg font-bold uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all mt-2">
            {isLogin ? 'Entrar' : 'Registrarme'}
          </button>

          {isLogin && (
            <p className="text-center mt-1">
              <a href="#" className="text-[8px] font-bold uppercase text-gray-400 hover:text-black">
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