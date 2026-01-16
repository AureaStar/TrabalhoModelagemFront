import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const estoque = await prisma.estoque.findUnique({
      where: { id: parseInt(id) },
      include: { produtos: true },
    });

    if (!estoque) {
      return NextResponse.json(
        { error: 'Estoque não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(estoque);
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estoque' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const estoque = await prisma.estoque.update({
      where: { id: parseInt(id) },
      data: { quantidade: data.quantidade },
    });

    return NextResponse.json(estoque);
  } catch (error: any) {
    console.error('Erro ao atualizar estoque:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Estoque não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar estoque' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.estoque.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Estoque excluído com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erro ao deletar estoque:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Estoque não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao deletar estoque' },
      { status: 500 }
    );
  }
}
