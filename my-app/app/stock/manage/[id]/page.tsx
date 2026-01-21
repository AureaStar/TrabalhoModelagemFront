'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';

export default function ManageStockPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [estoque, setEstoque] = useState<any>(null);
    const [quantidade, setQuantidade] = useState<number>(0);

    useEffect(() => {
        if (!id) return;
        
        async function fetchEstoque() {
            try {
                const res = await fetch(`/api/stock/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setEstoque(null);
                    return;
                }
                
                setEstoque(data);
                setQuantidade(data.quantidade);
            } catch (error) {
                console.error('Erro ao buscar estoque:', error);
                setEstoque(null);
            }
        }
        fetchEstoque();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                quantidade: quantidade,
            };

            const res = await fetch(`/api/stock/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/stock');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/stock/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/stock');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (!estoque) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Estoque: ${estoque.produtos[0]?.nome || 'Produto'}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                            <input
                                type="text"
                                value={estoque.produtos[0]?.nome || ''}
                                readOnly
                                className="w-full bg-gray-200 border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                            <input
                                type="number"
                                value={quantidade}
                                onChange={(e) => setQuantidade(Math.max(0, Number(e.target.value) || 0))}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                                min="0"
                            />
                        </div>
                        <div className="flex w-full items-end justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/stock')}
                                className="bg-gray-500 text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-4"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-green text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500 mr-4"
                            >
                                Salvar
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-500 text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Deletar
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </section>
    );
}