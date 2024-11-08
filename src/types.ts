export interface Item {
  id: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  vendedorId: string;
  data: string;
  itens: Item[];
  tipoPagamento: 'credito' | 'debito' | 'pix' | 'dinheiro';
  total: number;
}

export interface Vendedor {
  id: string;
  nome: string;
}