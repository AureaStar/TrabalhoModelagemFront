'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';

interface Produto {
    id: number;
    nome: string;
    preco: number;
    unidade: string;
}

interface Fornecedor {
    id: number;
    nome: string;
}

interface Aquisicao {
    id: number;
    id_fornecedor: number;
    quantidade: number;
    preco: number;
    desconto: number;
    entrada: string;
    observacoes: string;
    produtos: Produto[];
    fornecedor: Fornecedor;
}

export default function ManageAcquisitionPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [aquisicao, setAquisicao] = useState<Aquisicao | null>(null);
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
    const [quantidade, setQuantidade] = useState<number>(0);
    const [desconto, setDesconto] = useState<number>(0);
    const [entrada, setEntrada] = useState<string>('');
    const [observacoes, setObservacoes] = useState<string>('');

    useEffect(() => {
        async function fetchData() {
            try {
                const [resAquisicao, resFornecedores, resProdutos] = await Promise.all([
                    fetch(`/api/acquisitions/${id}`),
                    fetch('/api/suppliers'),
                    fetch('/api/products')
                ]);
                
                if (!resAquisicao.ok || !resFornecedores.ok || !resProdutos.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                
                const aquisicaoData = await resAquisicao.json();
                const fornecedoresData = await resFornecedores.json();
                const produtosData = await resProdutos.json();
                
                setAquisicao(aquisicaoData);
                setFornecedores(fornecedoresData);
                setProdutos(produtosData);

                // Set initial values
                setSelectedProduto(aquisicaoData.produtos[0] || null);
                setQuantidade(aquisicaoData.quantidade);
                setDesconto(aquisicaoData.desconto || 0);
                setEntrada(aquisicaoData.entrada.split('T')[0]); // date part
                setObservacoes(aquisicaoData.observacoes || '');
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }
        if (id) fetchData();
    }, [id]);

    const handleProdutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const produtoId = Number(e.target.value);
        const produto = produtos.find(p => p.id === produtoId) || null;
        setSelectedProduto(produto);
    };

    const total = selectedProduto ? (quantidade * selectedProduto.preco) - desconto : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduto || !aquisicao) return;

        try {
            const payload = {
                id_fornecedor: Number((e.target as any).fornecedor.value),
                quantidade,
                preco: total,
                desconto,
                entrada,
                observacoes,
                produtoId: selectedProduto.id,
            };

            const res = await fetch(`/api/acquisitions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/acquisitions');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/acquisitions/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/acquisitions');
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    if (!aquisicao) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Aquisição ID: ${aquisicao.id}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                            <select
                                name="produto"
                                value={selectedProduto?.id || ''}
                                onChange={handleProdutoChange}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">Selecione um produto</option>
                                {produtos.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                            <select
                                name="fornecedor"
                                defaultValue={aquisicao.id_fornecedor}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">Selecione um fornecedor</option>
                                {fornecedores.map(f => (
                                    <option key={f.id} value={f.id}>{f.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                <div className="flex items-center">
                                    <input
                                        type="number"
                                        value={quantidade}
                                        onChange={(e) => setQuantidade(Number(e.target.value))}
                                        className="flex-1 bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                        min="0"
                                    />
                                    <span className="ml-2 text-gray-600">{selectedProduto?.unidade || ''}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Aquisição</label>
                                <input
                                    type="date"
                                    value={entrada}
                                    onChange={(e) => setEntrada(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Desconto</label>
                                <input
                                    type="number"
                                    value={desconto}
                                    onChange={(e) => setDesconto(Number(e.target.value))}

                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    min="0"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                                <input
                                    type="number"
                                    value={total.toFixed(2)}
                                    readOnly
                                    className="w-full bg-gray-200 border border-gray-300 rounded-lg p-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                            <textarea
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                rows={4}
                            />
                        </div>
                        <div className="flex w-full items-end justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/acquisitions')}
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