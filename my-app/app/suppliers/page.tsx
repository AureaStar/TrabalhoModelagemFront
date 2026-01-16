'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';
import { useEffect ,useState } from 'react';

interface Fornecedor {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    area_atuacao: string;
    status: string;
}

export default function SuppliersPage() {
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

    useEffect(() => {
        async function fetchFornecedores() {
            try {
                const response = await fetch('/api/suppliers');
                if (!response.ok) throw new Error('Erro ao buscar fornecedores');

                const data = await response.json();
                setFornecedores(data);
            } catch (error) {
                console.error('Erro ao buscar fornecedores:', error);
            }
        }

        fetchFornecedores();
    }, []);
    
    const headers = ['Nome', 'Email', 'Telefone', 'Área de Atuação', 'Status'];
    const data = fornecedores.map(fornecedor => ({
        id: fornecedor.id,
        Nome: fornecedor.nome,
        Email: fornecedor.email,
        Telefone: fornecedor.telefone,
        'Área de Atuação': fornecedor.area_atuacao,
        Status: fornecedor.status,
    }));

    return (
        <section>
            <SetHeader content="Fornecedores" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onManage={(item) => console.log('Gerenciar fornecedor:', item)}
                        routes="/suppliers"
                    />
                </main>
            </div>
        </section>
    );
}