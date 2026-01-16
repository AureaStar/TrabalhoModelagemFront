import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const estoques = await prisma.estoque.findMany({
      select: {
        id: true,
        quantidade: true,
        produtos: {
            select: {
                id: true,
                nome: true,
                categoria: true,
                preco: true,
            }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });
    
    return NextResponse.json(estoques);
  } catch (error) {
    console.error('Erro ao buscar estoques:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estoques' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const estoque = await prisma.estoque.create({ data });
    return NextResponse.json(estoque, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar estoque:', error);
    const status = error.code === 'P2002' ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}