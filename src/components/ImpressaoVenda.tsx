import React from 'react';
import { Venda, Vendedor } from '../types';

interface ImpressaoVendaProps {
  venda: Venda;
  vendedor: Vendedor;
}

export default function ImpressaoVenda({ venda, vendedor }: ImpressaoVendaProps) {
  return (
    <div className="p-8 bg-white max-w-2xl mx-auto print:mx-0">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold">Comprovante de Venda</h2>
          <p>Data: {new Date(venda.data).toLocaleDateString()}</p>
          <p>Vendedor: {vendedor.nome}</p>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Ordem</th>
              <th className="py-2 text-left">Discriminação</th>
              <th className="py-2 text-right">Qtde</th>
              <th className="py-2 text-right">Vlr Unit</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venda.itens.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{item.nome}</td>
                <td className="py-2 text-right">{item.quantidade.toFixed(3)}</td>
                <td className="py-2 text-right">
                  R$ {item.precoUnitario.toFixed(2)}
                </td>
                <td className="py-2 text-right">
                  R$ {item.subtotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td colSpan={4} className="py-2 text-right font-bold">
                Total:
              </td>
              <td className="py-2 text-right font-bold">
                R$ {venda.total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="flex justify-between items-center border-t pt-4">
          <div>
            <p>Forma de Pagamento: {venda.tipoPagamento}</p>
          </div>
        </div>
      </div>
    </div>
  );
}