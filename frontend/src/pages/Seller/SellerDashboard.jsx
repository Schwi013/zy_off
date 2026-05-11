import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, TrendingUp, DollarSign, Users, Package, ShoppingBag } from 'lucide-react';
import SellerSidebar from '../../components/SellerSidebar';

const SellerDashboard = () => {
  const navigate = useNavigate();

  // Mock data para el frontend
  const stats = [
    { id: 1, title: 'Ingresos Totales', value: '$12,450.00', icon: DollarSign, change: '+14%', positive: true },
    { id: 2, title: 'Pedidos Hoy', value: '24', icon: ShoppingBag, change: '+5%', positive: true },
    { id: 3, title: 'Visitantes', value: '1,204', icon: Users, change: '-2%', positive: false },
    { id: 4, title: 'Conversión', value: '3.2%', icon: TrendingUp, change: '+1.1%', positive: true },
  ];

  const recentProducts = [
    { id: 'PROD-001', name: 'Nike Dunk Low Retro', stock: 15, price: '$2,499.00', status: 'Activo' },
    { id: 'PROD-002', name: 'Adidas Campus 00s', stock: 8, price: '$2,000.00', status: 'Poco Stock' },
    { id: 'PROD-003', name: 'Jordan 1 Retro High', stock: 0, price: '$3,800.00', status: 'Agotado' },
    { id: 'PROD-004', name: 'Puma RS-X', stock: 42, price: '$1,899.00', status: 'Activo' },
    { id: 'PROD-005', name: 'New Balance 550', stock: 5, price: '$2,200.00', status: 'Poco Stock' },
  ];

  // Simulación de datos para gráfica de barras
  const chartData = [40, 70, 45, 90, 65, 85, 120];
  const maxChartValue = Math.max(...chartData);

  const handleLogout = () => {
    alert("Sesión de vendedor cerrada.");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <SellerSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight">Resumen de Ventas</h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">Aquí tienes las métricas clave de tu tienda para hoy.</p>
          </div>
          <Link 
            to="/vendedor/nuevo-producto"
            className="hidden sm:flex items-center gap-2 bg-red-600 text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-black transition-all shadow-lg shadow-red-200 hover:-translate-y-0.5"
          >
            <PlusCircle size={18} />
            Publicar Zapato
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full transition-transform group-hover:scale-150 z-0"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-black text-white rounded-2xl shadow-md">
                      <Icon size={20} />
                    </div>
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full ${stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold">{stat.title}</h3>
                  <p className="text-3xl font-black mt-2 tracking-tight">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Section (Simulado) */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black uppercase tracking-tight">Rendimiento Semanal</h2>
              <select className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-3 py-2 outline-none">
                <option>Esta Semana</option>
                <option>Mes Pasado</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 pt-4">
              {chartData.map((val, idx) => (
                <div key={idx} className="w-full flex flex-col items-center gap-3 group">
                  {/* Tooltip simulado */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] font-bold px-2 py-1 rounded absolute -mt-10 pointer-events-none">
                    {val} ventas
                  </div>
                  <div className="w-full bg-gray-100 rounded-t-xl relative overflow-hidden h-full flex items-end justify-center">
                    <div 
                      className="w-full bg-red-600 rounded-t-xl transition-all duration-1000 group-hover:bg-black" 
                      style={{ height: `${(val / maxChartValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action / Mini Alert */}
          <div className="bg-black text-white rounded-3xl shadow-xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="bg-white/20 w-max p-3 rounded-2xl mb-6">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-black uppercase mb-2">¡Atención Inventario!</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">
                Tienes 2 productos a punto de agotarse. Actualiza el stock para no perder ventas.
              </p>
            </div>
            <button className="relative z-10 w-full bg-white text-black py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Revisar Stock
            </button>
          </div>
        </div>

        {/* Recent Products Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xl font-black uppercase tracking-tight">Inventario Reciente</h2>
            <button className="text-sm font-bold text-red-600 hover:text-black transition-colors uppercase tracking-widest">Ver Todo</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-100">
                  <th className="p-6 font-bold">ID Producto</th>
                  <th className="p-6 font-bold">Zapatilla</th>
                  <th className="p-6 font-bold">Stock</th>
                  <th className="p-6 font-bold">Precio</th>
                  <th className="p-6 font-bold">Estado</th>
                  <th className="p-6 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                    <td className="p-6 font-mono text-gray-400 text-xs">{product.id}</td>
                    <td className="p-6 font-bold text-gray-800">{product.name}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        product.stock === 0 ? 'bg-red-100 text-red-700' : 
                        product.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.stock} unids.
                      </span>
                    </td>
                    <td className="p-6 font-black text-gray-800">{product.price}</td>
                    <td className="p-6">
                      <span className={`flex items-center gap-2 text-xs font-bold ${
                        product.status === 'Activo' ? 'text-green-600' : 
                        product.status === 'Agotado' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full shadow-sm ${
                          product.status === 'Activo' ? 'bg-green-500 shadow-green-200' : 
                          product.status === 'Agotado' ? 'bg-red-500 shadow-red-200' : 'bg-orange-500 shadow-orange-200'
                        }`} />
                        {product.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-gray-400 hover:text-black font-bold text-xs uppercase transition-colors opacity-0 group-hover:opacity-100">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default SellerDashboard;
