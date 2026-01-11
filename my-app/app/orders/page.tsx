'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';

export default function OrdersPage() {
    const headers = ['Código do Pedido', 'Cliente', 'Data', 'Status', 'Preço'];
    const data = [
        { id: 1, 'Código do Pedido': 'PED001', Cliente: 'Empresa A', Data: '2023-01-01', Status: 'Pendente', Preço: 100.00 },
        { id: 2, 'Código do Pedido': 'PED002', Cliente: 'Empresa B', Data: '2023-02-01', Status: 'Aprovado', Preço: 200.00 },
    ];

    return (
        <section>
            <SetHeader content="Pedidos" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onAdd={() => console.log('Adicionar novo pedido')}
                        onManage={(item) => console.log('Gerenciar pedido:', item)}
                        routes="/orders"
                    />
                </main>
            </div>
        </section>
    );
}