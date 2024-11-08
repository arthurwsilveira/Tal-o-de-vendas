import React, { useState } from 'react';
import { PlusCircle, Trash2, Save, Printer } from 'lucide-react';
import { Item, Venda, Vendedor } from '../types';
import ImpressaoVenda from './ImpressaoVenda';
import { createRoot } from 'react-dom/client';

interface NovaVendaProps {
  vendedores: Vendedor[];
  onSaveVenda: (venda: Venda) => void;
}

export default function NovaVenda({ vendedores, onSaveVenda }: NovaVendaProps) {
  const [vendedorId, setVendedorId] = useState('');
  const [itens, setItens] = useState<Item[]>([]);
  const [novoItem, setNovoItem] = useState({
    nome: '',
    quantidade: 1,
    precoUnitario: 0,
  });
  const [tipoPagamento, setTipoPagamento] = useState<Venda['tipoPagamento']>('dinheiro');
  const [vendaSalva, setVendaSalva] = useState<Venda | null>(null);

  const calcularSubtotal = (quantidade: number, precoUnitario: number) => {
    return quantidade * precoUnitario;
  };

  const handleAddItem = () => {
    if (itens.length >= 5) {
      alert('Máximo de 5 itens permitido');
      return;
    }
    if (!novoItem.nome || novoItem.precoUnitario <= 0) {
      alert('Preencha todos os campos do item');
      return;
    }
    const subtotal = calcularSubtotal(novoItem.quantidade, novoItem.precoUnitario);
    setItens([
      ...itens,
      {
        id: Date.now().toString(),
        ...novoItem,
        subtotal,
      },
    ]);
    setNovoItem({ nome: '', quantidade: 1, precoUnitario: 0 });
  };

  const handleRemoveItem = (id: string) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const calcularTotal = () => {
    return itens.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const handleSave = () => {
    if (!vendedorId || itens.length === 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const venda: Venda = {
      id: Date.now().toString(),
      vendedorId,
      data: new Date().toISOString(),
      itens,
      tipoPagamento,
      total: calcularTotal(),
    };

    onSaveVenda(venda);
    setVendaSalva(venda);
    alert('Venda registrada com sucesso!');
  };

  const handlePrint = () => {
    if (!vendaSalva) return;
    const vendedor = vendedores.find(v => v.id === vendaSalva.vendedorId);
    if (!vendedor) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Comprovante de Venda</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            @media print {
              body { margin: 0; padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
    `);
    
    const impressaoVendaElement = document.createElement('div');
    const root = createRoot(impressaoVendaElement);
    root.render(<ImpressaoVenda venda={vendaSalva} vendedor={vendedor} />);
    
    printWindow.document.write(impressaoVendaElement.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendedor
          </label>
          <select
            value={vendedorId}
            onChange={(e) => setVendedorId(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione um vendedor</option>
            {vendedores.map((vendedor) => (
              <option key={vendedor.id} value={vendedor.id}>
                {vendedor.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Forma de Pagamento
          </label>
          <select
            value={tipoPagamento}
            onChange={(e) => setTipoPagamento(e.target.value as Venda['tipoPagamento'])}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="dinheiro">Dinheiro</option>
            <option value="credito">Cartão de Crédito</option>
            <option value="debito">Cartão de Débito</option>
            <option value="pix">PIX</option>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Itens da Venda</h3>
        
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Item
            </label>
            <input
              type="text"
              placeholder="Nome do item"
              value={novoItem.nome}
              onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              placeholder="Quantidade"
              value={novoItem.quantidade}
              onChange={(e) =>
                setNovoItem({ ...novoItem, quantidade: parseFloat(e.target.value) || 0 })
              }
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço Unitário
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Preço unitário"
              value={novoItem.precoUnitario}
              onChange={(e) =>
                setNovoItem({
                  ...novoItem,
                  precoUnitario: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <PlusCircle className="h-5 w-5" />
          Adicionar Item
        </button>

        <div className="mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Unit.
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itens.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.nome}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {item.quantidade.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    R$ {item.precoUnitario.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    R$ {item.subtotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {itens.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-lg font-medium">
              Total: R$ {calcularTotal().toFixed(2)}
            </div>
            <div className="flex gap-2">
              {vendaSalva && (
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <Printer className="h-5 w-5" />
                  Imprimir
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-5 w-5" />
                Salvar Venda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}