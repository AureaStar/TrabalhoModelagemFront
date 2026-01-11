'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';

export default function AcquisitionsPage() {
    const headers = ['Nome', 'Fornecedor', 'Entrada', 'Quantidade', 'Preço(un)'];
    const data = [
        { id: 1, Nome: 'Produto X', Fornecedor: 'Fornecedor A', Entrada: '2023-01-01', Quantidade: 100, 'Preço(un)': 10.50 },
        { id: 2, Nome: 'Produto Y', Fornecedor: 'Fornecedor B', Entrada: '2023-02-01', Quantidade: 200, 'Preço(un)': 15.00 },
    ];

    return (
        <section>
            <SetHeader content="Aquisições" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onAdd={() => console.log('Adicionar nova aquisição')}
                        onManage={(item) => console.log('Gerenciar aquisição:', item)}
                        routes="/acquisitions"
                    />
                </main>
            </div>
        </section>
    );
}