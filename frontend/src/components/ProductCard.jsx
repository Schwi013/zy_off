import React from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext'; // <-- 1. Importamos el nuevo contexto
import { Heart } from 'lucide-react'; // O cualquier librería de iconos que prefieras

const ProductCard = ({ id, shoeName, brand, price, imageUrl }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites(); // <-- 2. Extraemos funciones de favoritos

  // Verificamos si este producto ya es favorito
  const favorite = isFavorite(id);

  const handleAdd = (e) => {
    e.stopPropagation();
    const producto = {
      id,
      name: shoeName,
      brand,
      price: typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price,
      image: imageUrl || "https://via.placeholder.com/150"
    };
    addToCart(producto);
  };

  // <-- 3. Función para manejar el clic en favoritos
  const handleFavorite = (e) => {
    e.stopPropagation(); // Evitamos que el clic dispare eventos del contenedor
    toggleFavorite({ id, shoeName, brand, price, imageUrl });
  };

  return (
    <div className="group cursor-pointer relative">
      <div className="aspect-square w-full bg-[#f6f6f6] rounded-xl flex items-center justify-center overflow-hidden mb-4 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={shoeName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="text-6xl opacity-10"></div>
        )}

        {/* <-- BOTÓN DE FAVORITOS (Corazón) --> */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all active:scale-90"
        >
          <Heart 
            size={18} 
            className={`transition-colors ${favorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} 
          />
        </button>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-800 truncate">{shoeName}</h3>
        <p className="text-sm font-black text-black uppercase">{brand}</p>
        <p className="text-sm font-bold text-gray-900 mt-2">$ {price}</p>
      </div>

      <button 
        onClick={handleAdd}
        className="w-full mt-4 bg-black text-white py-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-colors shadow-sm active:scale-95 rounded-lg md:opacity-0 md:group-hover:opacity-100"
      >
        Añadir a la bolsa
      </button>
    </div>
  );
};

export default ProductCard;