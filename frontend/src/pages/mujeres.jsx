import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { ChevronDown, ChevronUp, X, RotateCcw, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

const Mujeres = () => {
  const genderTarget = "Mujer,Unisex"; 
  const displaytittle = ["Mujeres"];
  
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // === ESTADO DE OPCIONES DINÁMICAS (Desde el Backend) ===
  const [opcionesBackend, setOpcionesBackend] = useState({
    marcas: [], 
    colores: [],
    categorias: [], 
    usos: [],
    talla_min: 22, 
    talla_max: 32, 
    precio_min: 0, 
    precio_max: 5000
  });

  const [filtros, setFiltros] = useState({
    marca: '', color: '', talla: '', precio: '', categoria: '', uso: ''
  });

  const [localTalla, setLocalTalla] = useState('');
  const [localPrecio, setLocalPrecio] = useState(''); 

  // Detector de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. OBTENER FILTROS REALES
  const cargarOpcionesFiltros = async () => {
    try {
      const response = await fetch(`http://localhost:8000/filtros-disponibles?gender=${genderTarget}`);
      const data = await response.json();
      setOpcionesBackend(data);
    } catch (error) {
      console.error("Error cargando opciones de filtros:", error);
    }
  };

  // 2. OBTENER PRODUCTOS
  const cargarProductos = async () => {
    setCargando(true);
    try {
      let url = `http://localhost:8000/productos?gender=${genderTarget}&page=${paginaActual}&limit=60`;
      if (filtros.marca) url += `&brand=${filtros.marca}`;
      if (filtros.color) url += `&color=${filtros.color}`;
      if (filtros.talla) url += `&size=${filtros.talla}`;
      if (filtros.categoria) url += `&category=${filtros.categoria}`;
      if (filtros.uso) url += `&uso=${filtros.uso}`; 
      if (filtros.precio) url += `&max_price=${filtros.precio}`;

      const response = await fetch(url);
      const data = await response.json();
      setProductos(data.items || []);
      setTotalPaginas(data.pages || 1);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
    setCargando(false);
  };

  // Cargar filtros al inicio
  useEffect(() => {
    cargarOpcionesFiltros();
  }, []);

  // Cargar productos cuando cambie la página o un filtro
  useEffect(() => {
    cargarProductos();
    window.scrollTo(0, 0);
  }, [paginaActual, filtros]);

  // Cerrar dropdowns al hacer clic fuera de ellos (Escritorio)
  const node = useRef();
  useEffect(() => {
    const handleClickOutside = e => {
      if (node.current && !node.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Manejadores de interacción
  const handleFiltroSelect = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
    setPaginaActual(1);
    // Cierra el dropdown en PC, excepto si es un slider
    if (key !== 'talla' && key !== 'precio' && !isMobile) setOpenDropdown(null);
  };

  const eliminarFiltro = (key) => {
    setFiltros(prev => ({ ...prev, [key]: '' }));
    if (key === 'talla') setLocalTalla('');
    if (key === 'precio') setLocalPrecio('');
    setPaginaActual(1);
  };

  const limpiarTodo = () => {
    setFiltros({ marca: '', color: '', talla: '', precio: '', categoria: '', uso: '' });
    setLocalTalla('');
    setLocalPrecio('');
    setPaginaActual(1);
    setShowMobileFilters(false);
  };

  // Estilo dinámico para los botones de escritorio
  const getButtonStyle = (key) => {
    if (filtros[key] !== '') return 'bg-red-600 text-white border-red-600 shadow-md shadow-red-200';
    if (openDropdown === key) return 'bg-black text-white border-black';
    return 'bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300';
  };

  // === COMPONENTES DE SLIDERS REUTILIZABLES ===
  const renderTallaSlider = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Talla: {localTalla ? `${localTalla} CM` : 'Todas'}
        </label>
        {localTalla && <span className="text-[10px] font-black text-gray-400">{opcionesBackend.talla_min} - {opcionesBackend.talla_max}</span>}
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full">
        <input 
          type="range" min={opcionesBackend.talla_min} max={opcionesBackend.talla_max} step="0.5" 
          value={localTalla || opcionesBackend.talla_min} 
          onChange={(e) => setLocalTalla(parseFloat(e.target.value))}
          onMouseUp={() => handleFiltroSelect('talla', localTalla)}
          onTouchEnd={() => handleFiltroSelect('talla', localTalla)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 touch-none"
        />
        <div className="absolute top-0 left-0 h-full bg-black rounded-full pointer-events-none" style={{ width: `${localTalla ? ((localTalla - opcionesBackend.talla_min) / (opcionesBackend.talla_max - opcionesBackend.talla_min)) * 100 : 0}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-black rounded-full shadow-md pointer-events-none z-10" style={{ left: `calc(${localTalla ? ((localTalla - opcionesBackend.talla_min) / (opcionesBackend.talla_max - opcionesBackend.talla_min)) * 100 : 0}% - 10px)` }} />
      </div>
    </div>
  );

  const renderPrecioSlider = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Precio Max: {localPrecio ? `$${localPrecio}` : 'Todos'}
        </label>
        {localPrecio && <span className="text-[10px] font-black text-gray-400">${opcionesBackend.precio_min} - ${opcionesBackend.precio_max}</span>}
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full">
        <input 
          type="range" min={opcionesBackend.precio_min} max={opcionesBackend.precio_max} step="100" 
          value={localPrecio || opcionesBackend.precio_max} 
          onChange={(e) => setLocalPrecio(parseFloat(e.target.value))}
          onMouseUp={() => handleFiltroSelect('precio', localPrecio)}
          onTouchEnd={() => handleFiltroSelect('precio', localPrecio)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 touch-none"
        />
        <div className="absolute top-0 left-0 h-full bg-black rounded-full pointer-events-none" style={{ width: `${localPrecio ? ((localPrecio - opcionesBackend.precio_min) / (opcionesBackend.precio_max - opcionesBackend.precio_min)) * 100 : 0}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-black rounded-full shadow-md pointer-events-none z-10" style={{ left: `calc(${localPrecio ? ((localPrecio - opcionesBackend.precio_min) / (opcionesBackend.precio_max - opcionesBackend.precio_min)) * 100 : 0}% - 10px)` }} />
      </div>
    </div>
  );

  const hayFiltros = filtros.marca || filtros.color || filtros.talla || filtros.precio || filtros.categoria || filtros.uso;

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-12 relative" ref={node}>
      <h1 className="text-5xl md:text-7xl lg:text-[4rem] font-black mb-8 lg:mb-12 uppercase italic tracking-tighter text-black">{displaytittle}</h1>

      {/* === CABECERA DE FILTROS DINÁMICA === */}
      <div className="flex items-center justify-between mb-8">
        
        {/* Botón Móvil */}
        <button onClick={() => setShowMobileFilters(true)} className={`lg:hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95 ${hayFiltros ? 'bg-red-600 text-white' : 'bg-black text-white'}`}>
          <SlidersHorizontal size={16} /> Filtros {hayFiltros && <span className="w-2 h-2 bg-white rounded-full inline-block flex-shrink-0"></span>}
        </button>

        {/* Botones de Escritorio */}
        <div className="hidden lg:flex flex-wrap items-center gap-3">
          
          <div className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === 'marca' ? null : 'marca')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${getButtonStyle('marca')}`}>
              Marca {openDropdown === 'marca' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            {openDropdown === 'marca' && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 z-50 animate-fade-in">
                {opcionesBackend.marcas.map(m => <button key={m} onClick={() => handleFiltroSelect('marca', m)} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase transition-colors hover:bg-gray-50 ${filtros.marca === m ? 'text-red-600 bg-red-50/50' : 'text-gray-700'}`}>{m}</button>)}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === 'color' ? null : 'color')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${getButtonStyle('color')}`}>
              Color {openDropdown === 'color' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            {openDropdown === 'color' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-2xl rounded-2xl border border-gray-100 p-5 z-50 animate-fade-in">
                <div className="grid grid-cols-3 gap-4">
                  {opcionesBackend.colores.map(colorObj => (
                    <button 
                      key={colorObj.nombre} 
                      onClick={() => handleFiltroSelect('color', colorObj.nombre)} 
                      title={colorObj.nombre}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 border-gray-200 shadow-sm ${filtros.color === colorObj.nombre ? 'ring-2 ring-black ring-offset-2 scale-110' : ''}`} 
                      style={{ backgroundColor: colorObj.hex }} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === 'talla' ? null : 'talla')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${getButtonStyle('talla')}`}>
              Talla {openDropdown === 'talla' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            {openDropdown === 'talla' && <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 p-6 z-50 animate-fade-in">{renderTallaSlider()}</div>}
          </div>

          <div className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === 'precio' ? null : 'precio')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${getButtonStyle('precio')}`}>
              Precio {openDropdown === 'precio' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            {openDropdown === 'precio' && <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl border border-gray-100 p-6 z-50 animate-fade-in">{renderPrecioSlider()}</div>}
          </div>

          <div className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === 'categoria' ? null : 'categoria')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${getButtonStyle('categoria')}`}>
              Categoría {openDropdown === 'categoria' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            {openDropdown === 'categoria' && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 z-50 animate-fade-in">
                {opcionesBackend.categorias.map(c => <button key={c} onClick={() => handleFiltroSelect('categoria', c)} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase transition-colors hover:bg-gray-50 ${filtros.categoria === c ? 'text-red-600 bg-red-50/50' : 'text-gray-700'}`}>{c}</button>)}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setOpenDropdown(openDropdown === 'uso' ? null : 'uso')} className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${getButtonStyle('uso')}`}>
              Uso {openDropdown === 'uso' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
            </button>
            {openDropdown === 'uso' && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 z-50 animate-fade-in">
                {opcionesBackend.usos.map(u => <button key={u} onClick={() => handleFiltroSelect('uso', u)} className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase transition-colors hover:bg-gray-50 ${filtros.uso === u ? 'text-red-600 bg-red-50/50' : 'text-gray-700'}`}>{u}</button>)}
              </div>
            )}
          </div>

        </div>

        {hayFiltros && (
          <button onClick={limpiarTodo} className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest hover:underline px-4 transition-all">
            <RotateCcw size={14} /> Limpiar todo
          </button>
        )}
      </div>

      {/* === MENÚ LATERAL (MÓVIL) === */}
      {showMobileFilters && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-8 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-black uppercase tracking-tighter italic">Filtros</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Marca</label>
                <div className="flex flex-wrap gap-2">
                  {opcionesBackend.marcas.map(m => <button key={m} onClick={() => handleFiltroSelect('marca', m)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase border-2 transition-all ${filtros.marca === m ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-200' : 'border-gray-100 bg-gray-50 text-gray-600'}`}>{m}</button>)}
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Color</label>
                <div className="flex gap-4 flex-wrap">
                  {opcionesBackend.colores.map(colorObj => (
                    <button 
                      key={colorObj.nombre} 
                      onClick={() => handleFiltroSelect('color', colorObj.nombre)} 
                      title={colorObj.nombre}
                      className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 border-gray-200 shadow-sm ${filtros.color === colorObj.nombre ? 'ring-2 ring-black ring-offset-2 scale-110' : ''}`} 
                      style={{ backgroundColor: colorObj.hex }} 
                    />
                  ))}
                </div>
              </div>

              {renderTallaSlider()}
              {renderPrecioSlider()}

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {opcionesBackend.categorias.map(c => <button key={c} onClick={() => handleFiltroSelect('categoria', c)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase border-2 transition-all ${filtros.categoria === c ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-200' : 'border-gray-100 bg-gray-50 text-gray-600'}`}>{c}</button>)}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Uso</label>
                <div className="flex flex-wrap gap-2">
                  {opcionesBackend.usos.map(u => <button key={u} onClick={() => handleFiltroSelect('uso', u)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase border-2 transition-all ${filtros.uso === u ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-200' : 'border-gray-100 bg-gray-50 text-gray-600'}`}>{u}</button>)}
                </div>
              </div>
            </div>

            <div className="p-8 pt-4 border-t border-gray-100 bg-white z-50">
              <button onClick={() => setShowMobileFilters(false)} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-red-600 transition-colors">
                Ver resultados
              </button>
            </div>
          </div>
        </>
      )}

      {/* === PILLS DE FILTROS ACTIVOS === */}
      <div className="flex flex-wrap gap-2 mb-10 min-h-[32px]">
        {filtros.marca && <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 animate-in fade-in zoom-in duration-300 shadow-md">{filtros.marca} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('marca')}/></span>}
        {filtros.color && <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 animate-in fade-in zoom-in duration-300 shadow-md">Color: {filtros.color} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('color')}/></span>}
        {filtros.talla && <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 animate-in fade-in zoom-in duration-300 shadow-md">Talla: {filtros.talla} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('talla')}/></span>}
        {filtros.precio && <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 animate-in fade-in zoom-in duration-300 shadow-md">Max: ${filtros.precio} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('precio')}/></span>}
        {filtros.categoria && <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 animate-in fade-in zoom-in duration-300 shadow-md">{filtros.categoria} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('categoria')}/></span>}
        {filtros.uso && <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-2 animate-in fade-in zoom-in duration-300 shadow-md">{filtros.uso} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => eliminarFiltro('uso')}/></span>}
      </div>

      {/* === GRILLA DE PRODUCTOS === */}
      {cargando ? (
        <div className="flex justify-center items-center py-40 animate-pulse text-gray-300 font-black uppercase tracking-[0.3em]">Cargando Catálogo...</div>
      ) : productos.length === 0 ? (
        <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-black uppercase">Sin resultados en esta sección</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12">
          {productos.map((shoe) => (
            <ProductCard key={shoe.id_variant} shoeName={shoe.name_product} brand={shoe.brand_name} price={shoe.price} imageUrl={shoe.image_url} />
          ))}
        </div>
      )}

      {/* === PAGINACIÓN === */}
      {!cargando && totalPaginas > 1 && (
        <div className="mt-24 mb-10 flex flex-col items-center w-full max-w-sm mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest mb-4 text-gray-400">Página {paginaActual} de {totalPaginas}</span>
          <div className="flex items-center w-full gap-4">
            <button disabled={paginaActual === 1} onClick={() => setPaginaActual(prev => prev - 1)} className="disabled:opacity-10 hover:scale-110 transition-transform"><ChevronLeft size={28}/></button>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const bounds = e.currentTarget.getBoundingClientRect();
                   setPaginaActual(Math.max(1, Math.ceil(((e.clientX - bounds.left) / bounds.width) * totalPaginas)));
                }}
            >
              <div className="h-full bg-black transition-all duration-500 ease-out" style={{ width: `${(paginaActual / totalPaginas) * 100}%` }} />
            </div>
            <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(prev => prev + 1)} className="disabled:opacity-10 hover:scale-110 transition-transform"><ChevronRight size={28}/></button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Mujeres;