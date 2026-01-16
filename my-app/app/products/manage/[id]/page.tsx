'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';

export default function ManageProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [produto, setProduto] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        
        async function fetchProduto() {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setProduto(null);
                    return;
                }
                
                setProduto(data);
            } catch (error) {
                console.error('Erro ao buscar produto:', error);
                setProduto(null);
            }
        }
        fetchProduto();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const precoStr = formData.get('preco') as string;
        const data = {
            nome: formData.get('nome'),
            codigo_produto: formData.get('codigo_produto'),
            categoria: formData.get('categoria'),
            preco: parseFloat(precoStr.replace(',', '.')),
            unidade: formData.get('unidade'),
        };

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/products');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/products');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (!produto) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Produto: ${produto.nome}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-2/3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    name="nome"
                                    defaultValue={produto.nome}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="w-1/3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                <select
                                    name="categoria"
                                    defaultValue={produto.categoria}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="Eletrônicos">Eletrônicos</option>
                                    <option value="Roupas">Roupas</option>
                                    <option value="Alimentos">Alimentos</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código do Produto</label>
                                <input
                                    type="text"
                                    name="codigo_produto"
                                    defaultValue={produto.codigo_produto}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço(un)</label>
                                <input
                                    type="number"
                                    name="preco"
                                    defaultValue={produto.preco}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida</label>
                                <select
                                    name="unidade"
                                    defaultValue={produto.unidade}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="kg">kg</option>
                                    <option value="litros">litros</option>
                                    <option value="unidades">unidades</option>
                                    <option value="metros">metros</option>
                                    <option value="caixas">caixas</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex w-full items-end justify-end mt-6">
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