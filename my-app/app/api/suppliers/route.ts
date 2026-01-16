import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const fornecedores = await prisma.fornecedor.findMany({
        select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            area_atuacao: true,
            status: true,
        },
        orderBy: {
        id: 'desc'
      }
    });
    
    return NextResponse.json(fornecedores);
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar fornecedores' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const fornecedor = await prisma.fornecedor.create({ data });
    return NextResponse.json(fornecedor, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar fornecedor:', error);
    const status = error.code === 'P2002' ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}