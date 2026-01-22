'use client';

import SetHeader from '@/components/header/SetHeader';
import { useEffect, useState } from 'react';

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

export default function NewAcquisitionPage() {
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
                const [resFornecedores, resProdutos] = await Promise.all([
                    fetch('/api/suppliers'),
                    fetch('/api/products')
                ]);

                if (!resFornecedores.ok || !resProdutos.ok) {
                    throw new Error('Erro ao buscar dados');
                }

                const fornecedoresData = await resFornecedores.json();
                const produtosData = await resProdutos.json();

                setFornecedores(fornecedoresData);
                setProdutos(produtosData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }
        fetchData();
    }, []);

    const handleProdutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const produtoId = Number(e.target.value);
        const produto = produtos.find(p => p.id === produtoId) || null;
        setSelectedProduto(produto);
    };

    const total = selectedProduto ? (quantidade * selectedProduto.preco) - desconto : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validação mais robusta
        const fornecedorSelect = (e.target as HTMLFormElement).elements.namedItem('fornecedor') as HTMLSelectElement;
        const fornecedorId = fornecedorSelect?.value;

        if (!fornecedorId) {
            console.log('Selecione um fornecedor');
            return;
        }

        if (!selectedProduto) {
            console.log('Selecione um produto');
            return;
        }

        if (quantidade <= 0) {
            console.log('A quantidade deve ser maior que zero');
            return;
        }

        if (!entrada) {
            console.log('Selecione uma data de aquisição');
            return;
        }

        try {
            const payload = {
                id_fornecedor: Number(fornecedorId),
                id_produto: selectedProduto.id,
                quantidade: quantidade,
                preco: selectedProduto.preco, // Preço UNITÁRIO
                desconto: desconto,
                entrada: entrada, // Já está no formato YYYY-MM-DD
                observacoes: observacoes,
            };

            console.log("📤 Enviando payload:", payload);

            const res = await fetch('/api/acquisitions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            console.log("📥 Resposta do servidor:", result);

            if (!res.ok) {
                const errorMsg = result.details || result.error || `Erro ${res.status}`;
                throw new Error(errorMsg);
            }

            // Sucesso - redirecionar
            console.log('Aquisição registrada com sucesso!');
            window.location.href = '/acquisitions';

        } catch (error: any) {
            console.error('❌ Erro completo:', error);
            console.log(`Erro: ${error.message}`);
        }
    };

    const cancel = () => {
        window.history.back();
    };

    return (
        <section>
            <SetHeader content="Nova Aquisição" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                            <select
                                name="produto"
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
                                        onChange={(e) => setQuantidade(Math.max(0, parseFloat(e.target.value.replace(',', '.')) || 0))}
                                        className="flex-1 bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                        min="0"
                                    />
                                    <span className="ml-2 text-gray-600">{selectedProduto?.unidade || ''}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unitário (R$)</label>
                                <input
                                    type="number"
                                    value={selectedProduto ? selectedProduto.preco.toFixed(2) : '0.00'}
                                    readOnly
                                    className="w-full bg-gray-200 border border-gray-300 rounded-lg p-2"
                                />
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
                                    onChange={(e) => setDesconto(parseFloat(e.target.value.replace(',', '.')) || 0)}
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
                                onClick={cancel}
                                className="bg-gray-500 text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-4"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-green text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </section>
    );
}