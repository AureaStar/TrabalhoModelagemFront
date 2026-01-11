'use client';

import { useParams } from 'next/navigation';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageAcquisitionPage() {
    const params = useParams();
    const id = params.id as string;

    // Simulação de busca no banco (dados mockados)
    const acquisitions = [
        { id: 1, Nome: 'Produto X', Fornecedor: 'Fornecedor A', Entrada: '2023-01-01', Quantidade: 100, 'Preço(un)': 10.50 },
        { id: 2, Nome: 'Produto Y', Fornecedor: 'Fornecedor B', Entrada: '2023-02-01', Quantidade: 200, 'Preço(un)': 15.00 },
    ];

    const acquisition = acquisitions.find(a => a.id.toString() === id);

    const fields = [
        { name: 'nome', label: 'Nome', type: 'text' as const, required: true },
        { name: 'fornecedor', label: 'Fornecedor', type: 'select' as const, options: ['Fornecedor A', 'Fornecedor B'], required: true },
        { name: 'entrada', label: 'Entrada', type: 'text' as const, required: true }, // Pode ser date, mas text por enquanto
        { name: 'quantidade', label: 'Quantidade', type: 'number' as const, required: true },
        { name: 'precoUn', label: 'Preço(un)', type: 'number' as const, required: true },
    ];

    const handleSubmit = (data: Record<string, any>) => {
        // Simulação de salvar no banco
        console.log('Aquisição atualizada:', { id, ...data });
        // Aqui você pode fazer uma chamada para a API
    };

    const handleDelete = () => {
        console.log('Excluir aquisição:', id);
        // Aqui você pode fazer uma chamada para a API
    };

    if (!acquisition) {
        return (
            <section>
                <SetHeader content="Gerenciar Aquisição" />
                <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                    <main className="w-full py-26">
                        <p>Aquisição não encontrada.</p>
                    </main>
                </div>
            </section>
        );
    }

    return (
        <section>
            <SetHeader content={`Gerenciar Aquisição: ${acquisition.Nome}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ nome: acquisition.Nome, fornecedor: acquisition.Fornecedor, entrada: acquisition.Entrada, quantidade: acquisition.Quantidade, precoUn: acquisition['Preço(un)'] }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}