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
        preco: true
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
  try {
    const data = await request.json();
    
    const pedido = await prisma.pedido.create({
      data: {
        id_cliente: Number(data.id_cliente),
        codigo_pedido: data.codigo_pedido || `PED-${Date.now()}`,
        status: data.status || 'Pendente',
        preco: parseFloat(data.preco || 0)
      }
    });

    return NextResponse.json(pedido, { status: 201 });
  } catch (error: unknown) {
    console.error('Erro ao criar pedido:', error);
    const err = error as { code?: string; message?: string };
    const status = err.code === 'P2002' ? 409 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}