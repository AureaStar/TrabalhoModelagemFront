'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

interface TableProps {
    headers: string[];
    data: Record<string, any>[];
    categories?: string[];
    showFilter?: boolean;
    onManage?: (row: Record<string, any>) => void;
    routes?: string;
}

const Table: React.FC<TableProps> = ({ headers, data, categories = [], showFilter = false, onManage, routes }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    const filteredData = useMemo(() => {
        let filtered = data;

        if (searchQuery) {
            filtered = filtered.filter(item =>
                headers.some(header =>
                    String(item[header]).toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        if (showFilter && selectedCategory) {
            filtered = filtered.filter(item => item.Categoria === selectedCategory);
        }

        return filtered;
    }, [data, searchQuery, selectedCategory, headers, showFilter]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    return (
        <div className="table-container w-full text-black">
            <div className="table-controls flex flex-row justify-between items-center mb-4">
                <div className="flex flex-row items-center gap-4 w-7/10">
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input w-7/10 bg-gray-100 border border-gray-300 rounded-t-lg p-2 ring-0 focus:outline-none focus:ring-0"
                    />
                    {showFilter && (
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="filter-select bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none"
                        >
                            <option value="">Todas as categorias</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    )}
                </div>
                <Link href={`${routes}/new`} className="add-button bg-white py-2 px-6 rounded-lg flex justify-center items-center gap-2"><span className="material-symbols-outlined">add</span> Adicionar</Link>
            </div>
            <table className="table bg-background-white border border-gray-200 w-full rounded-xl overflow-hidden">
                <thead className="bg-gray-100 w-full">
                    <tr className="text-left p-2 w-full">
                        {headers.map(header => (
                            <th className="p-2" key={header}>{header}</th>
                        ))}
                        {onManage && <th className="p-2 w-1/12 text-center">Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            {headers.map(header => (
                                <td key={header} className="p-2">{row[header]}</td>
                            ))}
                            {onManage && (
                                <td className="p-2 w-full flex justify-center items-center">
                                    {routes ? (
                                        <Link href={`${routes}/manage/${row.id}`} className="text-gray-600 hover:text-gray-800">
                                            <span className="material-symbols-outlined">settings</span>
                                        </Link>
                                    ) : (
                                        <button onClick={() => onManage(row)} className="text-gray-600 hover:text-gray-800">
                                            <span className="material-symbols-outlined">settings</span>
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className="pagination mt-4 flex justify-center items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
};

export default Table;