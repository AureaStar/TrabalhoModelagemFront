'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';
import { useEffect ,useState } from 'react';
interface EstoqueItem {
    id: number;
    nome: string;
    categoria: string;
    preco: number;
    quantidade: number;
}

export default function StockPage() {
    const [estoques, setEstoques] = useState<EstoqueItem[]>([]);

    useEffect(() => {
        async function fetchEstoques() {
            try {
                const response = await fetch('/api/stock');
                if (!response.ok) throw new Error('Erro ao buscar estoque');

                const data = await response.json();
                setEstoques(data);
            } catch (error) {
                console.error('Erro ao buscar estoque:', error);
            }
        }

        fetchEstoques();
    }, []);

    const headers = ['Nome', 'Categoria', 'Quantidade', 'Preço(un)'];
    const data = estoques.map(estoque => ({
        id: estoque.id,
        Nome: estoque.nome || '-',
        Categoria: estoque.categoria || '-',
        Quantidade: estoque.quantidade,
        'Preço(un)': estoque.preco || '-',
    }))

    return (
        <section>
            <SetHeader content="Estoque" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        showFilter={true}
                        onManage={(item) => console.log('Gerenciar item do estoque:', item)}
                        routes="/stock"
                    />
                </main>
            </div>
        </section>
    );
}