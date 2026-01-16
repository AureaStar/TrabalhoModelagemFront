'use client';

import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';
import { useEffect, useState } from 'react';

export default function NewOrderPage() {
    const [clientes, setClientes] = useState<Array<{ id: number; instituicao: string }>>([]);

    useEffect(() => {
        async function fetchClientes() {
            try {
                const res = await fetch('/api/customers');
                if (!res.ok) throw new Error('Erro ao buscar clientes');
                const data = await res.json();
                console.log('Clientes carregados:', data);
                setClientes(data);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        }
        fetchClientes();
    }, []);

    console.log('Estado clientes:', clientes);

    const clienteOptions = clientes.length > 0 ? clientes.map(c => c.instituicao) : [];
    const clienteMap = clientes.reduce((acc, c) => {
        acc[c.instituicao] = c.id;
        return acc;
    }, {} as Record<string, number>);

    console.log('Options:', clienteOptions);

    const fields = [
        { name: 'codigo_pedido', label: 'Código do Pedido', type: 'text' as const, required: true },
        { name: 'cliente_nome', label: 'Cliente', type: 'select' as const, options: clienteOptions, required: true },
        { name: 'status', label: 'Status', type: 'select' as const, options: ['Pendente', 'Aprovado', 'Cancelado'], required: true },
        { name: 'preco', label: 'Preço', type: 'number' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const payload = {
                codigo_pedido: data.codigo_pedido,
                id_cliente: clienteMap[data.cliente_nome],
                status: data.status,
                preco: parseFloat(data.preco)
            };

            const res = await fetch('/api/orders', {
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
            <SetHeader content="Novo Pedido" />
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