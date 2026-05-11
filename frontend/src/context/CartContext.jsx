import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const getCartKey = () => `zyoff_cart_${localStorage.getItem('currentUser') || 'guest'}`;

  // === LECTURA INICIAL DE LOCALSTORAGE ===
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(getCartKey());
    return savedCart ? JSON.parse(savedCart) : [];
  });

  /* 
  // TODO: BACKEND - LECTURA INICIAL DEL CARRITO (Descomentar al conectar con FastAPI/Redis)
  useEffect(() => {
    const fetchCart = async () => {
      const email = localStorage.getItem('currentUser') || 'guest';
      try {
        const response = await fetch(`http://localhost:8000/api/carrito/${email}`);
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
      }
    };
    fetchCart();
  }, [currentUser]);
  */

  // === GUARDADO EN LOCALSTORAGE ===
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
    
    /*
    // TODO: BACKEND - GUARDAR CARRITO EN REDIS (Descomentar al conectar con FastAPI/Redis)
    // Cada vez que cambie cartItems, lo enviamos al backend para que actualice Redis
    const syncCart = async () => {
      const email = localStorage.getItem('currentUser') || 'guest';
      try {
        await fetch(`http://localhost:8000/api/carrito/${email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartItems)
        });
      } catch (error) {
        console.error("Error al sincronizar carrito:", error);
      }
    };
    // if (cartItems.length > 0 || localStorage.getItem(getCartKey())) {
    //   syncCart();
    // }
    */
  }, [cartItems]);

  const addToCart = (product) => {
    // Verificamos si el producto ya está en la bolsa para solo sumar cantidad
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.find((item) => item.id === product.id);
      if (isItemInCart) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    /*
    // TODO: BACKEND - VACIAR CARRITO (Descomentar al conectar)
    // const email = localStorage.getItem('currentUser') || 'guest';
    // fetch(`http://localhost:8000/api/carrito/${email}`, { method: 'DELETE' });
    */
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);