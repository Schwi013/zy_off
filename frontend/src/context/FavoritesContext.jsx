import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // Cargamos favoritos iniciales del localStorage para que no se borren al recargar
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('zyoff_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('zyoff_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const isAlreadyFav = prev.some((item) => item.id === product.id);
      if (isAlreadyFav) {
        // Si ya está, lo quitamos
        return prev.filter((item) => item.id !== product.id);
      } else {
        // Si no está, lo agregamos
        return [...prev, product];
      }
    });
  };

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);