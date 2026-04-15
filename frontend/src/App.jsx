import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AuthModal from './components/AuthModal';
import Hombres from './pages/hombres'; 
import Destacados from './pages/destacados'; 
import Mujeres from './pages/mujeres';
import Niños from './pages/niños';


function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 1. Cambiamos el nombre de la constante para evitar confusión
  const recomendados = [
    { id: 1, name: "Tenis Adidas Campus 00s", brand: "Adidas", price: "2,000.00" },
    { id: 2, name: "Tenis Nike Dunk High", brand: "Nike", price: "2,499.00" },
    { id: 3, name: "Tenis Adidas Campus 00s", brand: "Adidas", price: "2,000.00" },
  ];

  // 2. Definimos la Página de Inicio (Home) como un componente interno
  const HomePage = () => (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-10 py-12">
        {/* Cambiamos el título aquí para diferenciarlo de la página Destacados */}
        <h2 className="text-2xl font-black uppercase mb-8 italic tracking-tighter">Lo más nuevo</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {recomendados.map(shoe => (
            <ProductCard 
              key={shoe.id} 
              shoeName={shoe.name} 
              brand={shoe.brand} 
              price={shoe.price} 
            />
          ))}
        </div>

        <div className="mt-20 border-t border-gray-200 pt-20">
          <h2 className="text-center text-2xl font-black mb-12 uppercase tracking-tight">
            Las marcas que tenemos para ti
          </h2>
          <div className="flex flex-wrap gap-12 justify-center">
            {['Adidas', 'Converse', 'Jordan', 'Nike', 'Puma'].map(marca => (
              <div 
                key={marca} 
                className="w-32 h-32 border border-black flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer group hover:bg-black hover:text-white"
              >
                <span className="font-bold text-xs uppercase tracking-widest">{marca}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans">
        {/* La Navbar siempre visible */}
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
        
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />

        {/* Definición de Rutas: Aquí decides qué se muestra según la URL */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hombres" element={<Hombres />} />
          <Route path="/destacados" element={<Destacados />} />
          <Route path="/mujer" element={<Mujeres />} />
          <Route path="/ninos" element={<Niños />} />
        </Routes>

        <footer className="bg-white border-t border-gray-200 py-12 mt-20">
           <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-xs">
             <p>© 2026 Zapateria - Ricardo Ortega y Bryam</p>
           </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;