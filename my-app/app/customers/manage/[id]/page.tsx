'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageCustomerPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [cliente, setCliente] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        
        async function fetchCliente() {
            try {
                const res = await fetch(`/api/customers/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setCliente(null);
                    return;
                }
                
                setCliente(data);
            } catch (error) {
                console.error('Erro ao buscar cliente:', error);
                setCliente(null);
            }
        }
        fetchCliente();
    }, [id]);

    const fields = [
        { name: 'instituicao', label: 'Instituição', type: 'text' as const, required: true },
        { name: 'cnpj', label: 'CNPJ', type: 'text' as const, required: true },
        { name: 'telefone', label: 'Telefone', type: 'text' as const, required: true },
        { name: 'responsavel', label: 'Responsável', type: 'text' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/customers');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/customers');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (!cliente) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Cliente: ${cliente.instituicao}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ instituicao: cliente.instituicao, cnpj: cliente.cnpj, telefone: cliente.telefone, responsavel: cliente.responsavel }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}