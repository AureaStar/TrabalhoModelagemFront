'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';
import { useEffect ,useState } from 'react';
interface Aquisicao {
  id: number;
  produtos: Array<{
    id: number;
    nome: string;
  }>;
  fornecedor: {
    id: number;
    nome: string;
  };
  entrada: string;
  quantidade: number;
  preco: number;
} 

export default function AcquisitionsPage() {
  const [aquisicoes, setAquisicoes] = useState<Aquisicao[]>([]);
  
  useEffect(() => {
    async function fetchAquisicoes() {
      try {
        const response = await fetch('/api/acquisitions');
        if (!response.ok) throw new Error('Erro ao buscar aquisições');

        const data = await response.json();
        setAquisicoes(data);
      } catch (error) {
        console.error('Erro ao buscar aquisições:', error);
      }
    }

    fetchAquisicoes();
  }, []);

  const headers = ['Nome', 'Fornecedor', 'Entrada', 'Quantidade', 'Preço(un)'];
  const data = aquisicoes.map(aquisicao => ({
    id: aquisicao.id,
    Nome: aquisicao.produtos.map(p => p.nome).join(', '),
    Fornecedor: aquisicao.fornecedor.nome,
    Entrada: new Date(aquisicao.entrada).toLocaleDateString(),
    Quantidade: aquisicao.quantidade,
    'Preço(un)': aquisicao.preco.toFixed(2),
  }));

  return (
    <section>
      <SetHeader content="Aquisições" />
      <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
        <main className="w-full py-26">
          <Table
            headers={headers}
            data={data}
            onManage={(item) => console.log('Gerenciar aquisição:', item)}
            routes="/acquisitions"
          />
        </main>
      </div>
    </section>
  );
}
