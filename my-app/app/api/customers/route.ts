import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        instituicao: true,
        cnpj: true,
        telefone: true,
        responsavel: true,
      },
      orderBy: {
        id: 'desc'
      }
    });
    
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const cliente = await prisma.cliente.create({ data });
    return NextResponse.json(cliente, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    const status = error.code === 'P2002' ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}