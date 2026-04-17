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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Esta función habla con tu FastAPI
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página recargue
    const endpoint = isLogin ? "/login" : "/usuarios";
    
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Si el login es correcto, guardamos el gafete (Token)
          localStorage.setItem('token', data.access_token);
          alert("¡Login Exitoso! Bienvenido a ZY OFF");
          onClose(); // Cerramos la ventana
        } else {
          // Si el registro es correcto
          alert("¡Cuenta creada exitosamente! Por favor inicia sesión.");
          setIsLogin(true); // Cambiamos a la pestaña de login
          // Limpiamos el formulario
          setFormData({ name: '', last_name: '', email: '', password: '' });
        }
      } else {
        // Si pusiste mal la contraseña o el usuario ya existe
        alert(data.detail || "Error en la operación");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error: Verifica que tu servidor Backend (FastAPI) esté encendido.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
          <X size={24} />
        </button>

        <div className="flex justify-center mb-6">
          <img src={LogoZoff} alt="Z-OFF Logo" className="h-20 object-contain" />
        </div>

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

        <h2 className="text-center text-xl font-black mb-6 uppercase tracking-tight">
          {isLogin ? "Bienvenido de vuelta" : "Únete a ZYOFF"}
        </h2>

        {/* Agregamos el onSubmit al formulario */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {!isLogin && (
            <>
              {/* Nota cómo conectamos el name, el value y el onChange */}
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre" 
                required
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-red-600 transition-colors text-sm"
              />
              <input 
                type="text" 
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Apellidos" 
                required
                className="w-full border-b border-gray-300 py-2 outline-none focus:border-red-600 transition-colors text-sm"
              />
            </>
          )}

          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail" 
            required
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-red-600 transition-colors text-sm"
          />
          <input 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Contraseña" 
            required
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-red-600 transition-colors text-sm"
          />

          <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-red-700 transition-all mt-4">
            {isLogin ? 'Iniciar sesión' : 'Crear Cuenta'}
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