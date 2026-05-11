import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Favorites from './pages/Favorites';
import SellerDashboard from './pages/Seller/SellerDashboard';
import AddProduct from './pages/Seller/AddProduct';
import Inventory from './pages/Seller/Inventory';
import Reports from './pages/Seller/Reports';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 1. IDs ÚNICOS PARA LA PÁGINA DE INICIO (home-1, home-2, etc.)
  const [recomendados, setRecomendados] = useState([
    { id: "home-1", name: "Tenis Adidas Campus 00s", brand: "Adidas", price: "2,000.00" },
    { id: "home-2", name: "Tenis Nike Dunk High", brand: "Nike", price: "2,499.00" },
    { id: "home-3", name: "Tenis Jordan 1 Retro Low", brand: "Jordan", price: "3,100.00" },
  ]);

  /*
  // TODO: BACKEND - LECTURA DE PRODUCTOS RECIENTES (Descomentar al conectar)
  // useEffect(() => {
  //   const fetchRecentProducts = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/api/productos/recientes');
  //       if (response.ok) {
  //         const data = await response.json();
  //         setRecomendados(data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching recent products", error);
  //     }
  //   };
  //   fetchRecentProducts();
  // }, []);
  */

  const HomePage = () => (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-10 py-12">
        <h2 className="text-2xl font-black uppercase mb-8 italic tracking-tighter">Lo más nuevo</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {recomendados.map(shoe => (
            <ProductCard 
              key={shoe.id} 
              id={shoe.id} // <--  Le pasé el ID único a la tarjeta - Ricardo
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

  const AppContent = () => {
    const location = useLocation();
    const isSellerRoute = location.pathname.startsWith('/vendedor');

    return (
      <div className="min-h-screen bg-white font-sans">
        
        {!isSellerRoute && <Navbar onOpenAuth={() => setIsAuthOpen(true)} />}
        
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
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/pedidos" element={<Pedidos/>} />
          {/* Rutas de Vendedor */}
          <Route path="/vendedor/dashboard" element={<SellerDashboard />} />
          <Route path="/vendedor/nuevo-producto" element={<AddProduct />} />
          <Route path="/vendedor/inventario" element={<Inventory />} />
          <Route path="/vendedor/reportes" element={<Reports />} />
        </Routes>

        {!isSellerRoute && (
          <footer className="bg-white border-t border-gray-200 py-12 mt-20">
             <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-xs">
               <p>© 2026 Zapateria Zy_Off - Ricardo Ortega y Bryam</p>
             </div>
          </footer>
        )}
      </div>
    );
  };

  return (
    <FavoritesProvider>
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
    </FavoritesProvider>
  );
}

export default App;