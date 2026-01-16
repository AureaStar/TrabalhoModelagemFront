import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const aquisicao = await prisma.aquisicao.findUnique({
      where: { id: parseInt(id) },
    });

    if (!aquisicao) {
      return NextResponse.json(
        { error: 'Aquisição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(aquisicao);
  } catch (error) {
    console.error('Erro ao buscar aquisição:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar aquisição' },
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
    const aquisicao = await prisma.aquisicao.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(aquisicao);
  } catch (error: any) {
    console.error('Erro ao atualizar aquisição:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Aquisição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar aquisição' },
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
    await prisma.aquisicao.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: 'Aquisição excluída com sucesso' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erro ao deletar aquisição:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Aquisição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao deletar aquisição' },
      { status: 500 }
    );
  }
}
