'use client';

import Table from '@/components/table';
import { useEffect, useState } from 'react';
import SetHeader from '../../components/header/SetHeader';
interface Cliente {
    id: number;
    instituicao: string;
    cnpj: string;
    telefone: string;
    responsavel: string;
}


export default function CustomersPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);

    useEffect(() => {
        async function fetchClientes() {
            try {
                const response = await fetch('/api/customers');
                if (!response.ok) throw new Error('Erro ao buscar clientes');
                
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        }

        fetchClientes();
    }, []);

    const headers = ['Instituição', 'CNPJ', 'Telefone', 'Responsável'];
    
    // Mapear os dados do banco para o formato da tabela
    const data = clientes.map(cliente => ({
        id: cliente.id,
        'Instituição': cliente.instituicao,
        'CNPJ': cliente.cnpj,
        'Telefone': cliente.telefone,
        'Responsável': cliente.responsavel
    }));

    return (
        <section>
            <SetHeader content="Clientes" />
            <div className="flex px-44 w-full min-h-[calc(100vh-10rem)] items-start justify-center bg-background-clean font-sans">
                <main className="w-full py-26">
                    <Table
                        headers={headers}
                        data={data}
                        onManage={(item) => console.log('Gerenciar cliente:', item)}
                        routes="/customers"
                    />
                </main>
            </div>
        </section>
    );
};