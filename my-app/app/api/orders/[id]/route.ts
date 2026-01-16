import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedido = await prisma.pedido.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pedido);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
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
    const pedido = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(pedido);
  } catch (error: any) {
    console.error('Erro ao atualizar pedido:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
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
    await prisma.pedido.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Pedido excluído com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erro ao deletar pedido:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao deletar pedido' },
      { status: 500 }
    );
  }
}
