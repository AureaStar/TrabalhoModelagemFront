'use client';

import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';

export default function NewProductPage() {
    const fields = [
        { name: 'nome', label: 'Nome', type: 'text' as const, required: true },
        { name: 'codigo_produto', label: 'Código do Produto', type: 'text' as const, required: true },
        { name: 'categoria', label: 'Categoria', type: 'select' as const, options: ['Eletrônicos', 'Roupas', 'Alimentos'], required: true },
        { name: 'preco', label: 'Preço(un)', type: 'number' as const, required: true },
    ];

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const res = await fetch('/api/products', {
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
            <SetHeader content="Novo Produto" />
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