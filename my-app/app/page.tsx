'use client';

import SetHeader from "../components/header/SetHeader";
import Button from "@/components/button";
import Link from "next/link";

export default function Dashboard() {
  return (
    <>
      <SetHeader content={"Dashboard"} />
      <div className="flex px-44 w-full items-center justify-center bg-background-clean font-sans">
        <main className="w-full grid grid-cols-2 grid-rows-4 py-26 gap-x-24 gap-y-8">
          <Link href="/new-order" className="pl-8 w-full py-6 bg-green flex gap-4 flex-col items-center rounded-md hover:opacity-80 text-lg text-white no-underline row-span-2">
            <span className="text-7xl! material-symbols-outlined">
                add_shopping_cart
            </span>
            <span className="text-3xl font-semibold ml-2 text-white">Novo Pedido</span>
          </Link>
          <Button icon="storage" text="Gerenciar Estoque" href="/stock" />
          <Button icon="people_alt" text="Gerenciar Clientes" href="/customers" />
          <Button icon="local_shipping" text="Gerenciar Fornecedores" href="/suppliers" />
          <Button icon="inventory_2" text="Gerenciar Produtos" href="/products" />
          <Button icon="receipt_long" text="Ver Pedidos" href="/orders" />
          <Button icon="shopping_bag" text="Gerenciar Aquisições" href="/acquisitions" />
        </main>
      </div>
  </>
  );
}
