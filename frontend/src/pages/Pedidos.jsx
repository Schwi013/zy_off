import React from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pedidos = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-20 min-h-[70vh] flex flex-col justify-center items-center text-center">
      {/* Icono decorativo de caja/paquete */}
      <div className="bg-gray-50 p-12 rounded-full mb-8">
        <Package size={80} className="text-gray-200" />
      </div>
      
      <h1 className="text-4xl font-black uppercase mb-4 tracking-tighter text-black italic">
        Aún no tienes pedidos
      </h1>
      
      <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">
        Cuando realices tu primera compra en ZY OFF, podrás hacer el seguimiento y gestionar tus entregas desde aquí.
      </p>

      {/* Botón para regresar a la tienda */}
      <Link 
        to="/" 
        className="bg-black text-white px-10 py-4 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-xl hover:shadow-red-200"
      >
        Empezar a explorar
      </Link>
    </main>
  );
};

export default Pedidos;