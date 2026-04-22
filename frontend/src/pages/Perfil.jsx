import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, X } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const [userData, setUserData] = useState({ name: '', last_name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('datos'); 
  const navigate = useNavigate();

  // === NUEVOS ESTADOS PARA DIRECCIONES ===
  const [direcciones, setDirecciones] = useState([]); // Aquí guardaremos las direcciones (máximo 5)
  const [isAddingAddress, setIsAddingAddress] = useState(false); // Controla si mostramos el formulario
  const [addressForm, setAddressForm] = useState({
    calle: '',
    colonia: '',
    ciudad: '',
    estado: '',
    cp: ''
  });

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
          // *NOTA*: Aquí en el futuro, si tu endpoint /perfil devuelve las direcciones, 
          // harías un setDirecciones(data.direcciones)
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

  // === LÓGICA DEL FORMULARIO DE DIRECCIONES ===
  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (direcciones.length >= 5) {
      alert("Has alcanzado el límite de 5 direcciones.");
      return;
    }

    // === SIMULACIÓN DE GUARDADO ===
    // Por ahora, solo lo guardamos en el estado local de React
    setDirecciones([...direcciones, addressForm]);
    
    /* // === CÓDIGO REAL PARA CUANDO ESTÉ LISTO TU BACKEND ===
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/direcciones', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressForm)
      });
      if (response.ok) {
         setDirecciones([...direcciones, addressForm]);
      }
    } catch (error) {
      console.error("Error guardando dirección", error);
    }
    */

    // Limpiamos el formulario y cerramos la vista de añadir
    setAddressForm({ calle: '', colonia: '', ciudad: '', estado: '', cp: '' });
    setIsAddingAddress(false);
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
            <button 
              onClick={() => { setActiveTab('datos'); setIsAddingAddress(false); }}
              className={`w-full flex justify-between items-center py-4 text-sm transition-colors ${activeTab === 'datos' ? 'font-bold text-black' : 'text-gray-600 hover:text-black'}`}
            >
              Datos personales <ChevronRight size={18} className="text-gray-400" />
            </button>
          </li>
          <li className="border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('direcciones')}
              className={`w-full flex justify-between items-center py-4 text-sm transition-colors ${activeTab === 'direcciones' ? 'font-bold text-black' : 'text-gray-600 hover:text-black'}`}
            >
              Direcciones <ChevronRight size={18} className="text-gray-400" />
            </button>
          </li>
          <li className="mt-4">
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-600 transition-colors text-left w-full font-bold">
              Cerrar sesión
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <div className="w-full md:w-3/4 md:pl-10">
        
        {/* === VISTA DE DATOS PERSONALES === */}
        {activeTab === 'datos' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-black uppercase mb-2 tracking-tight text-black">Mis Datos</h1>
            <p className="text-sm text-gray-600 mb-10">Modifica tus datos personales a continuación para que tu cuenta esté actualizada.</p>

            <section className="mb-12">
              <h2 className="text-xl font-black uppercase mb-6 tracking-tight text-black">Datos</h2>
              <div className="space-y-4 text-sm text-gray-800">
                <p className="uppercase">{`${userData.name} ${userData.last_name || ''}`}</p>
                <button className="text-black font-black uppercase underline hover:text-gray-600 transition-colors mt-2">
                  Editar
                </button>
              </div>
            </section>

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
        )}

        {/* === VISTA DE DIRECCIONES === */}
        {activeTab === 'direcciones' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-black uppercase mb-2 tracking-tight text-black">Direcciones</h1>
            <p className="text-sm text-gray-800 mb-10">Te quedan <span className="font-bold">{5 - direcciones.length}</span> de 5 entradas para tus direcciones.</p>
            
            {/* Si NO estamos agregando dirección, mostramos la lista y el botón de añadir */}
            {!isAddingAddress ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Listado de direcciones guardadas */}
                {direcciones.map((dir, index) => (
                  <div key={index} className="border border-gray-200 p-6 flex flex-col h-48 bg-gray-50">
                    <h3 className="font-bold text-sm mb-2 text-black uppercase">Dirección {index + 1}</h3>
                    <p className="text-sm text-gray-600">{dir.calle}</p>
                    <p className="text-sm text-gray-600">{dir.colonia}</p>
                    <p className="text-sm text-gray-600">{dir.ciudad}, {dir.estado} {dir.cp}</p>
                  </div>
                ))}

                {/* Botón de Nueva Dirección (Solo si hay menos de 5) */}
                {direcciones.length < 5 && (
                  <div 
                    onClick={() => setIsAddingAddress(true)}
                    className="border border-gray-200 p-6 flex flex-col justify-between h-48 cursor-pointer hover:border-black transition-colors group bg-white"
                  >
                    <span className="text-sm text-gray-800 group-hover:text-black font-bold uppercase tracking-widest">Nueva Dirección</span>
                    <Plus size={24} className="text-gray-800 group-hover:text-black group-hover:scale-110 transition-transform" />
                  </div>
                )}
              </div>
            ) : (
              
              /* === FORMULARIO PARA AÑADIR DIRECCIÓN === */
              <div className="border border-gray-200 p-8 relative bg-white">
                <button 
                  onClick={() => setIsAddingAddress(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
                >
                  <X size={20} />
                </button>
                
                <h3 className="font-black text-lg uppercase mb-6 text-black">Añadir Nueva Dirección</h3>
                
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <input 
                    type="text" 
                    name="calle" 
                    value={addressForm.calle} 
                    onChange={handleAddressChange} 
                    placeholder="Calle y Número" 
                    required
                    className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="colonia" 
                      value={addressForm.colonia} 
                      onChange={handleAddressChange} 
                      placeholder="Colonia" 
                      required
                      className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm"
                    />
                    <input 
                      type="text" 
                      name="cp" 
                      value={addressForm.cp} 
                      onChange={handleAddressChange} 
                      placeholder="Código Postal" 
                      required
                      className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      name="ciudad" 
                      value={addressForm.ciudad} 
                      onChange={handleAddressChange} 
                      placeholder="Ciudad" 
                      required
                      className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm"
                    />
                    <input 
                      type="text" 
                      name="estado" 
                      value={addressForm.estado} 
                      onChange={handleAddressChange} 
                      placeholder="Estado" 
                      required
                      className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="mt-6 bg-black text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
                  >
                    Guardar Dirección
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </div>

    </main>
  );
};

export default Perfil;