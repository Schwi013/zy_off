import React from 'react';
import ProductCard from '../components/ProductCard';

const Mujeres = () => {
  const filtros = ["Marca", "Precio", "Color", "Talla", "Modelo", "Colaboraciones", "Usos"];
  const productos = Array(8).fill({
    name: "Tenis Adidas Campus 00s",
    brand: "Adidas",
    price: "2,000.00"
  });

  return (
    <main className="max-w-7xl mx-auto px-10 py-12">
      
      <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-black mb-6 md:mb-8 uppercase italic tracking-tighter text-black">
        Mujeres
      </h1>

      {/* 2. FILTROS ACTUALIZADOS: Píldoras grises más estilizadas */}
      <div className="flex flex-wrap gap-4 mb-16">
        {filtros.map(f => (
          <button 
            key={f} 
            className="px-6 py-2.5 bg-[#f4f4f4] rounded-full text-[11px] font-black uppercase tracking-wider text-gray-800 hover:bg-gray-200 hover:text-blue-700 transition-colors"
          >
            {f}
          </button>
        ))}
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
        {productos.map((shoe, index) => (
          <ProductCard 
            key={index} 
            shoeName={shoe.name} 
            brand={shoe.brand} 
            price={shoe.price} 
          />
        ))}
      </div>
      
    </main>
  );
};

export default Mujeres;