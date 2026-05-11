import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const getFavoritesKey = () => `zyoff_favorites_${localStorage.getItem('currentUser') || 'guest'}`;

  // === LECTURA INICIAL DE LOCALSTORAGE ===
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem(getFavoritesKey());
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  /*
  // TODO: BACKEND - LECTURA INICIAL DE FAVORITOS (Descomentar al conectar)
  useEffect(() => {
    const fetchFavorites = async () => {
      const email = localStorage.getItem('currentUser') || 'guest';
      try {
        const response = await fetch(`http://localhost:8000/api/favoritos/${email}`);
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
      }
    };
    fetchFavorites();
  }, []);
  */

  // === GUARDADO EN LOCALSTORAGE ===
  useEffect(() => {
    localStorage.setItem(getFavoritesKey(), JSON.stringify(favorites));

    /*
    // TODO: BACKEND - GUARDAR FAVORITOS EN REDIS/DB (Descomentar al conectar)
    const syncFavorites = async () => {
      const email = localStorage.getItem('currentUser') || 'guest';
      try {
        await fetch(`http://localhost:8000/api/favoritos/${email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(favorites)
        });
      } catch (error) {
        console.error("Error al sincronizar favoritos:", error);
      }
    };
    // syncFavorites();
    */
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