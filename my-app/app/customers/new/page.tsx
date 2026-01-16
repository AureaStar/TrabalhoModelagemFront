'use client';

import { useParams } from 'next/navigation';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function NewCustomerPage() {

    const fields = [
        { name: 'instituicao', label: 'Instituição', type: 'text' as const, required: true },
        { name: 'cnpj', label: 'CNPJ', type: 'text' as const, required: true },
        { name: 'telefone', label: 'Telefone', type: 'text' as const, required: true },
        { name: 'responsavel', label: 'Responsável', type: 'text' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            window.history.back();
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    }

    const cancel = () => {
        window.history.back();
    }

    return (
        <section>
            <SetHeader content={`Adicionar Cliente`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="add"
                        fields={fields}
                        onSubmit={handleSubmit}
                        onCancel={cancel}
                    />
                </main>
            </div>
        </section>
    );
}