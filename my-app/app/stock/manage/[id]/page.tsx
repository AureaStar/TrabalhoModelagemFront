'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageStockPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [estoque, setEstoque] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        
        async function fetchEstoque() {
            try {
                const res = await fetch(`/api/stock/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setEstoque(null);
                    return;
                }
                
                setEstoque(data);
            } catch (error) {
                console.error('Erro ao buscar estoque:', error);
                setEstoque(null);
            }
        }
        fetchEstoque();
    }, [id]);

    const fields = [
        { name: 'quantidade', label: 'Quantidade', type: 'number' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const res = await fetch(`/api/stock/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/stock');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/stock/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/stock');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (!estoque) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Estoque ID: ${estoque.id}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ quantidade: estoque.quantidade }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}