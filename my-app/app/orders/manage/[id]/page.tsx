'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageOrderPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [pedido, setPedido] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        
        async function fetchPedido() {
            try {
                const res = await fetch(`/api/orders/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setPedido(null);
                    return;
                }
                
                setPedido(data);
            } catch (error) {
                console.error('Erro ao buscar pedido:', error);
                setPedido(null);
            }
        }
        fetchPedido();
    }, [id]);

    const fields = [
        { name: 'codigo_pedido', label: 'Código do Pedido', type: 'text' as const, required: true },
        { name: 'id_cliente', label: 'ID Cliente', type: 'number' as const, required: true },
        { name: 'status', label: 'Status', type: 'select' as const, options: ['Pendente', 'Aprovado', 'Cancelado'], required: true },
        { name: 'preco', label: 'Preço', type: 'number' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/orders');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/orders');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (!pedido) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Pedido: ${pedido.codigo_pedido}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ codigo_pedido: pedido.codigo_pedido, id_cliente: pedido.id_cliente, status: pedido.status, preco: pedido.preco }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}