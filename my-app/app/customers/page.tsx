'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';

export default function CustomersPage() {
    const headers = ['Instituição', 'CNPJ', 'Telefone', 'Responsável'];
    const data = [
        { id: 1, Instituição: 'Empresa A', CNPJ: '12345678000100', Telefone: '111111111', Responsável: 'João' },
        { id: 2, Instituição: 'Empresa B', CNPJ: '98765432000199', Telefone: '222222222', Responsável: 'Maria' },
        { id: 3, Instituição: 'Empresa C', CNPJ: '55566677000188', Telefone: '333333333', Responsável: 'Pedro' },
    ];

    return (
        <section>
            <SetHeader content="Clientes" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onAdd={() => console.log('Adicionar novo cliente')}
                        onManage={(item) => console.log('Gerenciar cliente:', item)}
                        routes="/customers"
                    />
                </main>
            </div>
        </section>
    );
};