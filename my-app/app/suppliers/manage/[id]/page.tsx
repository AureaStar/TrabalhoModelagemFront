'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageSupplierPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [fornecedor, setFornecedor] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        
        async function fetchFornecedor() {
            try {
                const res = await fetch(`/api/suppliers/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setFornecedor(null);
                    return;
                }
                
                setFornecedor(data);
            } catch (error) {
                console.error('Erro ao buscar fornecedor:', error);
                setFornecedor(null);
            }
        }
        fetchFornecedor();
    }, [id]);

    const fields = [
        { name: 'nome', label: 'Nome', type: 'text' as const, required: true },
        { name: 'telefone', label: 'Telefone', type: 'text' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const res = await fetch(`/api/suppliers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/suppliers');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/suppliers/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/suppliers');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (!fornecedor) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Fornecedor: ${fornecedor.nome}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ nome: fornecedor.nome, telefone: fornecedor.telefone }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}