'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';

export default function SuppliersPage() {
    const headers = ['Nome', 'Telefone'];
    const data = [
        { id: 1, Nome: 'Fornecedor A', Telefone: '123456789' },
        { id: 2, Nome: 'Fornecedor B', Telefone: '987654321' },
        { id: 3, Nome: 'Fornecedor C', Telefone: '555666777' },
    ];

    return (
        <section>
            <SetHeader content="Fornecedores" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onAdd={() => console.log('Adicionar novo fornecedor')}
                        onManage={(item) => console.log('Gerenciar fornecedor:', item)}
                        routes="/suppliers"
                    />
                </main>
            </div>
        </section>
    );
}