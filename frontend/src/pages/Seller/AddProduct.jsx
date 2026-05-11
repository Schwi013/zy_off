import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import SellerSidebar from '../../components/SellerSidebar';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    category: 'hombres',
    imageUrl: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Datos del producto a guardar:", formData);
    
    setTimeout(() => {
      /*
      // TODO: BACKEND - GUARDAR PRODUCTO EN BASE DE DATOS (Descomentar al conectar)
      // fetch(`http://localhost:8000/api/productos`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      */

      alert('¡Producto guardado exitosamente!');
      setIsSubmitting(false);
      navigate('/vendedor/dashboard');
    }, 1000);
  };

  const handleLogout = () => {
    alert("Sesión de vendedor cerrada.");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <SellerSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <Link to="/vendedor/dashboard" className="p-3 bg-white border border-gray-200 hover:bg-black hover:text-white hover:border-black rounded-full transition-all shadow-sm">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight">Nuevo Producto</h1>
              <p className="text-gray-500 text-sm mt-1 font-medium">Añade un nuevo par a tu catálogo global.</p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
            <div className="h-3 w-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400"></div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-10">
              
              {/* Image Upload Area (Simulada) */}
              <div>
                <h3 className="text-lg font-black uppercase mb-4 tracking-tight">1. Multimedia</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-black transition-all cursor-pointer group bg-gray-50/50">
                  <div className="p-5 bg-white shadow-sm border border-gray-100 rounded-full mb-6 group-hover:bg-black group-hover:text-white transition-all scale-100 group-hover:scale-110">
                    <Upload size={32} />
                  </div>
                  <h3 className="font-black text-xl mb-2">Arrastra tu foto aquí</h3>
                  <p className="text-gray-400 text-sm font-medium">Archivos soportados: PNG, JPG, WEBP (Max 5MB)</p>
                  
                  <div className="w-full flex items-center gap-4 mt-8 max-w-md">
                    <div className="h-px bg-gray-200 flex-1"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">O pega un enlace</span>
                    <div className="h-px bg-gray-200 flex-1"></div>
                  </div>
                  
                  <div className="mt-6 w-full max-w-md flex items-center bg-white border border-gray-200 rounded-2xl overflow-hidden focus-within:border-black focus-within:ring-4 focus-within:ring-gray-100 transition-all shadow-sm">
                    <div className="pl-4 text-gray-400"><ImageIcon size={18} /></div>
                    <input 
                      type="text" 
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/imagen.jpg" 
                      className="w-full py-3.5 px-4 outline-none text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Formularios */}
              <div>
                <h3 className="text-lg font-black uppercase mb-6 tracking-tight">2. Detalles del Producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Nombre del Zapato</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Nike Air Max 90"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-5 outline-none focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Marca</label>
                    <div className="relative">
                      <select 
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-5 outline-none focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-sm font-bold appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Seleccionar...</option>
                        <option value="Nike">Nike</option>
                        <option value="Adidas">Adidas</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Puma">Puma</option>
                        <option value="Converse">Converse</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Precio de Venta ($)</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                      <input 
                        type="number" 
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-10 pr-5 outline-none focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Inventario Inicial</label>
                    <input 
                      type="number" 
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Cantidad en unidades"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-5 outline-none focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-4 md:col-span-2 mt-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">Categoría Objetivo</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['hombres', 'mujeres', 'ninos'].map(cat => (
                        <label key={cat} className="relative cursor-pointer group">
                          <input 
                            type="radio" 
                            name="category" 
                            value={cat}
                            checked={formData.category === cat}
                            onChange={handleChange}
                            className="peer sr-only" 
                          />
                          <div className="py-4 text-center border-2 border-gray-100 rounded-2xl font-black text-sm uppercase text-gray-400 peer-checked:border-black peer-checked:bg-black peer-checked:text-white transition-all group-hover:border-gray-300 shadow-sm">
                            {cat === 'ninos' ? 'Niños' : cat}
                          </div>
                          {formData.category === cat && (
                            <div className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
                <Link to="/vendedor/dashboard" className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all text-gray-500">
                  Cancelar
                </Link>
                <button 
                  type="submit"
                  className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-red-200 hover:-translate-y-1"
                >
                  Publicar Producto
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
