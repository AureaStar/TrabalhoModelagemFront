import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const aquisicoes = await prisma.aquisicao.findMany({
      select: {
        id: true,
        produtos : {
            select: {
                id: true,
                nome: true,
                preco: true,
                unidade: true
           }
        },
        fornecedor: {
            select: {
                id: true,
                nome: true
            }
        },
        entrada: true,
        quantidade: true,
        preco: true,
        desconto: true,
        observacoes: true
      },
      orderBy: {
        id: 'desc'
      }
    });
    
    return NextResponse.json(aquisicoes);
  } catch (error) {
    console.error('Erro ao buscar aquisicoes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar aquisicoes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const aquisicao = await prisma.aquisicao.create({ data });
    return NextResponse.json(aquisicao, { status: 201 });
  } catch (error: any) {
    console.error('Erro ao criar aquisicao:', error);
    const status = error.code === 'P2002' ? 409 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}