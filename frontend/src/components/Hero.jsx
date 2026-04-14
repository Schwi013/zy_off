import React, { useState, useEffect } from 'react'; // 1. Importamos useEffect
import { ChevronLeft, ChevronRight } from 'lucide-react';

const discounts = [
  {
    id: 1,
    textLarge: "40%",
    textSmall: "De Descuento",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000",
    gradient: "from-red-950 via-red-900 to-black"
  },
  {
    id: 2,
    textLarge: "30%",
    textSmall: "En Tenis Nike Jordan",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000",
    gradient: "from-blue-950 via-slate-900 to-black"
  },
  {
    id: 3,
    textLarge: "MSI",
    textSmall: "Hasta 12 Meses sin Intereses",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000",
    gradient: "from-green-950 via-emerald-900 to-black"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === discounts.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? discounts.length - 1 : prev - 1));
  };

  // 2. LÓGICA DEL TEMPORIZADOR AUTOMÁTICO
  useEffect(() => {
    // Definimos el intervalo (4000ms = 4 segundos)
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    // IMPORTANTE: Función de limpieza (Cleanup)
    // Esto evita que se creen múltiples temporizadores si el usuario hace clic rápido
    // o si el componente se desmonta.
    return () => clearInterval(interval);

  }, [currentSlide]); // Se reinicia el reloj cada vez que cambia el slide

  const { textLarge, textSmall, image, gradient } = discounts[currentSlide];

  return (
    <div className="w-full relative group">
      <div className={`w-full bg-black flex flex-col md:flex-row h-[480px] overflow-hidden transition-all duration-500 ease-out`}>
        <div className={`flex-1 bg-gradient-to-r ${gradient} flex flex-col justify-center px-12 md:px-16 text-white`}>
          <h3 className="text-xl font-black uppercase italic tracking-widest text-white/70">Hasta</h3>
          <h2 className="text-[12rem] font-black leading-[0.85] text-white">{textLarge}</h2>
          <h4 className="text-5xl font-extrabold uppercase mt-2 text-white leading-tight">{textSmall}</h4>
          <p className="text-xs mt-6 opacity-60 text-white tracking-widest">*En productos seleccionados. Vigencia al 31/03/2026.</p>
        </div>
        
        <div className="flex-1 relative">
          <img 
            src={image} 
            alt="Promo de Zapatería" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        </div>
      </div>

      <button 
        onClick={prevSlide} 
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-2xl"
      >
        <ChevronLeft size={30} />
      </button>

      <button 

        onClick={nextSlide} 
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-2xl"
      >
        <ChevronRight size={30} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {discounts.map((_, index) => (
          <div 
            key={index} 
            className={`w-12 h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;