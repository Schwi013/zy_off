import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AuthModal from './components/AuthModal';
import Hombres from './pages/Hombres'; 
import Destacados from './pages/Destacados'; 
import Mujeres from './pages/Mujeres';
import Child from './pages/Child';
import Perfil from './pages/Perfil';
import Carrito from './pages/Carrito';
import Pedidos from './pages/Pedidos';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Favorites from './pages/Favorites';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 1. IDs ÚNICOS PARA LA PÁGINA DE INICIO (home-1, home-2, etc.)
  const recomendados = [
    { id: "home-1", name: "Tenis Adidas Campus 00s", brand: "Adidas", price: "2,000.00" },
    { id: "home-2", name: "Tenis Nike Dunk High", brand: "Nike", price: "2,499.00" },
    { id: "home-3", name: "Tenis Jordan 1 Retro Low", brand: "Jordan", price: "3,100.00" }, // Le cambié el nombre a este para que se note la diferencia
  ];

  const HomePage = () => (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-10 py-12">
        <h2 className="text-2xl font-black uppercase mb-8 italic tracking-tighter">Lo más nuevo</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {recomendados.map(shoe => (
            <ProductCard 
              key={shoe.id} 
              id={shoe.id} // <-- ¡CRÍTICO! Le pasamos el ID único a la tarjeta
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
    <FavoritesProvider>
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans">
          
          <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
          
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
          />

          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/hombres" element={<Hombres/>} />
            <Route path="/destacados" element={<Destacados/>} />
            <Route path="/mujer" element={<Mujeres/>} />
            <Route path="/ninos" element={<Child/>} />
            <Route path="/perfil" element={<Perfil/>} />
            <Route path="/carrito" element={<Carrito/>} />
            <Route path="/pedidos" element={<Pedidos/>} />
          </Routes>

          <footer className="bg-white border-t border-gray-200 py-12 mt-20">
             <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-xs">
               <p>© 2026 Zapateria Zy_Off - Ricardo Ortega y Bryam</p>
             </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
    </FavoritesProvider>
  );
}

export default App;