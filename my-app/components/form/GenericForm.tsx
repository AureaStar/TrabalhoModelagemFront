'use client';

import { useState, useEffect } from 'react';

interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'date' | 'textarea';
    options?: string[];
    required?: boolean;
}

interface GenericFormProps {
    mode: 'edit' | 'add';
    fields: FieldConfig[];
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void;
    onDelete?: () => void;
    onCancel?: () => void;
}

export default function GenericForm({ mode, fields, initialData = {}, onSubmit, onDelete, onCancel }: GenericFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        const initial: Record<string, any> = {};
        fields.forEach(field => {
            initial[field.name] = initialData[field.name] || (field.type === 'number' ? 0 : '');
        });
        setFormData(initial);
    }, []); // Run only once on mount

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
                <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                        <select
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required={field.required}
                        >
                            <option value="">Selecione uma opção</option>
                            {field.options?.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : field.type === 'textarea' ? (
                        <textarea
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required={field.required}
                            rows={4}
                        />
                    ) : (
                        <input
                            type={field.type}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                            className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required={field.required}
                        />
                    )}
                </div>
            ))}
            <div className="flex w-full items-end justify-end mt-6">
                {mode === 'edit' ? (
                    <>
                        <button
                            type="submit"
                            className="bg-green text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Salvar
                        </button>
                        {onDelete && (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="bg-red-600 text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-red-500 ml-4"
                            >
                                Excluir
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <button
                            type="submit"
                            className="bg-green text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Adicionar
                        </button>
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="bg-gray-500 text-white py-2 px-12 rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-500 ml-4"
                            >
                                Cancelar
                            </button>
                        )}
                    </>
                )}
            </div>
        </form>
    );
}