'use client';

import { useParams } from 'next/navigation';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function ManageCustomerPage() {
    const params = useParams();
    const id = params.id as string;

    const customers = [
        { id: 1, Instituição: 'Empresa A', CNPJ: '12345678000100', Telefone: '111111111', Responsável: 'João' },
        { id: 2, Instituição: 'Empresa B', CNPJ: '98765432000199', Telefone: '222222222', Responsável: 'Maria' },
    ];

    const customer = customers.find(c => c.id.toString() === id);

    const fields = [
        { name: 'instituicao', label: 'Instituição', type: 'text' as const, required: true },
        { name: 'cnpj', label: 'CNPJ', type: 'text' as const, required: true },
        { name: 'telefone', label: 'Telefone', type: 'text' as const, required: true },
        { name: 'responsavel', label: 'Responsável', type: 'text' as const, required: true },
    ];

    const handleSubmit = (data: Record<string, any>) => {
        // Simulação de salvar no banco
        console.log('Cliente atualizado:', { id, ...data });
        // Aqui você pode fazer uma chamada para a API
    };

    const handleDelete = () => {
        console.log('Excluir cliente:', id);
        // Aqui você pode fazer uma chamada para a API
    };

    if (!customer) {
        return (
            <section>
                <SetHeader content="Gerenciar Cliente" />
                <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                    <main className="w-full py-26">
                        <p>Cliente não encontrado.</p>
                    </main>
                </div>
            </section>
        );
    }

    return (
        <section>
            <SetHeader content={`Gerenciar Cliente: ${customer.Instituição}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="edit"
                        fields={fields}
                        initialData={{ instituicao: customer.Instituição, cnpj: customer.CNPJ, telefone: customer.Telefone, responsavel: customer.Responsável }}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </main>
            </div>
        </section>
    );
}