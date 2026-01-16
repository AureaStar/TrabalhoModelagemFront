'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageAcquisitionPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [aquisicao, setAquisicao] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        
        async function fetchAquisicao() {
            try {
                const res = await fetch(`/api/acquisitions/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setAquisicao(null);
                    return;
                }
                
                setAquisicao(data);
            } catch (error) {
                console.error('Erro ao buscar aquisição:', error);
                setAquisicao(null);
            }
        }
        fetchAquisicao();
    }, [id]);

    const fields = [
        { name: 'id_fornecedor', label: 'ID Fornecedor', type: 'number' as const, required: true },
        { name: 'quantidade', label: 'Quantidade', type: 'number' as const, required: true },
        { name: 'preco', label: 'Preço', type: 'number' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const res = await fetch(`/api/acquisitions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/acquisitions');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/acquisitions/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/acquisitions');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (!aquisicao) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Aquisição ID: ${aquisicao.id}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ id_fornecedor: aquisicao.id_fornecedor, quantidade: aquisicao.quantidade, preco: aquisicao.preco }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}