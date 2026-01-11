'use client';

import { useParams } from 'next/navigation';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageSupplierPage() {
    const params = useParams();
    const id = params.id as string;

    // Simulação de busca no banco (dados mockados)
    const suppliers = [
        { id: 1, Nome: 'Fornecedor A', Telefone: '123456789' },
        { id: 2, Nome: 'Fornecedor B', Telefone: '987654321' },
    ];

    const supplier = suppliers.find(s => s.id.toString() === id);

    const fields = [
        { name: 'nome', label: 'Nome', type: 'text' as const, required: true },
        { name: 'telefone', label: 'Telefone', type: 'text' as const, required: true },
    ];

    const handleSubmit = (data: Record<string, any>) => {
        // Simulação de salvar no banco
        console.log('Fornecedor atualizado:', { id, ...data });
        // Aqui você pode fazer uma chamada para a API
    };

    const handleDelete = () => {
        console.log('Excluir fornecedor:', id);
        // Aqui você pode fazer uma chamada para a API
    };

    if (!supplier) {
        return (
            <section>
                <SetHeader content="Gerenciar Fornecedor" />
                <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                    <main className="w-full py-26">
                        <p>Fornecedor não encontrado.</p>
                    </main>
                </div>
            </section>
        );
    }

    return (
        <section>
            <SetHeader content={`Gerenciar Fornecedor: ${supplier.Nome}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ nome: supplier.Nome, telefone: supplier.Telefone }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}