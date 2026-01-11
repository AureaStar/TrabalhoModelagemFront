'use client';

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 pl-44 bg-background-white border-b border-gray-200 flex items-center">
        <Image src="/assets/logo2.png" alt="Logo da COOPAF" width={100} height={20} />
        <ul className="ml-16 flex space-x-6">
            <li><Link href="/" className="text-black hover:text-gray-700">Dashboard</Link></li>
            <li><Link href="/customers" className="text-black hover:text-gray-700">Clientes</Link></li>
            <li><Link href="/orders" className="text-black hover:text-gray-700">Pedidos</Link></li>
            <li><Link href="/products" className="text-black hover:text-gray-700">Produtos</Link></li>
            <li><Link href="/stock" className="text-black hover:text-gray-700">Estoque</Link></li>
            <li><Link href="/suppliers" className="text-black hover:text-gray-700">Fornecedores</Link></li>
            <li><Link href="/acquisitions" className="text-black hover:text-gray-700">Aquisições</Link></li>
        </ul>
    </nav>
  );
}
