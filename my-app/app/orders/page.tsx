'use client';

import Table from '@/components/table';
import { useEffect, useState } from 'react';
import SetHeader from '../../components/header/SetHeader';

interface Pedido {
    id: number;
    codigo_pedido: string;
    cliente: {
        id: number;
        instituicao: string;
    };
    data: string;
    status: string;
    preco: number;
}
export default function OrdersPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
        
    useEffect(() => {
        async function fetchPedidos() { 
            try {
                const response = await fetch('/api/orders');
                if (!response.ok) throw new Error('Erro ao buscar pedidos');
                
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        }

        fetchPedidos();
    }, []);

    const headers = ['Código do Pedido', 'Cliente', 'Data', 'Status', 'Preço'];
    const data = pedidos.map(pedido => ({
        id: pedido.id,
        'Código do Pedido': pedido.codigo_pedido,
        'Cliente': pedido.cliente.instituicao,
        'Data': new Date(pedido.data).toLocaleDateString(),
        'Status': pedido.status,
        'Preço': `R$ ${pedido.preco.toFixed(2).replace('.', ',')}`
    }));

    return (
        <section>
            <SetHeader content="Pedidos" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onManage={(item) => console.log('Gerenciar pedido:', item)}
                        routes="/orders"
                    />
                </main>
            </div>
        </section>
    );
}