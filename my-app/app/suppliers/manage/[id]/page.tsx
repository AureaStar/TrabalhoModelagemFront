'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SetHeader from '@/components/header/SetHeader';

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatTelefone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

export default function ManageSupplierPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [fornecedor, setFornecedor] = useState<any>(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [tipoAssociado, setTipoAssociado] = useState('');
    const [endereco, setEndereco] = useState('');
    const [areaAtuacao, setAreaAtuacao] = useState('');
    const [status, setStatus] = useState('Cooperado');
    const [cpfError, setCpfError] = useState(false);
    const [telefoneError, setTelefoneError] = useState(false);

    useEffect(() => {
        if (!id) return;
        
        async function fetchFornecedor() {
            try {
                const res = await fetch(`/api/suppliers/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setFornecedor(null);
                    return;
                }
                
                setFornecedor(data);
                setNome(data.nome);
                setEmail(data.email);
                setCpf(data.cpf);
                setTelefone(data.telefone);
                setTipoAssociado(data.tipo_associado);
                setEndereco(data.endereco);
                setAreaAtuacao(data.area_atuacao);
                setStatus(data.status);
                setCpfError(data.cpf.replace(/\D/g, '').length !== 11);
                setTelefoneError(data.telefone.replace(/\D/g, '').length !== 11);
            } catch (error) {
                console.error('Erro ao buscar fornecedor:', error);
                setFornecedor(null);
            }
        }
        fetchFornecedor();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cpfError || telefoneError) {
            console.log('Corrija os campos com erro antes de enviar.');
            return;
        }

        try {
            const payload = {
                nome,
                email,
                cpf,
                telefone,
                tipo_associado: tipoAssociado,
                endereco,
                area_atuacao: areaAtuacao,
                status,
            };

            const res = await fetch(`/api/suppliers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/suppliers');
        } catch (error: any) {
            console.log(`Erro: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/suppliers/${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            router.push('/suppliers');
        } catch (error: any) {
            console.log(`Erro: ${error.message}`);
        }
    };

    if (!fornecedor) return null;

    return (
        <section>
            <SetHeader content={`Gerenciar Fornecedor: ${fornecedor.nome}`} />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                <input
                                    type="text"
                                    value={cpf}
                                    onChange={(e) => {
                                        const formatted = formatCPF(e.target.value);
                                        setCpf(formatted);
                                        setCpfError(formatted.replace(/\D/g, '').length !== 11);
                                    }}
                                    placeholder="000.000.000-00"
                                    className={`w-full bg-gray-100 border rounded-lg p-2 focus:outline-none focus:ring-2 ${cpfError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                <input
                                    type="text"
                                    value={telefone}
                                    onChange={(e) => {
                                        const formatted = formatTelefone(e.target.value);
                                        setTelefone(formatted);
                                        setTelefoneError(formatted.replace(/\D/g, '').length !== 11);
                                    }}
                                    placeholder="(00) 00000-0000"
                                    className={`w-full bg-gray-100 border rounded-lg p-2 focus:outline-none focus:ring-2 ${telefoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Associado</label>
                                <select
                                    value={tipoAssociado}
                                    onChange={(e) => setTipoAssociado(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="Produtor">Produtor</option>
                                    <option value="Cooperativa">Cooperativa</option>
                                    <option value="Empresa">Empresa</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                            <input
                                type="text"
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Área de Atuação</label>
                                <select
                                    value={areaAtuacao}
                                    onChange={(e) => setAreaAtuacao(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="Agricultura">Agricultura</option>
                                    <option value="Pecuária">Pecuária</option>
                                    <option value="Agroindústria">Agroindústria</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="Cooperado">Cooperado</option>
                                    <option value="Desligado">Desligado</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex w-full items-end justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/suppliers')}
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