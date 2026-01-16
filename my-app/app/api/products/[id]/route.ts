import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
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
    const produto = await prisma.produto.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(produto);
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
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
    await prisma.produto.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Produto excluído com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erro ao deletar produto:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    );
  }
}
