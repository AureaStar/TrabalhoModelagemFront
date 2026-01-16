'use client';

import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';
import { useEffect, useState } from 'react';

export default function NewStockPage() {
    const [produtos, setProdutos] = useState<Array<{ id: number; nome: string; preco: number; categoria: string }>>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<{ preco: number; categoria: string } | null>(null);

    useEffect(() => {
        async function fetchProdutos() {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Erro ao buscar produtos');
                const data = await res.json();
                setProdutos(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        }
        fetchProdutos();
    }, []);

    const produtoOptions = produtos.map(p => p.nome);
    const produtoMap = produtos.reduce((acc, p) => {
        acc[p.nome] = { id: p.id, preco: p.preco, categoria: p.categoria };
        return acc;
    }, {} as Record<string, { id: number; preco: number; categoria: string }>);

    const fields = [
        { name: 'produto_nome', label: 'Produto', type: 'select' as const, options: produtoOptions, required: true },
        { name: 'quantidade', label: 'Quantidade', type: 'number' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const produto = produtoMap[data.produto_nome];
            
            const payload = {
                quantidade: parseFloat(data.quantidade.replace(',', '.')),
                produtos: {
                    connect: { id: produto.id }
                }
            };

            const res = await fetch('/api/stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            window.history.back();
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    }

    const cancel = () => {
        window.history.back();
    }

    return (
        <section>
            <SetHeader content="Novo Item no Estoque" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="add"
                        fields={fields}
                        onSubmit={handleSubmit}
                        onCancel={cancel}
                    />
                </main>
            </div>
        </section>
    );
}