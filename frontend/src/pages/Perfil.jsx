import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const [userData, setUserData] = useState({ name: '', last_name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/perfil', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name,
            last_name: data.last_name,
            email: data.email
          });
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error("Error al cargar los datos del perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; 
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-10 py-12 min-h-[50vh] flex justify-center items-center text-gray-500 font-bold uppercase tracking-widest">
        Cargando perfil...
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row gap-10">
      
      {/* BARRA LATERAL */}
      <aside className="w-full md:w-1/4">
        <h2 className="font-black text-lg mb-6 uppercase tracking-tight text-black">Resumen de tu cuenta</h2>
        <ul className="flex flex-col">
          <li className="border-b border-gray-100">
            <button className="w-full flex justify-between items-center py-4 text-sm font-bold bg-white text-black">
              Datos personales <ChevronRight size={18} className="text-gray-400" />
            </button>
          </li>
          <li className="border-b border-gray-100">
            <button className="w-full flex justify-between items-center py-4 text-sm text-gray-600 hover:text-black transition-colors">
              Direcciones <ChevronRight size={18} className="text-gray-400" />
            </button>
          </li>
          <li className="border-b border-gray-100">
            <button className="w-full flex justify-between items-center py-4 text-sm text-gray-600 hover:text-black transition-colors">
              Preferencias <ChevronRight size={18} className="text-gray-400" />
            </button>
          </li>
          <li className="mt-4">
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-600 transition-colors text-left w-full font-bold">
              Cerrar sesión
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="w-full md:w-3/4 md:pl-10">
        <h1 className="text-3xl font-black uppercase mb-2 tracking-tight text-black">Mis Datos</h1>
        <p className="text-sm text-gray-600 mb-10">Modifica tus datos personales a continuación para que tu cuenta esté actualizada.</p>

        {/* Sección: DATOS */}
        <section className="mb-12">
          <h2 className="text-xl font-black uppercase mb-6 tracking-tight text-black">Datos</h2>
          <div className="space-y-4 text-sm text-gray-800">
            <p className="uppercase">{`${userData.name} ${userData.last_name || ''}`}</p>
            <button className="text-black font-black uppercase underline hover:text-gray-600 transition-colors mt-2">
              Editar
            </button>
          </div>
        </section>

        {/* Sección: DATOS DE ACCESO */}
        <section>
          <h2 className="text-xl font-black uppercase mb-6 tracking-tight text-black">Datos de acceso</h2>
          
          <div className="mb-8">
            <h3 className="text-sm font-black uppercase mb-2 text-black">Correo Electrónico</h3>
            <p className="text-sm text-gray-800 uppercase mb-2">{userData.email}</p>
            <button className="text-black font-black uppercase underline hover:text-gray-600 transition-colors">
              Editar
            </button>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase mb-2 text-black">Contraseña</h3>
            <p className="text-sm text-gray-800 mb-2">*************</p>
            <button className="text-black font-black uppercase underline hover:text-gray-600 transition-colors">
              Editar
            </button>
          </div>
        </section>
      </div>

    </main>
  );
};

export default Perfil;