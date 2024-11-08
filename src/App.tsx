import React, { useState } from 'react';
import { PlusCircle, Search, Users, Store } from 'lucide-react';
import NovaVenda from './components/NovaVenda';
import ConsultaVendas from './components/ConsultaVendas';
import GerenciarVendedores from './components/GerenciarVendedores';
import { Venda, Vendedor } from './types';

const vendedoresIniciais: Vendedor[] = [
  { id: '1', nome: 'João Silva' },
  { id: '2', nome: 'Maria Santos' },
  { id: '3', nome: 'Pedro Oliveira' },
];

function App() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>(vendedoresIniciais);
  const [activeTab, setActiveTab] = useState<'nova' | 'consulta' | 'vendedores'>('nova');

  const handleSaveVenda = (venda: Venda) => {
    setVendas([...vendas, venda]);
  };

  const handleAddVendedor = (vendedor: Vendedor) => {
    setVendedores([...vendedores, vendedor]);
  };

  const handleRemoveVendedor = (id: string) => {
    if (vendas.some(venda => venda.vendedorId === id)) {
      alert('Não é possível remover um vendedor que possui vendas registradas');
      return;
    }
    setVendedores(vendedores.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Sistema de Vendas</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('nova')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'nova'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PlusCircle className="h-5 w-5" />
              Nova Venda
            </button>
            <button
              onClick={() => setActiveTab('consulta')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'consulta'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Search className="h-5 w-5" />
              Consultar Vendas
            </button>
            <button
              onClick={() => setActiveTab('vendedores')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'vendedores'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="h-5 w-5" />
              Gerenciar Vendedores
            </button>
          </div>

          {activeTab === 'nova' && (
            <NovaVenda
              vendedores={vendedores}
              onSaveVenda={handleSaveVenda}
            />
          )}
          {activeTab === 'consulta' && (
            <ConsultaVendas vendas={vendas} vendedores={vendedores} />
          )}
          {activeTab === 'vendedores' && (
            <GerenciarVendedores
              vendedores={vendedores}
              onAddVendedor={handleAddVendedor}
              onRemoveVendedor={handleRemoveVendedor}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;