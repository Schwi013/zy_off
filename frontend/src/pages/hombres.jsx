import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { ChevronDown, ChevronUp, X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const Hombres = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  const [openDropdown, setOpenDropdown] = useState(null);

  // === ESTADO DE FILTROS COMPLETOS ===
  const [filtros, setFiltros] = useState({
    marca: '',
    color: '',
    talla: '',
    categoria: '',
    uso: ''
  });

  const tallaMin = 22;
  const tallaMax = 32;

  const marcas = ["Nike", "Adidas", "Puma", "Jordan", "Converse"];
  const categorias = ["Sneakers", "Deportivos", "Botas", "Sandalias"];
  const usos = ["Casual", "Running", "Basketball", "Entrenamiento", "Skate"];
  
  const coloresDisponibles = [
    { nombre: 'Blanco', hex: '#FFFFFF', border: 'border-gray-200' },
    { nombre: 'Negro', hex: '#000000', border: 'border-black' },
    { nombre: 'Rojo', hex: '#EF4444', border: 'border-red-500' },
    { nombre: 'Azul', hex: '#3B82F6', border: 'border-blue-500' },
    { nombre: 'Gris', hex: '#9CA3AF', border: 'border-gray-400' },
    { nombre: 'Beige', hex: '#F5F5DC', border: 'border-gray-300' }
  ];

  const cargarProductos = async () => {
    setCargando(true);
    try {
      let url = `http://localhost:8000/productos?gender=Hombre&page=${paginaActual}&limit=60`;
      
      if (filtros.marca) url += `&brand=${filtros.marca}`;
      if (filtros.color) url += `&color=${filtros.color}`;
      if (filtros.talla) url += `&size=${filtros.talla}`;
      if (filtros.categoria) url += `&category=${filtros.categoria}`;
      if (filtros.uso && !filtros.categoria) url += `&category=${filtros.uso}`; 

      const response = await fetch(url);
      const data = await response.json();
      setProductos(data.items);
      setTotalPaginas(data.pages);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarProductos();
    window.scrollTo(0, 0);
  }, [paginaActual, filtros]);

  // Cierra los dropdowns si haces click fuera de ellos
  const node = useRef();
  useEffect(() => {
    const handleClickOutside = e => {
      if (node.current && !node.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleFiltroSelect = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
    setPaginaActual(1);
    if (key !== 'talla') setOpenDropdown(null);
  };

  const eliminarFiltro = (key) => {
    setFiltros(prev => ({ ...prev, [key]: key === 'talla' ? 27 : '' }));
    setPaginaActual(1);
  };

  const limpiarTodo = () => {
    setFiltros({ marca: '', color: '', talla: 27, categoria: '', uso: '' });
    setPaginaActual(1);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-12" ref={node}>
      <h1 className="text-5xl md:text-7xl font-black mb-12 uppercase italic tracking-tighter text-black">Hombres</h1>

      {/* === BARRA DE FILTROS DESPLEGABLES === */}
      <div className="flex flex-wrap items-center gap-3 mb-6 z-40 relative">
        
        {/* Dropdown: Marca */}
        <div className="relative">
          <button onClick={() => toggleDropdown('marca')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${openDropdown === 'marca' ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'}`}>
            Marca {openDropdown === 'marca' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          {openDropdown === 'marca' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 z-50 animate-fade-in">
              {marcas.map(m => (
                <button key={m} onClick={() => handleFiltroSelect('marca', m)} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase transition-colors hover:bg-gray-50 ${filtros.marca === m ? 'text-red-600 bg-red-50/50' : 'text-gray-700'}`}>
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown: Color (Círculos) */}
        <div className="relative">
          <button onClick={() => toggleDropdown('color')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${openDropdown === 'color' ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'}`}>
            Color {openDropdown === 'color' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          {openDropdown === 'color' && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl border border-gray-100 p-5 z-50">
              <div className="grid grid-cols-3 gap-4">
                {coloresDisponibles.map(c => (
                  <button
                    key={c.nombre}
                    onClick={() => handleFiltroSelect('color', c.nombre)}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${c.border} ${filtros.color === c.nombre ? 'ring-2 ring-black ring-offset-2' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.nombre}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dropdown: Talla (Barra Fluida Corregida) */}
        <div className="relative">
          <button onClick={() => toggleDropdown('talla')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${openDropdown === 'talla' ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'}`}>
            Talla: {filtros.talla} CM {openDropdown === 'talla' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          {openDropdown === 'talla' && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 p-6 z-50">
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black text-gray-400">{tallaMin}</span>
                <span className="text-[10px] font-black text-gray-400">{tallaMax}</span>
              </div>
              
              {/* Contenedor del Slider */}
              <div className="relative h-2 bg-gray-100 rounded-full">
                <input 
                  type="range" min={tallaMin} max={tallaMax} step="0.5" value={filtros.talla}
                  onChange={(e) => setFiltros({...filtros, talla: parseFloat(e.target.value)})}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                {/* ⚠️ CORRECCIÓN: Quitamos el "transition-all" para que siga al dedo de forma inmediata */}
                <div 
                  className="absolute top-0 left-0 h-full bg-black rounded-full" 
                  style={{ width: `${((filtros.talla - tallaMin) / (tallaMax - tallaMin)) * 100}%` }} 
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-md pointer-events-none" 
                  style={{ left: `calc(${((filtros.talla - tallaMin) / (tallaMax - tallaMin)) * 100}% - 8px)` }} 
                />
              </div>
              <p className="text-center mt-4 text-[10px] font-black uppercase text-black">Seleccionado: {filtros.talla} CM</p>
            </div>
          )}
        </div>

        {/* Dropdown: Categoría */}
        <div className="relative hidden md:block">
          <button onClick={() => toggleDropdown('categoria')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${openDropdown === 'categoria' ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'}`}>
            Categoría {openDropdown === 'categoria' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          {openDropdown === 'categoria' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 z-50 animate-fade-in">
              {categorias.map(c => (
                <button key={c} onClick={() => handleFiltroSelect('categoria', c)} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase transition-colors hover:bg-gray-50 ${filtros.categoria === c ? 'text-red-600 bg-red-50/50' : 'text-gray-700'}`}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown: Uso */}
        <div className="relative hidden lg:block">
          <button onClick={() => toggleDropdown('uso')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${openDropdown === 'uso' ? 'border-black bg-black text-white' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'}`}>
            Uso {openDropdown === 'uso' ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          {openDropdown === 'uso' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 z-50 animate-fade-in">
              {usos.map(u => (
                <button key={u} onClick={() => handleFiltroSelect('uso', u)} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase transition-colors hover:bg-gray-50 ${filtros.uso === u ? 'text-red-600 bg-red-50/50' : 'text-gray-700'}`}>
                  {u}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón rápido: Limpiar Todo */}
        {(filtros.marca || filtros.color || filtros.categoria || filtros.uso) && (
          <button onClick={limpiarTodo} className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 px-4 py-3 rounded-xl transition-all ml-auto">
            <RotateCcw size={14} /> Limpiar todo
          </button>
        )}
      </div>

      {/* === PILLS DE FILTROS ACTIVOS === */}
      <div className="flex flex-wrap gap-2 mb-10 min-h-[32px]">
        {filtros.marca && (
          <span className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-in fade-in duration-300 shadow-md">
            {filtros.marca} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('marca')} />
          </span>
        )}
        {filtros.color && (
          <span className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-in fade-in duration-300 shadow-md">
            Color: {filtros.color} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('color')} />
          </span>
        )}
        {filtros.categoria && (
          <span className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-in fade-in duration-300 shadow-md">
            {filtros.categoria} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('categoria')} />
          </span>
        )}
        {filtros.uso && (
          <span className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-in fade-in duration-300 shadow-md">
            Uso: {filtros.uso} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('uso')} />
          </span>
        )}
      </div>

      {/* GRILLA DE PRODUCTOS */}
      {cargando ? (
        <div className="flex justify-center items-center py-40"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>
      ) : productos.length === 0 ? (
        <div className="text-center py-40 border-2 border-dashed border-gray-200 bg-gray-50 rounded-3xl">
          <p className="text-sm font-black uppercase text-gray-400 italic">Sin resultados para esta búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
          {productos.map((shoe) => (
            <ProductCard key={shoe.id_variant} shoeName={shoe.name_product} brand={shoe.brand_name} price={shoe.price} imageUrl={shoe.image_url} />
          ))}
        </div>
      )}

      {/* === PAGINACIÓN MODERNA === */}
      {!cargando && totalPaginas > 1 && (
        <div className="mt-24 mb-10 flex flex-col items-center w-full max-w-sm mx-auto">
          <span className="text-xs font-black uppercase tracking-widest mb-6 text-gray-400">Página {paginaActual} de {totalPaginas}</span>
          <div className="flex items-center w-full gap-6">
            <button disabled={paginaActual === 1} onClick={() => setPaginaActual(prev => prev - 1)} className="p-2 text-gray-400 hover:text-black disabled:opacity-20 hover:scale-110 transition-all focus:outline-none">
              <ChevronLeft size={32}/>
            </button>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const bounds = e.currentTarget.getBoundingClientRect();
                  const clickPercentage = (e.clientX - bounds.left) / bounds.width;
                  setPaginaActual(Math.max(1, Math.ceil(clickPercentage * totalPaginas)));
                }}
            >
              <div className="h-full bg-black transition-all duration-500 ease-out" style={{ width: `${(paginaActual / totalPaginas) * 100}%` }} />
            </div>
            <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(prev => prev + 1)} className="p-2 text-gray-400 hover:text-black disabled:opacity-20 hover:scale-110 transition-all focus:outline-none">
              <ChevronRight size={32}/>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Hombres;