import React from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import SellerSidebar from '../../components/SellerSidebar';

const Reports = () => {

  const topSelling = [
    { name: "Nike Dunk Low Retro", sales: 145, revenue: "$362,355.00" },
    { name: "Puma RS-X", sales: 89, revenue: "$169,011.00" },
    { name: "Adidas Campus 00s", sales: 64, revenue: "$128,000.00" },
    { name: "Converse Chuck 70", sales: 42, revenue: "$63,000.00" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <SellerSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight">Reportes y Analíticas</h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">Analiza el rendimiento de tus ventas y toma decisiones estratégicas.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-full text-sm font-bold shadow-sm">
              <Calendar size={16} className="text-gray-400" />
              <span>Últimos 30 días</span>
            </div>
            <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-0.5">
              <Download size={16} />
              Descargar Informe
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full"></div>
            <div className="relative z-10">
              <div className="p-3 bg-green-100 text-green-700 w-max rounded-xl mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold">Ingresos Totales (Mes)</h3>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-4xl font-black tracking-tight">$42,500.00</p>
                <span className="text-sm font-bold text-green-600 flex items-center mb-1"><TrendingUp size={16} className="mr-1"/> +12.5%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full"></div>
            <div className="relative z-10">
              <div className="p-3 bg-orange-100 text-orange-700 w-max rounded-xl mb-4">
                <Package size={24} />
              </div>
              <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold">Unidades Vendidas</h3>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-4xl font-black tracking-tight">340</p>
                <span className="text-sm font-bold text-green-600 flex items-center mb-1"><TrendingUp size={16} className="mr-1"/> +8.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full"></div>
            <div className="relative z-10">
              <div className="p-3 bg-red-100 text-red-700 w-max rounded-xl mb-4">
                <TrendingDown size={24} />
              </div>
              <h3 className="text-gray-400 text-xs uppercase tracking-widest font-bold">Tasa de Devolución</h3>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-4xl font-black tracking-tight">1.2%</p>
                <span className="text-sm font-bold text-red-600 flex items-center mb-1"><TrendingUp size={16} className="mr-1"/> +0.3%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Ventas Mensuales (Simulado con SVG) */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Ventas Mensuales</h2>
            <div className="flex-1 min-h-[250px] relative flex items-end justify-between gap-2">
              {/* Líneas guía */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[1,2,3,4,5].map(i => <div key={i} className="border-b border-gray-100 w-full h-0"></div>)}
              </div>
              
              {/* Barras */}
              {[40, 60, 45, 80, 55, 90, 110, 85, 130, 95, 150, 120].map((val, idx) => (
                <div key={idx} className="w-full flex flex-col items-center gap-2 group z-10 h-full justify-end">
                  <div 
                    className="w-full max-w-[20px] bg-red-100 rounded-t-sm transition-all duration-500 group-hover:bg-red-600" 
                    style={{ height: `${(val / 150) * 100}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase">
              <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
              <span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span>
            </div>
          </div>

          {/* Top Vendidos */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Top Modelos Vendidos</h2>
            <div className="space-y-6">
              {topSelling.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-black text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{item.sales} unidades vendidas</p>
                    </div>
                  </div>
                  <p className="font-black text-gray-800">{item.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Reports;
