'use client';

import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';
import { useEffect, useState } from 'react';

export default function NewAcquisitionPage() {
    const [fornecedores, setFornecedores] = useState<Array<{ id: number; nome: string }>>([]);
    const [produtos, setProdutos] = useState<Array<{ id: number; nome: string }>>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [resFornecedores, resProdutos] = await Promise.all([
                    fetch('/api/suppliers'),
                    fetch('/api/products')
                ]);
                
                if (!resFornecedores.ok || !resProdutos.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                
                const fornecedoresData = await resFornecedores.json();
                const produtosData = await resProdutos.json();
                
                setFornecedores(fornecedoresData);
                setProdutos(produtosData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }
        fetchData();
    }, []);

    const fornecedorOptions = fornecedores.map(f => f.nome);
    const fornecedorMap = fornecedores.reduce((acc, f) => {
        acc[f.nome] = f.id;
        return acc;
    }, {} as Record<string, number>);

    const produtoOptions = produtos.map(p => p.nome);
    const produtoMap = produtos.reduce((acc, p) => {
        acc[p.nome] = p.id;
        return acc;
    }, {} as Record<string, number>);

    const fields = [
        { name: 'produto_nome', label: 'Produto', type: 'select' as const, options: produtoOptions, required: true },
        { name: 'fornecedor_nome', label: 'Fornecedor', type: 'select' as const, options: fornecedorOptions, required: true },
        { name: 'quantidade', label: 'Quantidade', type: 'number' as const, required: true },
        { name: 'preco', label: 'Preço(un)', type: 'number' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const payload = {
                id_fornecedor: fornecedorMap[data.fornecedor_nome],
                quantidade: parseFloat(data.quantidade),
                preco: parseFloat(data.preco),
                produtos: {
                    connect: { id: produtoMap[data.produto_nome] }
                }
            };

            const res = await fetch('/api/acquisitions', {
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
    };

    return (
        <section>
            <SetHeader content="Nova Aquisição" />
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