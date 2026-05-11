import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, X, Trash2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const estadosYCiudades = {
  "Aguascalientes": ["Aguascalientes", "Jesús María", "Calvillo"],
  "Baja California": ["Tijuana", "Mexicali", "Ensenada"],
  "Baja California Sur": ["La Paz", "Los Cabos", "Comondú"],
  "Campeche": ["Campeche", "Carmen", "Champotón"],
  "Chiapas": ["Tuxtla Gutiérrez", "Tapachula", "San Cristóbal de las Casas"],
  "Chihuahua": ["Chihuahua", "Juárez", "Delicias"],
  "Ciudad de México": ["Álvaro Obregón", "Cuauhtémoc", "Coyoacán", "Miguel Hidalgo", "Tlalpan"],
  "Coahuila": ["Saltillo", "Torreón", "Monclova"],
  "Colima": ["Colima", "Manzanillo", "Tecomán"],
  "Durango": ["Durango", "Gómez Palacio", "Lerdo"],
  "Guanajuato": ["León", "Irapuato", "Celaya"],
  "Guerrero": ["Acapulco", "Chilpancingo", "Iguala"],
  "Hidalgo": ["Pachuca", "Tulancingo", "Tizayuca"],
  "Jalisco": ["Guadalajara", "Zapopan", "Puerto Vallarta", "Tlaquepaque"],
  "Estado de México": ["Toluca", "Ecatepec", "Naucalpan", "Tlalnepantla"],
  "Michoacán": ["Morelia", "Uruapan", "Zamora"],
  "Morelos": ["Cuernavaca", "Jiutepec", "Cuautla"],
  "Nayarit": ["Tepic", "Bahía de Banderas", "Xalisco"],
  "Nuevo León": ["Monterrey", "San Pedro Garza García", "Apodaca"],
  "Oaxaca": ["Oaxaca de Juárez", "Salina Cruz", "Juchitán"],
  "Puebla": ["Puebla", "Tehuacán", "San Martín Texmelucan"],
  "Querétaro": ["Querétaro", "San Juan del Río", "Corregidora"],
  "Quintana Roo": ["Cancún", "Playa del Carmen", "Chetumal"],
  "San Luis Potosí": ["San Luis Potosí", "Ciudad Valles", "Matehuala"],
  "Sinaloa": ["Culiacán", "Mazatlán", "Los Mochis"],
  "Sonora": ["Hermosillo", "Ciudad Obregón", "Nogales"],
  "Tabasco": ["Villahermosa", "Cárdenas", "Comalcalco"],
  "Tamaulipas": ["Reynosa", "Tampico", "Matamoros"],
  "Tlaxcala": ["Tlaxcala", "Apizaco", "Huamantla"],
  "Veracruz": ["Veracruz", "Xalapa", "Coatzacoalcos"],
  "Yucatán": ["Mérida", "Valladolid", "Progreso"],
  "Zacatecas": ["Zacatecas", "Fresnillo", "Guadalupe"]
};

const Perfil = () => {
  const [userData, setUserData] = useState({ name: '', last_name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('datos'); 
  const navigate = useNavigate();

  // === NUEVOS ESTADOS PARA DIRECCIONES ===
  const getUserKey = () => `zyoff_addresses_${localStorage.getItem('currentUser') || 'guest'}`;
  
  const [direcciones, setDirecciones] = useState(() => {
    const saved = localStorage.getItem(getUserKey());
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(getUserKey(), JSON.stringify(direcciones));
  }, [direcciones]);

  const [isAddingAddress, setIsAddingAddress] = useState(false); // Controla si mostramos el formulario
  const [addressForm, setAddressForm] = useState({
    estado: '',
    ciudad: '',
    cp: '',
    calle: '',
    numero: '',
    colonia: ''
  });

  // Lista dinámica de ciudades según el estado seleccionado
  const ciudadesDisponibles = addressForm.estado ? estadosYCiudades[addressForm.estado] : [];

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
          
          /*
          // TODO: BACKEND - LECTURA DE DIRECCIONES (Descomentar al conectar)
          // Asumiendo que el endpoint /perfil devuelve las direcciones o existe un /api/direcciones
          const addrResponse = await fetch(`http://localhost:8000/api/direcciones/${data.email}`);
          if (addrResponse.ok) {
            const addrData = await addrResponse.json();
            setDirecciones(addrData);
          }
          */
        } else {
          // Si el backend falla, usamos datos simulados para que no saque al usuario en un bucle
          console.warn("El backend falló, usando datos simulados.");
          setUserData({
            name: 'Usuario',
            last_name: 'Simulado',
            email: localStorage.getItem('currentUser') || 'usuario@ejemplo.com'
          });
        }
      } catch (error) {
        console.error("Error al cargar los datos del perfil:", error);
        setUserData({
          name: 'Usuario',
          last_name: 'Simulado',
          email: localStorage.getItem('currentUser') || 'usuario@ejemplo.com'
        });
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
    const { name, value } = e.target;
    // Si cambia el estado, reiniciamos la ciudad para evitar inconsistencias
    if (name === 'estado') {
      setAddressForm({ ...addressForm, estado: value, ciudad: '' });
    } else {
      setAddressForm({ ...addressForm, [name]: value });
    }
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
    
    /* 
    // TODO: BACKEND - GUARDAR DIRECCIÓN (Descomentar al conectar)
    // const email = localStorage.getItem('currentUser') || 'guest';
    // try {
    //   const response = await fetch(`http://localhost:8000/api/direcciones/${email}`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify([...direcciones, addressForm])
    //   });
    //   if (!response.ok) throw new Error("Error al guardar");
    // } catch (error) {
    //   console.error("Error guardando dirección", error);
    // }
    */

    // Limpiamos el formulario y cerramos la vista de añadir
    setAddressForm({ estado: '', ciudad: '', cp: '', calle: '', numero: '', colonia: '' });
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = (indexToDelete) => {
    if (window.confirm("¿Seguro que deseas eliminar esta dirección?")) {
      setDirecciones(direcciones.filter((_, index) => index !== indexToDelete));
    }
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
                  <div key={index} className="border border-gray-200 p-6 flex flex-col h-48 bg-gray-50 relative group">
                    <button 
                      onClick={() => handleDeleteAddress(index)}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar dirección"
                    >
                      <Trash2 size={18} />
                    </button>
                    <h3 className="font-bold text-sm mb-2 text-black uppercase w-5/6">Dirección {index + 1}</h3>
                    <p className="text-sm text-gray-600">{dir.calle} #{dir.numero}</p>
                    <p className="text-sm text-gray-600">{dir.colonia}</p>
                    <p className="text-sm text-gray-600">{dir.ciudad}, {dir.estado} C.P. {dir.cp}</p>
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
                  {/* Select de Estado */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Estado</label>
                      <select 
                        name="estado" 
                        value={addressForm.estado} 
                        onChange={handleAddressChange} 
                        required
                        className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm appearance-none bg-white"
                      >
                        <option value="" disabled>Selecciona tu estado</option>
                        {Object.keys(estadosYCiudades).map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>

                    {/* Select de Ciudad */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Ciudad/Municipio</label>
                      <select 
                        name="ciudad" 
                        value={addressForm.ciudad} 
                        onChange={handleAddressChange} 
                        required
                        disabled={!addressForm.estado}
                        className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <option value="" disabled>Selecciona tu ciudad</option>
                        {ciudadesDisponibles.map(ciudad => (
                          <option key={ciudad} value={ciudad}>{ciudad}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Código Postal (Min/Max 5) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">C.P.</label>
                      <input 
                        type="text" 
                        name="cp" 
                        value={addressForm.cp} 
                        onChange={handleAddressChange} 
                        placeholder="00000" 
                        required
                        pattern="[0-9]{5}"
                        maxLength="5"
                        minLength="5"
                        title="El código postal debe contener exactamente 5 números"
                        className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm"
                      />
                    </div>
                    {/* Colonia */}
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Colonia</label>
                      <input 
                        type="text" 
                        name="colonia" 
                        value={addressForm.colonia} 
                        onChange={handleAddressChange} 
                        placeholder="Ej. Centro" 
                        required
                        className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm"
                      />
                    </div>
                  </div>

                  {/* Calle y Número */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Calle</label>
                      <input 
                        type="text" 
                        name="calle" 
                        value={addressForm.calle} 
                        onChange={handleAddressChange} 
                        placeholder="Nombre de la calle" 
                        required
                        className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500">Número</label>
                      <input 
                        type="text" 
                        name="numero" 
                        value={addressForm.numero} 
                        onChange={handleAddressChange} 
                        placeholder="Int/Ext" 
                        required
                        className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-black transition-colors text-sm"
                      />
                    </div>
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