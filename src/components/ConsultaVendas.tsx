import React, { useState } from 'react';
import { Search, Printer } from 'lucide-react';
import { Venda, Vendedor } from '../types';

interface ConsultaVendasProps {
  vendas: Venda[];
  vendedores: Vendedor[];
}

export default function ConsultaVendas({ vendas, vendedores }: ConsultaVendasProps) {
  const [vendedorId, setVendedorId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [comissao, setComissao] = useState(5);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const vendasFiltradas = vendas.filter((venda) => {
    if (vendedorId && venda.vendedorId !== vendedorId) return false;
    if (dataInicio && new Date(venda.data) < new Date(dataInicio)) return false;
    if (dataFim && new Date(venda.data) > new Date(dataFim)) return false;
    return true;
  });

  const totalVendas = vendasFiltradas.reduce((acc, venda) => acc + venda.total, 0);
  const totalComissao = (totalVendas * comissao) / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendedor
          </label>
          <select
            value={vendedorId}
            onChange={(e) => setVendedorId(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos os vendedores</option>
            {vendedores.map((vendedor) => (
              <option key={vendedor.id} value={vendedor.id}>
                {vendedor.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Início
          </label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Fim
          </label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comissão (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={comissao}
            onChange={(e) => setComissao(Number(e.target.value))}
            className="w-32 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setMostrarResultados(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Search className="h-5 w-5" />
          Consultar
        </button>
      </div>

      {mostrarResultados && vendasFiltradas.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendasFiltradas.map((venda) => (
                  <tr key={venda.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(venda.data).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vendedores.find((v) => v.id === venda.vendedorId)?.nome}
                    </td>
                    <td className="px-6 py-4">
                      <ul className="list-disc list-inside">
                        {venda.itens.map((item) => (
                          <li key={item.id}>
                            {item.quantidade}x {item.nome} - R${' '}
                            {(item.quantidade * item.precoUnitario).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {venda.tipoPagamento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      R$ {venda.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">
                  Total de Vendas: R$ {totalVendas.toFixed(2)}
                </p>
                <p className="text-lg font-medium">
                  Comissão ({comissao}%): R$ {totalComissao.toFixed(2)}
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <Printer className="h-5 w-5" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarResultados && vendasFiltradas.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma venda encontrada para os filtros selecionados.
        </div>
      )}
    </div>
  );
}