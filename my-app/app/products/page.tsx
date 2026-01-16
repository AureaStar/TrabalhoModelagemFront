'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';
import { useEffect ,useState } from 'react';

interface Produto {
    id: number;
    codigo_produto: string;
    nome: string;
    categoria: string;
    preco: number;
}

export default function ProductsPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    
    useEffect(() => {
        async function fetchProdutos() {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) throw new Error('Erro ao buscar produtos');

                const data = await response.json();
                setProdutos(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        }

        fetchProdutos();
    }, []);


    const headers = ['Nome', 'Código do Produto', 'Categoria', 'Preço(un)'];
    const data = produtos.map(produto => ({
        id: produto.id,
        Nome: produto.nome,
        'Código do Produto': produto.codigo_produto,
        Categoria: produto.categoria,
        'Preço(un)': produto.preco.toFixed(2),
    }));
    const categories = ['Eletrônicos', 'Roupas', 'Alimentos'];

    return (
        <section>
            <SetHeader content="Produtos" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        categories={categories}
                        showFilter={true}
                        onManage={(item) => console.log('Gerenciar produto:', item)}
                        routes="/products"
                    />
                </main>
            </div>
        </section>
    );
}