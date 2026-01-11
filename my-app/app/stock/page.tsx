'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';

export default function StockPage() {
    const headers = ['Nome', 'Categoria', 'Quantidade', 'Preço(un)'];
    const data = [
        { id: 1, Nome: 'Produto A', Categoria: 'Eletrônicos', Quantidade: 50, 'Preço(un)': 20.00 },
        { id: 2, Nome: 'Produto B', Categoria: 'Roupas', Quantidade: 30, 'Preço(un)': 15.00 },
    ];
    const categories = ['Eletrônicos', 'Roupas', 'Alimentos'];

    return (
        <section>
            <SetHeader content="Estoque" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onAdd={() => console.log('Adicionar novo item ao estoque')}
                        categories={categories}
                        showFilter={true}
                        onManage={(item) => console.log('Gerenciar item do estoque:', item)}
                        routes="/stock"
                    />
                </main>
            </div>
        </section>
    );
}