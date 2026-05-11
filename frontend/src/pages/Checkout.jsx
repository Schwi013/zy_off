import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, MapPin, Truck } from 'lucide-react';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Calcular totales
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const costoEnvio = subtotal > 3000 ? 0 : 150;
  const total = subtotal + costoEnvio;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Estados para formato de tarjeta
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      // Remover todo lo que no sea número y agregar espacios cada 4
      const v = value.replace(/\D/g, '').substring(0, 16);
      const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
      setCardData({ ...cardData, number: formatted });
    } else if (name === 'expiry') {
      // Remover no números, poner / en el medio
      const v = value.replace(/\D/g, '').substring(0, 4);
      let formatted = v;
      if (v.length > 2) {
        formatted = `${v.substring(0, 2)}/${v.substring(2)}`;
      }
      setCardData({ ...cardData, expiry: formatted });
    } else if (name === 'cvc') {
      // Solo 3 números
      setCardData({ ...cardData, cvc: value.replace(/\D/g, '').substring(0, 3) });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  useEffect(() => {
    // Si no hay nada en la bolsa, lo mandamos de regreso
    if (cartItems.length === 0 && !isProcessing) {
      navigate('/carrito');
    }

    // Cargar direcciones del usuario
    const currentUser = localStorage.getItem('currentUser') || 'guest';
    const savedAddresses = localStorage.getItem(`zyoff_addresses_${currentUser}`);
    if (savedAddresses) {
      const parsed = JSON.parse(savedAddresses);
      setDirecciones(parsed);
      if (parsed.length > 0) {
        setSelectedAddress(0); // Seleccionar la primera por defecto
      }
    }
  }, [cartItems, navigate, isProcessing]);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (direcciones.length === 0) {
      alert("Por favor, agrega una dirección de envío en tu Perfil antes de continuar.");
      return;
    }
    
    // Validar longitud de tarjeta si está en card
    if (paymentMethod === 'card') {
      if (cardData.number.replace(/\s/g, '').length !== 16) {
        alert("El número de tarjeta debe tener 16 dígitos.");
        return;
      }
      if (cardData.expiry.length !== 5) {
        alert("La fecha de vencimiento debe estar completa (MM/YY).");
        return;
      }
      if (cardData.cvc.length !== 3) {
        alert("El CVV debe tener 3 dígitos.");
        return;
      }
    }

    setIsProcessing(true);

    // TODO: BACKEND - Aquí se llamaría a la pasarela de pagos (ej. Stripe, PayPal)
    setTimeout(() => {
      // Guardar pedido en LocalStorage
      const currentUser = localStorage.getItem('currentUser') || 'guest';
      const ordersKey = `zyoff_orders_${currentUser}`;
      const savedOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      
      const newOrder = {
        id: `ZY-${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toLocaleDateString('es-MX'),
        items: cartItems,
        total: total,
        status: 'En Preparación',
        address: direcciones[selectedAddress]
      };

      localStorage.setItem(ordersKey, JSON.stringify([newOrder, ...savedOrders]));

      /*
      // TODO: BACKEND - GUARDAR NUEVO PEDIDO EN REDIS/DB (Descomentar al conectar)
      // fetch(`http://localhost:8000/api/pedidos/${currentUser}`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newOrder)
      // });
      */

      alert("¡Pago procesado exitosamente! Tu pedido está en preparación.");
      clearCart();
      navigate('/pedidos'); // Redirigir a mis pedidos en vez del inicio
    }, 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <Link to="/carrito" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8">
        <ArrowLeft size={16} /> Volver a la bolsa
      </Link>

      <h1 className="text-3xl md:text-5xl font-black mb-10 uppercase italic tracking-tighter text-black">
        Finalizar Compra
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* COLUMNA IZQUIERDA: FORMULARIOS */}
        <div className="w-full lg:w-2/3 space-y-12">
          
          {/* SECCIÓN DE DIRECCIÓN */}
          <section>
            <h2 className="text-xl font-black uppercase mb-6 tracking-tight flex items-center gap-3">
              <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> 
              Dirección de Envío
            </h2>
            
            <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl">
              {direcciones.length > 0 ? (
                <div className="space-y-4">
                  {direcciones.map((dir, idx) => (
                    <label key={idx} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${selectedAddress === idx ? 'border-black bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="radio" 
                        name="address" 
                        checked={selectedAddress === idx}
                        onChange={() => setSelectedAddress(idx)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-bold text-sm uppercase text-gray-800 flex items-center gap-2">
                          <MapPin size={14} className="text-red-600"/> Enviar a esta dirección
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{dir.calle} #{dir.numero}, {dir.colonia}</p>
                        <p className="text-sm text-gray-600">{dir.ciudad}, {dir.estado} C.P. {dir.cp}</p>
                      </div>
                    </label>
                  ))}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link to="/perfil" className="text-sm font-bold text-red-600 hover:text-black underline">
                      Gestionar direcciones en mi perfil
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 font-medium mb-4">No tienes direcciones guardadas.</p>
                  <Link to="/perfil" className="bg-black text-white px-6 py-3 rounded-xl font-bold uppercase text-xs hover:bg-red-600 transition-colors">
                    Añadir Dirección
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* SECCIÓN DE MÉTODO DE PAGO */}
          <section>
            <h2 className="text-xl font-black uppercase mb-6 tracking-tight flex items-center gap-3">
              <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> 
              Método de Pago
            </h2>
            
            <form onSubmit={handleCheckout} id="checkout-form">
              <div className="space-y-4">
                
                {/* Opcion Tarjeta */}
                <div className={`border rounded-2xl transition-all overflow-hidden ${paymentMethod === 'card' ? 'border-black shadow-md' : 'border-gray-200'}`}>
                  <label className="flex items-center gap-4 p-6 cursor-pointer bg-gray-50 hover:bg-gray-100/50 transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="scale-125"
                    />
                    <div className="flex items-center gap-3 font-bold uppercase tracking-tight text-sm">
                      <CreditCard size={20} /> Tarjeta de Crédito / Débito
                    </div>
                  </label>
                  
                  {paymentMethod === 'card' && (
                    <div className="p-6 bg-white border-t border-gray-100 space-y-4 animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Número de Tarjeta</label>
                        <input 
                          type="text" 
                          name="number"
                          value={cardData.number}
                          onChange={handleCardChange}
                          placeholder="0000 0000 0000 0000" 
                          required 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-mono text-sm outline-none focus:border-black transition-colors" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Nombre en la tarjeta</label>
                        <input 
                          type="text" 
                          name="name"
                          value={cardData.name}
                          onChange={handleCardChange}
                          placeholder="Ej. Ricardo Ortega" 
                          required 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-black transition-colors uppercase" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mes/Año</label>
                          <input 
                            type="text" 
                            name="expiry"
                            value={cardData.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/YY" 
                            required 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-mono text-sm outline-none focus:border-black transition-colors text-center" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">CVV</label>
                          <input 
                            type="password" 
                            name="cvc"
                            value={cardData.cvc}
                            onChange={handleCardChange}
                            placeholder="123" 
                            required 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-mono text-sm outline-none focus:border-black transition-colors text-center" 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Opcion PayPal */}
                <div className={`border rounded-2xl transition-all overflow-hidden ${paymentMethod === 'paypal' ? 'border-black shadow-md' : 'border-gray-200'}`}>
                  <label className="flex items-center gap-4 p-6 cursor-pointer bg-gray-50 hover:bg-gray-100/50 transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="scale-125"
                    />
                    <div className="flex items-center gap-3 font-bold tracking-tight text-sm text-[#003087]">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                      </svg>
                      PayPal
                    </div>
                  </label>
                  {paymentMethod === 'paypal' && (
                    <div className="p-6 bg-white border-t border-gray-100 text-center animate-fade-in">
                      <p className="text-sm text-gray-500 mb-4">Serás redirigido a PayPal para completar tu compra de forma segura.</p>
                    </div>
                  )}
                </div>

              </div>
            </form>
          </section>

        </div>

        {/* COLUMNA DERECHA: RESUMEN DEL PEDIDO */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 p-8 border border-gray-200 sticky top-32 rounded-3xl shadow-sm">
            <h2 className="text-xl font-black uppercase mb-6 tracking-tight text-black">Resumen</h2>
            
            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6 max-h-60 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm uppercase leading-tight line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Cant: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">${(item.price * item.quantity).toLocaleString('es-MX')}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">
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

            <div className="flex justify-between items-end mb-8">
              <span className="font-black text-lg uppercase">Total a Pagar</span>
              <span className="font-black text-3xl text-red-600 tracking-tighter">${total.toLocaleString('es-MX')}.00</span>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className={`w-full text-white py-5 rounded-xl font-black uppercase tracking-widest text-sm flex justify-center items-center gap-2 shadow-xl shadow-red-200 transition-all ${
                isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-black hover:-translate-y-1'
              }`}
            >
              {isProcessing ? 'Procesando...' : 'Pagar Ahora'} <ShieldCheck size={18} />
            </button>
            
            <div className="flex items-center justify-center gap-2 mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <ShieldCheck size={14} /> Pagos 100% Seguros
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Checkout;
