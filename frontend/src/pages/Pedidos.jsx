import React, { useState, useEffect } from 'react';
import { Package, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Pedidos = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Si no está logueado, redirigir
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const currentUser = localStorage.getItem('currentUser') || 'guest';
    const savedOrders = localStorage.getItem(`zyoff_orders_${currentUser}`);
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, [navigate]);

  if (orders.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-20 min-h-[70vh] flex flex-col justify-center items-center text-center">
        <div className="bg-gray-50 p-12 rounded-full mb-8">
          <Package size={80} className="text-gray-200" />
        </div>
        
        <h1 className="text-4xl font-black uppercase mb-4 tracking-tighter text-black italic">
          Aún no tienes pedidos
        </h1>
        
        <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">
          Cuando realices tu primera compra en ZY OFF, podrás hacer el seguimiento y gestionar tus entregas desde aquí.
        </p>
  
        <Link 
          to="/" 
          className="bg-black text-white px-10 py-4 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all shadow-xl hover:shadow-red-200"
        >
          Empezar a explorar
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <h1 className="text-3xl md:text-5xl font-black mb-10 uppercase italic tracking-tighter text-black">
        Mis Pedidos
      </h1>

      <div className="space-y-8">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-200 rounded-3xl overflow-hidden hover:border-black transition-colors bg-white">
            
            {/* Header del Pedido */}
            <div className="bg-gray-50 px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200">
              <div className="flex gap-10">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Pedido Realizado</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{order.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Pagado</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">${order.total.toLocaleString('es-MX')}.00</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">No. de Pedido</p>
                <p className="text-sm font-mono font-bold text-gray-900 mt-1">{order.id}</p>
              </div>
            </div>

            <div className="p-8 flex flex-col lg:flex-row gap-10">
              {/* Artículos */}
              <div className="flex-1 space-y-6">
                <h3 className="font-black uppercase tracking-tight text-lg mb-4 flex items-center gap-2">
                  <Package size={20} className="text-red-600"/> Artículos ({order.items.length})
                </h3>
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 flex items-center justify-center border border-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div>
                      <p className="font-bold uppercase text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Marca: {item.brand}</p>
                      <p className="text-xs font-bold mt-1 text-gray-500">Cant: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status y Envío */}
              <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-black uppercase tracking-tight text-lg mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-orange-500"/> Estado
                  </h3>
                  <div className="inline-flex px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                    {order.status}
                  </div>

                  <h3 className="font-black uppercase tracking-tight text-sm mb-2 flex items-center gap-2 mt-4">
                    <MapPin size={16} className="text-gray-400"/> Dirección de Entrega
                  </h3>
                  {order.address && (
                    <div className="text-xs text-gray-600 leading-relaxed">
                      <p className="font-bold text-black uppercase mb-1">{order.address.calle} #{order.address.numero}</p>
                      <p>{order.address.colonia}</p>
                      <p>{order.address.ciudad}, {order.address.estado} C.P. {order.address.cp}</p>
                    </div>
                  )}
                </div>

                <button className="w-full mt-6 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-black border border-black py-3 rounded-xl hover:bg-black hover:text-white transition-colors">
                  Rastrear Pedido <ChevronRight size={16} />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Pedidos;