'use client';

import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function NewSupplierPage() {
    const fields = [
        { name: 'nome', label: 'Nome', type: 'text' as const, required: true },
        { name: 'telefone', label: 'Telefone', type: 'text' as const, required: true },
    ];

    const handleSubmit = (data: Record<string, any>) => {
        // Simulação de adicionar no banco
        console.log('Novo fornecedor:', data);
        // Aqui você pode fazer uma chamada para a API
    };

    const handleCancel = () => {
        console.log('Cancelar');
        // Aqui você pode redirecionar ou algo
    };

    return (
        <section>
            <SetHeader content="Novo Fornecedor" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <GenericForm
                        mode="add"
                        fields={fields}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </main>
            </div>
        </section>
    );
}