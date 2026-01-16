'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [produto, setProduto] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        
        async function fetchProduto() {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setProduto(null);
                    return;
                }
                
                setProduto(data);
            } catch (error) {
                console.error('Erro ao buscar produto:', error);
                setProduto(null);
            }
        }
        fetchProduto();
    }, [id]);

    const fields = [
        { name: 'nome', label: 'Nome', type: 'text' as const, required: true },
        { name: 'codigo_produto', label: 'Código do Produto', type: 'text' as const, required: true },
        { name: 'categoria', label: 'Categoria', type: 'text' as const, required: true },
        { name: 'preco', label: 'Preço(un)', type: 'number' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/products');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/products');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (!produto) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Produto: ${produto.nome}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ nome: produto.nome, codigo_produto: produto.codigo_produto, categoria: produto.categoria, preco: produto.preco }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}