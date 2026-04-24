import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">
        Mis Favoritos ({favorites.length})
      </h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#f6f6f6] rounded-2xl">
          <p className="text-gray-500 font-medium mb-4">Aún no has guardado nada en tus favoritos.</p>
          <a href="/" className="text-sm font-black uppercase underline tracking-widest">
            Explorar tienda
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((zapato) => (
            <ProductCard 
              key={zapato.id}
              id={zapato.id}
              shoeName={zapato.shoeName || zapato.name}
              brand={zapato.brand}
              price={zapato.price}
              imageUrl={zapato.imageUrl || zapato.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;