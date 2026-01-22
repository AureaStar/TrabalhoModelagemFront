'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SetHeader from '@/components/header/SetHeader';

// Funções de formatação e validação
const formatCNPJ = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
};

const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
        return numbers
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .substring(0, 14);
    } else {
        return numbers
            .replace(/^(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .substring(0, 15);
    }
};

export default function NewCustomerPage() {
    const router = useRouter();

    // Estados dos campos
    const [instituicao, setInstituicao] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [telefone, setTelefone] = useState('');
    const [status, setStatus] = useState('ativo');
    const [responsavel, setResponsavel] = useState('');
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanCNPJ = cnpj.replace(/\D/g, '');
        const cleanPhone = telefone.replace(/\D/g, '');

        // Validação
        if (cleanCNPJ.length !== 14) {
            console.log('CNPJ inválido. Digite os 14 números.');
            return;
        }

        try {
            const payload = {
                instituicao,
                cnpj: cleanCNPJ,
                telefone: cleanPhone,
                status,
                responsavel,
                email,
                endereco
            };

            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            router.push('/customers');
        } catch (error: any) {
            console.log(`Erro: ${error.message}`);
        }
    };

    return (
        <section>
            <SetHeader content="Adicionar Cliente" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans text-black">
                <main className="w-full py-26">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Linha 1: Instituição */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instituição</label>
                            <input
                                type="text"
                                value={instituicao}
                                onChange={(e) => setInstituicao(e.target.value)}
                                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Linha 2: CNPJ, Telefone e Status */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                                <input
                                    type="text"
                                    value={cnpj}
                                    onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                                    placeholder="00.000.000/0000-00"
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                <input
                                    type="text"
                                    value={telefone}
                                    onChange={(e) => setTelefone(formatPhone(e.target.value))}
                                    placeholder="(00) 00000-0000"
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="ativo">Ativo</option>
                                    <option value="inativo">Inativo</option>
                                </select>
                            </div>
                        </div>

                        {/* Linha 3: Responsável e Email */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                                <input
                                    type="text"
                                    value={responsavel}
                                    onChange={(e) => setResponsavel(e.target.value)}
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

                        {/* Linha 4: Endereço */}
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

                        {/* Botões */}
                        <div className="flex w-full items-end justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-gray-500 text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-4"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-green text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Adicionar
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </section>
    );
}