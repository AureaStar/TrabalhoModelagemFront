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