return (
    <div className="w-full relative group">
      {/* Cambio: Usamos h-[60vh] para que tome el 60% del alto de la pantalla, en lugar de pixeles fijos */}
      <div className={`w-full bg-black flex flex-col md:flex-row h-[70vh] md:h-[60vh] min-h-[450px] overflow-hidden transition-all duration-500 ease-out`}>
        
        <div className={`flex-1 bg-gradient-to-r ${gradient} flex flex-col justify-center px-6 md:px-12 lg:px-16 py-10 md:py-0 text-white z-10`}>
          <h3 className="text-sm md:text-lg lg:text-xl font-black uppercase italic tracking-widest text-white/70">Hasta</h3>
          {/* Cambio: El texto crece desde 6xl en celular hasta 12rem en pantallas gigantes */}
          <h2 className="text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-black leading-[0.85] text-white my-2 md:my-0">{textLarge}</h2>
          <h4 className="text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase mt-2 text-white leading-tight">{textSmall}</h4>
          <p className="text-[9px] md:text-[10px] lg:text-xs mt-4 md:mt-6 opacity-60 text-white tracking-widest">*En productos seleccionados. Vigencia al 31/03/2026.</p>
        </div>
        
        <div className="flex-1 relative h-64 md:h-full">
          <img 
            src={image} 
            alt="Promo de Zapatería" 
            className="w-full h-full object-cover md:object-center object-top group-hover:scale-105 transition-transform duration-700 absolute inset-0" 
          />
        </div>
      </div>

      {/* Botones de navegación ocultos en móvil, visibles en desktop */}
      <button 
        onClick={prevSlide} 
        className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-2xl z-20"
      >
        <ChevronLeft size={30} />
      </button>

      <button 
        onClick={nextSlide} 
        className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 shadow-2xl z-20"
      >
        <ChevronRight size={30} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {discounts.map((_, index) => (
          <div 
            key={index} 
            className={`w-8 md:w-12 h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );