import React from 'react';
import ProductCard from '../components/ProductCard';

const Niños = () => {
  const filtros = ["Marca", "Precio", "Color", "Talla", "Modelo", "Colaboraciones", "Usos"];
  const productos = Array(8).fill({
    name: "Tenis Adidas Campus 00s",
    brand: "Adidas",
    price: "2,000.00"
  });

  return (
    <main className="max-w-7xl mx-auto px-10 py-12">
      <h1 className="text-4xl font-black mb-10 uppercase italic">Niños</h1>

      <div className="flex flex-wrap gap-3 mb-16">
        {filtros.map(f => (
          <button key={f} className="px-6 py-2 bg-[#f0f0f0] rounded-full text-[10px] font-bold uppercase hover:bg-gray-200 transition-colors">
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
        {productos.map((shoe, index) => (
          <ProductCard key={index} shoeName={shoe.name} brand={shoe.brand} price={shoe.price} />
        ))}
      </div>
    </main>
  );
};

export default Niños;