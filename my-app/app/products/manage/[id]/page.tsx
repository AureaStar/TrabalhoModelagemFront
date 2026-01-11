'use client';

import { useParams } from 'next/navigation';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageProductPage() {
    const params = useParams();
    const id = params.id as string;

    // Simulação de busca no banco (dados mockados)
    const products = [
        { id: 1, Nome: 'Produto X', 'Código do Produto': 'PROD001', Categoria: 'Eletrônicos', 'Preço(un)': 25.00 },
        { id: 2, Nome: 'Produto Y', 'Código do Produto': 'PROD002', Categoria: 'Roupas', 'Preço(un)': 30.00 },
    ];

    const product = products.find(p => p.id.toString() === id);

    const fields = [
        { name: 'nome', label: 'Nome', type: 'text' as const, required: true },
        { name: 'codigoProduto', label: 'Código do Produto', type: 'text' as const, required: true },
        { name: 'categoria', label: 'Categoria', type: 'select' as const, options: ['Eletrônicos', 'Roupas', 'Alimentos'], required: true },
        { name: 'precoUn', label: 'Preço(un)', type: 'number' as const, required: true },
    ];

    const handleSubmit = (data: Record<string, any>) => {
        // Simulação de salvar no banco
        console.log('Produto atualizado:', { id, ...data });
        // Aqui você pode fazer uma chamada para a API
    };

    const handleDelete = () => {
        console.log('Excluir produto:', id);
        // Aqui você pode fazer uma chamada para a API
    };

    if (!product) {
        return (
            <section>
                <SetHeader content="Gerenciar Produto" />
                <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                    <main className="w-full py-26">
                        <p>Produto não encontrado.</p>
                    </main>
                </div>
            </section>
        );
    }

    return (
        <section>
            <SetHeader content={`Gerenciar Produto: ${product.Nome}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ nome: product.Nome, codigoProduto: product['Código do Produto'], categoria: product.Categoria, precoUn: product['Preço(un)'] }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}