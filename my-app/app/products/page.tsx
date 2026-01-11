'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';

export default function ProductsPage() {
    const headers = ['Nome', 'Código do Produto', 'Categoria', 'Preço(un)'];
    const data = [
        { id: 1, Nome: 'Produto X', 'Código do Produto': 'PROD001', Categoria: 'Eletrônicos', 'Preço(un)': 25.00 },
        { id: 2, Nome: 'Produto Y', 'Código do Produto': 'PROD002', Categoria: 'Roupas', 'Preço(un)': 30.00 },
    ];
    const categories = ['Eletrônicos', 'Roupas', 'Alimentos'];

    return (
        <section>
            <SetHeader content="Produtos" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onAdd={() => console.log('Adicionar novo produto')}
                        categories={categories}
                        showFilter={true}
                        onManage={(item) => console.log('Gerenciar produto:', item)}
                        routes="/products"
                    />
                </main>
            </div>
        </section>
    );
}