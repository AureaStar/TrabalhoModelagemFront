'use client';

import { useParams } from 'next/navigation';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageStockPage() {
    const params = useParams();
    const id = params.id as string;

    // Simulação de busca no banco (dados mockados)
    const stock = [
        { id: 1, Nome: 'Produto A', Categoria: 'Eletrônicos', Quantidade: 50, 'Preço(un)': 20.00 },
        { id: 2, Nome: 'Produto B', Categoria: 'Roupas', Quantidade: 30, 'Preço(un)': 15.00 },
    ];

    const item = stock.find(s => s.id.toString() === id);

    const fields = [
        { name: 'nome', label: 'Nome', type: 'text' as const, required: true },
        { name: 'categoria', label: 'Categoria', type: 'select' as const, options: ['Eletrônicos', 'Roupas', 'Alimentos'], required: true },
        { name: 'quantidade', label: 'Quantidade', type: 'number' as const, required: true },
        { name: 'precoUn', label: 'Preço(un)', type: 'number' as const, required: true },
    ];

    const handleSubmit = (data: Record<string, any>) => {
        // Simulação de salvar no banco
        console.log('Item do estoque atualizado:', { id, ...data });
        // Aqui você pode fazer uma chamada para a API
    };

    const handleDelete = () => {
        console.log('Excluir item do estoque:', id);
        // Aqui você pode fazer uma chamada para a API
    };

    if (!item) {
        return (
            <section>
                <SetHeader content="Gerenciar Item do Estoque" />
                <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                    <main className="w-full py-26">
                        <p>Item não encontrado.</p>
                    </main>
                </div>
            </section>
        );
    }

    return (
        <section>
            <SetHeader content={`Gerenciar Item: ${item.Nome}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ nome: item.Nome, categoria: item.Categoria, quantidade: item.Quantidade, precoUn: item['Preço(un)'] }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}