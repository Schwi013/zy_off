import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';

function App() {
  const destacados = [
    { id: 1, name: "Tenis Adidas Campus 00s", brand: "Adidas", price: "2,000.00" },
    { id: 2, name: "Tenis Nike Dunk High", brand: "Nike", price: "2,499.00" },
    { id: 3, name: "Tenis Adidas Campus 00s", brand: "Adidas", price: "2,000.00" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-10 py-12">
        <h2 className="text-2xl font-black uppercase mb-8">Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {destacados.map(shoe => (
            <ProductCard 
              key={shoe.id} 
              shoeName={shoe.name} 
              brand={shoe.brand} 
              price={shoe.price} 
            />
          ))}
        </div>

        <div className="mt-20 border-t border-gray-1000 pt-20">
          <h2 className="text-center text-2xl font-black mb-8">Las marcas que tenemos para ti</h2>
          <div className="mt-20 border-gray-1000 pt-4"></div>
          <div className="flex flex-wrap gap-20 justify-center">
            {['Adidas', 'Converse', 'Jordan', 'Nike', 'Puma'].map(marca => (
              <div key={marca} className="w-32 h-32 border border-black flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer">
                <span className="font-bold text-xs uppercase">{marca}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-12 mt-20">
         <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-xs">
           <p>© 2026 Zapateria - Ricardo Ortega y Bryam</p>
         </div>
      </footer>
    </div>
  );
}

export default App;