'use client';

import { useParams } from 'next/navigation';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageOrderPage() {
    const params = useParams();
    const id = params.id as string;

    // Simulação de busca no banco (dados mockados)
    const orders = [
        { id: 1, 'Código do Pedido': 'PED001', Cliente: 'Empresa A', Data: '2023-01-01', Status: 'Pendente', Preço: 100.00 },
        { id: 2, 'Código do Pedido': 'PED002', Cliente: 'Empresa B', Data: '2023-02-01', Status: 'Aprovado', Preço: 200.00 },
    ];

    const order = orders.find(o => o.id.toString() === id);

    const fields = [
        { name: 'codigoPedido', label: 'Código do Pedido', type: 'text' as const, required: true },
        { name: 'cliente', label: 'Cliente', type: 'select' as const, options: ['Empresa A', 'Empresa B'], required: true },
        { name: 'data', label: 'Data', type: 'text' as const, required: true },
        { name: 'status', label: 'Status', type: 'select' as const, options: ['Pendente', 'Aprovado', 'Cancelado'], required: true },
        { name: 'preco', label: 'Preço', type: 'number' as const, required: true },
    ];

    const handleSubmit = (data: Record<string, any>) => {
        // Simulação de salvar no banco
        console.log('Pedido atualizado:', { id, ...data });
        // Aqui você pode fazer uma chamada para a API
    };

    const handleDelete = () => {
        console.log('Excluir pedido:', id);
        // Aqui você pode fazer uma chamada para a API
    };

    if (!order) {
        return (
            <section>
                <SetHeader content="Gerenciar Pedido" />
                <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                    <main className="w-full py-26">
                        <p>Pedido não encontrado.</p>
                    </main>
                </div>
            </section>
        );
    }

    return (
        <section>
            <SetHeader content={`Gerenciar Pedido: ${order['Código do Pedido']}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ codigoPedido: order['Código do Pedido'], cliente: order.Cliente, data: order.Data, status: order.Status, preco: order.Preço }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}