import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowLeft, Download, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import SellerSidebar from '../../components/SellerSidebar';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const products = [
    { id: 'PROD-001', name: 'Nike Dunk Low Retro', brand: 'Nike', stock: 15, price: '$2,499.00', status: 'Activo', category: 'Hombres' },
    { id: 'PROD-002', name: 'Adidas Campus 00s', brand: 'Adidas', stock: 8, price: '$2,000.00', status: 'Poco Stock', category: 'Unisex' },
    { id: 'PROD-003', name: 'Jordan 1 Retro High', brand: 'Jordan', stock: 0, price: '$3,800.00', status: 'Agotado', category: 'Hombres' },
    { id: 'PROD-004', name: 'Puma RS-X', brand: 'Puma', stock: 42, price: '$1,899.00', status: 'Activo', category: 'Mujeres' },
    { id: 'PROD-005', name: 'New Balance 550', brand: 'New Balance', stock: 5, price: '$2,200.00', status: 'Poco Stock', category: 'Hombres' },
    { id: 'PROD-006', name: 'Converse Chuck 70', brand: 'Converse', stock: 120, price: '$1,500.00', status: 'Activo', category: 'Unisex' },
    { id: 'PROD-007', name: 'Nike Air Max 90', brand: 'Nike', stock: 12, price: '$2,600.00', status: 'Activo', category: 'Niños' },
  ];

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <SellerSidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight">Inventario Global</h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">Gestiona tu catálogo, actualiza precios y revisa existencias.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-black px-4 py-3 rounded-full font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
              <Download size={18} />
              Exportar
            </button>
            <Link 
              to="/vendedor/nuevo-producto"
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-black transition-all shadow-lg shadow-red-200 hover:-translate-y-0.5"
            >
              Nuevo Producto
            </Link>
          </div>
        </header>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="w-full md:w-1/2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-black focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-black hover:border-gray-300 transition-colors flex-1 md:flex-none justify-center">
              <Filter size={16} /> Filtros
            </button>
            <select className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 outline-none hover:border-gray-300 transition-colors flex-1 md:flex-none">
              <option>Todas las Marcas</option>
              <option>Nike</option>
              <option>Adidas</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-100">
                  <th className="p-6 font-bold w-16 text-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="p-6 font-bold">Zapatilla</th>
                  <th className="p-6 font-bold">Marca / Cat.</th>
                  <th className="p-6 font-bold">Stock</th>
                  <th className="p-6 font-bold">Precio</th>
                  <th className="p-6 font-bold">Estado</th>
                  <th className="p-6 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group">
                    <td className="p-6 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-gray-800">{product.name}</p>
                      <p className="font-mono text-gray-400 text-[10px] uppercase tracking-widest mt-1">{product.id}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-gray-800">{product.brand}</p>
                      <p className="text-gray-400 text-[11px] font-bold mt-1">{product.category}</p>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        product.stock === 0 ? 'bg-red-100 text-red-700' : 
                        product.stock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.stock}
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
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-gray-100 flex items-center justify-between text-sm">
            <p className="text-gray-500 font-bold">Mostrando <span className="text-black">{filteredProducts.length}</span> productos</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg font-bold text-gray-400 cursor-not-allowed">Anterior</button>
              <button className="px-4 py-2 bg-black text-white rounded-lg font-bold">1</button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg font-bold hover:bg-gray-50">Siguiente</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Inventory;
