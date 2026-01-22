'use client';

import { useState, useMemo } from 'react';
import SetHeader from '@/components/header/SetHeader';
import GenericForm from '@/components/form/GenericForm';
import { useEffect } from 'react';

interface Produto {
    id: number;
    codigo_produto: string;
    nome: string;
    categoria: string;
    preco: number;
}

interface CartItem {
    product: Produto;
    quantity: number;
}



export default function NewOrderPage() {
    const [products, setProducts] = useState<Produto[]>([]);
    const categories = Array.from(new Set(products.map(p => p.categoria)));
    const [clientes, setClientes] = useState<Array<{ id: number; instituicao: string }>>([]);

    useEffect(() => {
        async function fetchClientes() {
            try {
                const res = await fetch('/api/customers');
                if (!res.ok) throw new Error('Erro ao buscar clientes');
                const data = await res.json();
                console.log('Clientes carregados:', data);
                setClientes(data);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        }
        fetchClientes();
    }, []);

    useEffect(() => {
        async function fetchProdutos() {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Erro ao buscar produtos');

                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        }

        fetchProdutos();
    }, []);

    console.log('Estado clientes:', clientes);

    const clienteOptions = clientes.length > 0 ? clientes.map(c => c.instituicao) : [];
    const clienteMap = clientes.reduce((acc, c) => {
        acc[c.instituicao] = c.id;
        return acc;
    }, {} as Record<string, number>);

    console.log('Options:', clienteOptions);

    const fields = [
        { name: 'codigo_pedido', label: 'Código do Pedido', type: 'text' as const, required: true },
        { name: 'cliente_nome', label: 'Cliente', type: 'select' as const, options: clienteOptions, required: true },
        { name: 'status', label: 'Status', type: 'select' as const, options: ['Pendente', 'Aprovado', 'Cancelado'], required: true },
        { name: 'preco', label: 'Preço', type: 'number' as const, required: true },
    ];
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [codigoPedido, setCodigoPedido] = useState('');
    const [cliente, setCliente] = useState('');
    const [data, setData] = useState('');
    const [status, setStatus] = useState('');
    const [desconto, setDesconto] = useState(0);

    const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
        filtered = filtered.filter(p =>
            p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoria.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (selectedCategory) {
        filtered = filtered.filter(p => p.categoria === selectedCategory);
    }

    return filtered;
}, [searchQuery, selectedCategory, products]);

    const addToCart = (product: Produto) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prev, { product, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev =>
            prev.map(item =>
                item.product.id === id
                    ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.product.id !== id));
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.product.preco * item.quantity, 0);

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            const payload = {
                codigo_pedido: data.codigo_pedido,
                id_cliente: clienteMap[data.cliente_nome],
                status: data.status,
                preco: parseFloat(data.preco)
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
    };

    const handleCancel = () => {
        console.log('Cancelar');
        // Aqui você pode redirecionar ou algo
    };

    return (
        <section>
            <SetHeader content="Novo Pedido" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26 flex gap-4">
                    {/* Tabela de Produtos */}
                    <div className="w-1/2 bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Produtos</h2>
                        <div className="flex gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Pesquisar produtos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-gray-100 border border-gray-300 rounded-t-lg p-2 ring-0 focus:outline-none focus:ring-0 placeholder:text-black"
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-gray-100 border border-gray-300 rounded p-2"
                            >
                                <option value="">Todas as categorias</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="overflow-y-auto max-h-96">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2">Produto</th>
                                        <th className="border border-gray-300 p-2">Categoria</th>
                                        <th className="border border-gray-300 p-2">Preço Un</th>
                                        <th className="border border-gray-300 p-2">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td className="border border-gray-300 p-2">{product.nome}</td>
                                            <td className="border border-gray-300 p-2">{product.categoria}</td>
                                            <td className="border border-gray-300 p-2">R$ {product.preco.toFixed(2)}</td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    className="bg-gray-400 text-white px-3 py-1 rounded-full hover:bg-gray-600"
                                                >
                                                    +
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Carrinho */}
                    <div className="w-1/2 bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Carrinho</h2>
                        <div className="overflow-y-auto max-h-96">
                            {cart.length === 0 ? (
                                <p>Carrinho vazio</p>
                            ) : (
                                <ul className="space-y-2">
                                    {cart.map(item => (
                                        <li key={item.product.id} className="flex justify-between items-center p-2 border rounded">
                                            <div>
                                                <p className="font-semibold">{item.product.nome}</p>
                                                <p className="text-sm text-black">R$ {item.product.preco.toFixed(2)} cada</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, -1)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, 1)}
                                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 ml-2"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-lg font-bold">Total: R$ {totalPrice.toFixed(2)}</p>
                            {cart.length > 0 && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Finalizar Pedido
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-black">Conferir Pedido</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-black">Código do Pedido</label>
                                <input
                                    type="text"
                                    value={codigoPedido}
                                    onChange={(e) => setCodigoPedido(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black">Cliente</label>
                                <select
                                    value={cliente}
                                    onChange={(e) => setCliente(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black"
                                    required
                                >
                                    <option value="">Selecione um cliente</option>
                                    {clienteOptions.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black">Data</label>
                                <input
                                    type="date"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black"
                                    required
                                >
                                    <option value="">Selecione o status</option>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Aprovado">Aprovado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black">Desconto</label>
                                <input
                                    type="number"
                                    value={desconto}
                                    onChange={(e) => setDesconto(Number(e.target.value))}
                                    className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black"
                                    min="0"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-black">Itens do Pedido:</h3>
                                <ul className="space-y-1">
                                    {cart.map(item => (
                                        <li key={item.product.id} className="text-sm text-black">
                                            {item.product.nome} - {item.quantity} x R$ {item.product.preco.toFixed(2)} = R$ {(item.product.preco * item.quantity).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-black">Total sem desconto: R$ {totalPrice.toFixed(2)}</p>
                                <p className="text-black">Total com desconto: R$ {(totalPrice - desconto).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => {
                                    const finalPrice = totalPrice - desconto;
                                    handleSubmit({ codigo_pedido: codigoPedido, cliente_nome: cliente, status: status, preco: finalPrice });
                                    setIsModalOpen(false);
                                    // Reset states or redirect
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Confirmar Pedido
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}