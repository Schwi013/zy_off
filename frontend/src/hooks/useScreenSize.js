import { useState, useEffect } from 'react';

export const useScreenSize = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // Suscribirse al evento de la ventana
    window.addEventListener('resize', handleResize);

    // Limpiar el evento al desmontar (regla de oro de ingeniería)
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024
  };
};