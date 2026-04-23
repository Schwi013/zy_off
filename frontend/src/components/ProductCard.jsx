import React from 'react';
import { useCart } from '../context/CartContext'; // <-- 1. Importamos el contexto

// <-- 2. Añadimos 'id' a los props recibidos
const ProductCard = ({ id, shoeName, brand, price, imageUrl }) => {
  const { addToCart } = useCart(); // <-- Extraemos la función

  const handleAdd = (e) => {
    e.stopPropagation(); // Evita que el clic en el botón active otras cosas de la tarjeta
    
    // Armamos el "paquete" de datos que viajará a la bolsa
    const producto = {
      id,
      name: shoeName,
      brand,
      // Si el precio viene como texto "2,000.00", le quitamos las comas para poder hacer sumas matemáticas después
      price: typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price,
      image: imageUrl || "https://via.placeholder.com/150"
    };
    
    addToCart(producto);
  };

  return (
    <div className="group cursor-pointer">
      {/* TU CONTENEDOR DE IMAGEN INTACTO */}
      <div className="aspect-square w-full bg-[#f6f6f6] rounded-xl flex items-center justify-center overflow-hidden mb-4 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={shoeName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-6xl opacity-10"></div>
        )}
      </div>
      
      {/* TUS TEXTOS INTACTOS */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-800 truncate">{shoeName}</h3>
        <p className="text-sm font-black text-black uppercase">{brand}</p>
        <p className="text-sm font-bold text-gray-900 mt-2">$ {price}</p>
      </div>

      {/* <-- 3. EL NUEVO BOTÓN DE AÑADIR --> */}
      <button 
        onClick={handleAdd}
        className="w-full mt-4 bg-black text-white py-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-colors shadow-sm active:scale-95 rounded-lg opacity-0 group-hover:opacity-100"
      >
        Añadir a la bolsa
      </button>
    </div>
  );
};

export default ProductCard;