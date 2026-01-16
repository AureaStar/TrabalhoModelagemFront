import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fornecedor = await prisma.fornecedor.findUnique({
      where: { id: parseInt(id) },
    });

    if (!fornecedor) {
      return NextResponse.json(
        { error: 'Fornecedor não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(fornecedor);
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar fornecedor' },
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
    const fornecedor = await prisma.fornecedor.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(fornecedor);
  } catch (error: any) {
    console.error('Erro ao atualizar fornecedor:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Fornecedor não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar fornecedor' },
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
    await prisma.fornecedor.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Fornecedor excluído com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erro ao deletar fornecedor:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Fornecedor não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao deletar fornecedor' },
      { status: 500 }
    );
  }
}
