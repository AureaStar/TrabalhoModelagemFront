'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import SetHeader from '@/components/header/SetHeader';

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

export default function ManageOrderPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    // Estados de dados
    const [products, setProducts] = useState<Produto[]>([]);
    const [clientes, setClientes] = useState<Array<{ id: number; instituicao: string }>>([]);
    
    // Estados do formulário (Sincronizados com o banco)
    const [cart, setCart] = useState<CartItem[]>([]);
    const [codigoPedido, setCodigoPedido] = useState('');
    const [cliente, setCliente] = useState('');
    const [data, setData] = useState('');
    const [status, setStatus] = useState('');
    const [desconto, setDesconto] = useState(0);

    // Estados de UI
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Carregar Clientes e Produtos
    useEffect(() => {
        async function fetchData() {
            try {
                const [resCust, resProd] = await Promise.all([
                    fetch('/api/customers'),
                    fetch('/api/products')
                ]);
                setClientes(await resCust.json());
                setProducts(await resProd.json());
            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
            }
        }
        fetchData();
    }, []);

    // 2. Carregar o Pedido e preencher o Carrinho
    useEffect(() => {
        if (!id || products.length === 0) return;

        async function fetchOrder() {
            try {
                const res = await fetch(`/api/orders/${id}`);
                const order = await res.json();

                setCodigoPedido(order.codigo_pedido);
                setStatus(order.status);
                setDesconto(order.desconto || 0);
                setData(new Date(order.data).toISOString().split('T')[0]);
                
                // Encontra o nome do cliente pelo ID
                const currentCustomer = clientes.find(c => c.id === order.id_cliente);
                if (currentCustomer) setCliente(currentCustomer.instituicao);

                // PREENCHER CARRINHO COM PRODUTOS CADASTRADOS
                if (order.itens && order.itens.length > 0) {
                    const savedItems = order.itens.map((item: any) => {
                        const productObj = products.find(p => p.id === item.id_produto);
                        if (productObj) {
                            return {
                                product: productObj,
                                quantity: item.quantidade
                            };
                        }
                        return null;
                    }).filter((item: any) => item !== null);

                    setCart(savedItems);
                }
            } catch (error) {
                console.error('Erro ao carregar pedido:', error);
            }
        }
        fetchOrder();
    }, [id, products, clientes]);

    // Mapeamentos
    const clienteOptions = clientes.map(c => c.instituicao);
    const clienteMap = clientes.reduce((acc, c) => {
        acc[c.instituicao] = c.id;
        return acc;
    }, {} as Record<string, number>);

    // Lógica de Filtro
    const categories = Array.from(new Set(products.map(p => p.categoria)));
    const filteredProducts = useMemo(() => {
        let filtered = products;
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.categoria.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (selectedCategory) filtered = filtered.filter(p => p.categoria === selectedCategory);
        return filtered;
    }, [searchQuery, selectedCategory, products]);

    // Funções do Carrinho
    const addToCart = (product: Produto) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => 
            item.product.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        ).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.product.id !== id));
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.product.preco * item.quantity, 0);

    const handleUpdate = async () => {
        try {
            const payload = {
                codigo_pedido: codigoPedido,
                id_cliente: clienteMap[cliente],
                status: status,
                data: data,
                desconto: desconto,
                preco: totalPrice - desconto,
                itens: cart.map(item => ({
                    id_produto: item.product.id,
                    quantidade: item.quantity,
                    preco_unitario: item.product.preco
                }))
            };

            const res = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Erro ao atualizar');
            router.back();
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    return (
        <section>
            <SetHeader content={`Editar Pedido: ${codigoPedido}`} />
            
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
                                        <th className="border border-gray-300 p-2 text-left">Produto</th>
                                        <th className="border border-gray-300 p-2 text-left">Categoria</th>
                                        <th className="border border-gray-300 p-2 text-left">Preço Un</th>
                                        <th className="border border-gray-300 p-2 text-center">Ação</th>
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
                        <div className="overflow-y-auto max-h-96 min-h-[10rem]">
                            {cart.length === 0 ? (
                                <p className="text-gray-400">Carregando itens do pedido...</p>
                            ) : (
                                <ul className="space-y-2">
                                    {cart.map(item => (
                                        <li key={item.product.id} className="flex justify-between items-center p-2 border rounded">
                                            <div>
                                                <p className="font-semibold">{item.product.nome}</p>
                                                <p className="text-sm text-black">R$ {item.product.preco.toFixed(2)} cada</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => updateQuantity(item.product.id, -1)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.product.id, 1)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">+</button>
                                                <button onClick={() => removeFromCart(item.product.id)} className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 ml-2">Remover</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-lg font-bold">Total: R$ {totalPrice.toFixed(2)}</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold w-full"
                            >
                                Conferir e Salvar
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal de Conferência */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-black">Conferir Alterações</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-black">Código do Pedido</label>
                                <input type="text" value={codigoPedido} onChange={(e) => setCodigoPedido(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black">Cliente</label>
                                <select value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black">
                                    <option value="">Selecione um cliente</option>
                                    {clienteOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-black">Data</label>
                                    <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-black">Status</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black">
                                        <option value="Pendente">Pendente</option>
                                        <option value="Aprovado">Aprovado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-black">Desconto (R$)</label>
                                <input type="number" value={desconto} onChange={(e) => setDesconto(Number(e.target.value))} className="w-full bg-gray-100 border border-gray-300 rounded p-2 text-black" />
                            </div>
                            
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-black mb-2">Itens Atualizados:</h3>
                                <ul className="space-y-1">
                                    {cart.map(item => (
                                        <li key={item.product.id} className="text-sm text-black">
                                            {item.product.nome} - {item.quantity}x R$ {item.product.preco.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 p-2 bg-gray-50 rounded">
                                    <p className="text-black">Total Original: R$ {totalPrice.toFixed(2)}</p>
                                    <p className="text-lg font-bold text-black">Total com Desconto: R$ {(totalPrice - desconto).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button onClick={handleUpdate} className="flex-1 bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600">Salvar Alterações</button>
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-500 text-white py-2 rounded font-bold hover:bg-gray-600">Voltar</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}