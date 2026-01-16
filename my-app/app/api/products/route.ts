import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      select: {
        id: true,
        nome: true,
        codigo_produto: true,
        categoria: true,
        preco: true,
        unidade: true,
      },
      orderBy: {
        id: 'desc'
      }
    });
    
    return NextResponse.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const produto = await prisma.produto.create({ data });
    return NextResponse.json(produto, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    const status = error.code === 'P2002' ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}