import React from 'react';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <-- Importamos nuestra "nube" de datos

const Carrito = () => {
  // Extraemos los productos guardados y la función para eliminar
  const { cartItems, removeFromCart } = useCart();

  // Calculamos los totales automáticamente basados en los precios reales
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const costoEnvio = subtotal > 3000 ? 0 : 150; // Envío gratis en compras mayores a $3000
  const total = subtotal + costoEnvio;

  // 1. CONDICIÓN: SI LA BOLSA ESTÁ VACÍA (Muestra el diseño que ya tienes)
  if (cartItems.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-20 min-h-[70vh] flex flex-col justify-center items-center text-center">
        <div className="bg-gray-50 p-12 rounded-full mb-8">
          <ShoppingBag size={80} className="text-gray-200" />
        </div>
        <h1 className="text-4xl font-black uppercase mb-4 tracking-tighter text-black italic">
          Tu bolsa está vacía
        </h1>
        <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">
          Parece que aún no has añadido nada a tu selección. ¡Explora nuestra colección y encuentra tus próximos tenis favoritos!
        </p>
        <Link to="/" className="bg-black text-white px-10 py-4 font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-xl hover:shadow-red-200">
          Empezar a comprar
        </Link>
      </main>
    );
  }

  // 2. CONDICIÓN: SI HAY PRODUCTOS EN LA BOLSA
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <h1 className="text-3xl md:text-5xl font-black mb-10 uppercase italic tracking-tighter text-black">
        Tu Bolsa
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* === LISTA DE PRODUCTOS === */}
        <div className="w-full lg:w-2/3">
          <div className="flex justify-between border-b-2 border-black pb-2 mb-6">
            <span className="font-bold text-xs uppercase tracking-widest text-gray-500">Producto</span>
            <span className="font-bold text-xs uppercase tracking-widest text-gray-500">{cartItems.length} Artículos</span>
          </div>

          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-6 animate-fade-in">
                
                {/* Imagen del producto respetando tu diseño */}
                <div className="w-32 h-32 bg-[#f6f6f6] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden p-2">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  ) : (
                    <ShoppingBag className="text-gray-200 opacity-50" size={40} />
                  )}
                </div>
                
                {/* Detalles del producto */}
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-lg uppercase tracking-tight">{item.name}</h3>
                      <p className="font-bold text-lg">${item.price.toLocaleString('es-MX')}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 uppercase">{item.brand}</p>
                    <p className="text-sm text-gray-500 mt-1 font-bold">Cantidad: {item.quantity}</p>
                  </div>

                  {/* Controles: Botón Eliminar */}
                  <div className="flex justify-end items-center mt-4">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === RESUMEN DEL PEDIDO === */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 p-8 border border-gray-100 sticky top-32 rounded-xl">
            <h2 className="text-xl font-black uppercase mb-6 tracking-tight text-black">Resumen del Pedido</h2>
            
            <div className="space-y-4 text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-black">${subtotal.toLocaleString('es-MX')}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Costo de envío</span>
                <span className="font-bold text-black">
                  {costoEnvio === 0 ? '¡GRATIS!' : `$${costoEnvio.toLocaleString('es-MX')}.00`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-black text-lg uppercase">Total</span>
              <span className="font-black text-2xl text-red-600">${total.toLocaleString('es-MX')}.00</span>
            </div>

            <button className="w-full bg-black text-white py-4 rounded-lg font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-red-600 transition-colors shadow-lg">
              Pasar por caja <ArrowRight size={18} />
            </button>
            
            <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-wider">
              Impuestos incluidos. El envío se calcula en la pantalla de pago.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Carrito;