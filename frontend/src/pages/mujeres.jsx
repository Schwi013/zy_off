import React from 'react';
import ProductCard from '../components/ProductCard';

const Mujeres = () => {
  const filtros = ["Marca", "Precio", "Color", "Talla", "Modelo", "Colaboraciones", "Usos"];
  
const productos = [
    { id: "mujeres-1", name: "Tenis Nike Dunk Low Rose", brand: "Nike", price: "2,300.00" },
    { id: "mujeres-2", name: "Tenis Adidas Campus 00s", brand: "Adidas", price: "2,000.00" },
    { id: "mujeres-3", name: "Tenis New Balance 550", brand: "New Balance", price: "2,800.00" },
    { id: "mujeres-4", name: "Tenis Converse Run Star Hike", brand: "Converse", price: "1,900.00" }
  ];

  return (
    <main className="max-w-7xl mx-auto px-10 py-12">
      <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-black mb-6 md:mb-8 uppercase italic tracking-tighter text-black">
        Mujeres
      </h1>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
        {productos.map((shoe) => (
          <ProductCard 
            key={shoe.id} 
            id={shoe.id} 
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