import React, { useState } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import { Vendedor } from '../types';

interface GerenciarVendedoresProps {
  vendedores: Vendedor[];
  onAddVendedor: (vendedor: Vendedor) => void;
  onRemoveVendedor: (id: string) => void;
}

export default function GerenciarVendedores({
  vendedores,
  onAddVendedor,
  onRemoveVendedor,
}: GerenciarVendedoresProps) {
  const [novoVendedor, setNovoVendedor] = useState('');

  const handleAddVendedor = () => {
    if (!novoVendedor.trim()) {
      alert('Digite o nome do vendedor');
      return;
    }
    onAddVendedor({
      id: Date.now().toString(),
      nome: novoVendedor.trim(),
    });
    setNovoVendedor('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Nome do vendedor"
          value={novoVendedor}
          onChange={(e) => setNovoVendedor(e.target.value)}
          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          onClick={handleAddVendedor}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <UserPlus className="h-5 w-5" />
          Adicionar Vendedor
        </button>
      </div>

      <div className="space-y-2">
        {vendedores.map((vendedor) => (
          <div
            key={vendedor.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <span className="font-medium">{vendedor.nome}</span>
            <button
              onClick={() => onRemoveVendedor(vendedor.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}