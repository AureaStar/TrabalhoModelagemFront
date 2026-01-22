import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      select: {
        id: true,
        codigo_pedido: true,
        cliente: {
          select: {
            id: true,
            instituicao: true
          }
        },
        status: true,
        data: true,
        preco_total: true, // Atualizado para o novo nome do campo
        // Adicionado para trazer os produtos do pedido
        itens: {
          select: {
            quantidade: true,
            preco_unit: true,
            produto: {
              select: {
                nome: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });
    
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const data = await request.json(); // Espera { id_cliente, itens: [{id_produto, quantidade, preco}] }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Cria o Pedido
    const pedido = await tx.pedido.create({
      data: {
        id_cliente: data.id_cliente,
        codigo_pedido: `PED-${Date.now()}`,
        itens: {
          create: data.itens.map((item: any) => ({
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            preco_unit: item.preco
          }))
        }
      }
    });

    // 2. Diminui o estoque para cada item
    for (const item of data.itens) {
      await tx.estoque.update({
        where: { id_produto: item.id_produto },
        data: { quantidade: { decrement: item.quantidade } }
      });
    }

    return pedido;
  });

  return NextResponse.json(result);
}