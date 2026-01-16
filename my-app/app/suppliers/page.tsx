'use client';

import Table from '@/components/table';
import SetHeader from '../../components/header/SetHeader';
import { useEffect ,useState } from 'react';

interface Fornecedor {
    id: number;
    nome: string;
    telefone: string;
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
    
    const headers = ['Nome', 'Telefone'];
    const data = fornecedores.map(fornecedor => ({
        id: fornecedor.id,
        Nome: fornecedor.nome,
        Telefone: fornecedor.telefone,
    }));

    return (
        <section>
            <SetHeader content="Fornecedores" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onAdd={() => console.log('Adicionar novo fornecedor')}
                        onManage={(item) => console.log('Gerenciar fornecedor:', item)}
                        routes="/suppliers"
                    />
                </main>
            </div>
        </section>
    );
}