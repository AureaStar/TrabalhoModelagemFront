import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const aquisicoes = await prisma.aquisicao.findMany({
      include: {  // Mudar de select para include para mais facilidade
        produto: {
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
        }
      },
      orderBy: {
        entrada: 'desc'
      }
    });
    
    // Adicionar valor_total calculado
    const aquisicoesComTotal = aquisicoes.map(aquisicao => ({
      ...aquisicao,
      valor_total: (aquisicao.preco * aquisicao.quantidade) - aquisicao.desconto
    }));
    
    return NextResponse.json(aquisicoesComTotal);
  } catch (error) {
    console.error('Erro ao buscar aquisicoes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar aquisicoes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let transaction;
  try {
    const data = await request.json();
    console.log("📥 Dados recebidos no POST:", data);

    // Validação dos dados
    if (!data.id_fornecedor || !data.id_produto || !data.quantidade || data.preco === undefined) {
      return NextResponse.json(
        { 
          error: 'Dados incompletos', 
          details: 'Forneça: id_fornecedor, id_produto, quantidade e preco' 
        },
        { status: 400 }
      );
    }

    transaction = await prisma.$transaction(async (tx) => {
      console.log("🔄 Iniciando transação...");
      
      // 1. Verificar se fornecedor existe
      const fornecedorExiste = await tx.fornecedor.findUnique({
        where: { id: Number(data.id_fornecedor) }
      });
      
      if (!fornecedorExiste) {
        throw new Error(`Fornecedor com ID ${data.id_fornecedor} não encontrado`);
      }
      
      // 2. Verificar se produto existe
      const produtoExiste = await tx.produto.findUnique({
        where: { id: Number(data.id_produto) }
      });
      
      if (!produtoExiste) {
        throw new Error(`Produto com ID ${data.id_produto} não encontrado`);
      }

      // 3. Criar a Aquisição
      const novaAquisicao = await tx.aquisicao.create({
        data: {
          id_fornecedor: Number(data.id_fornecedor),
          id_produto: Number(data.id_produto),
          quantidade: parseFloat(data.quantidade),
          preco: parseFloat(data.preco), // Preço UNITÁRIO
          desconto: parseFloat(data.desconto || 0),
          entrada: new Date(data.entrada || new Date()),
          observacoes: data.observacoes || '',
        },
      });

      console.log("✅ Aquisição criada:", novaAquisicao.id);

      // 4. Upsert no Estoque
      const estoqueAtualizado = await tx.estoque.upsert({
        where: { id_produto: Number(data.id_produto) },
        update: {
          quantidade: { increment: parseFloat(data.quantidade) }
        },
        create: {
          id_produto: Number(data.id_produto),
          quantidade: parseFloat(data.quantidade)
        },
      });

      console.log("✅ Estoque atualizado:", estoqueAtualizado.id);

      return {
        aquisicao: novaAquisicao,
        estoque: estoqueAtualizado
      };
    });

    console.log("🎉 Transação concluída com sucesso!");
    return NextResponse.json(transaction, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ ERRO DETALHADO:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    });
    
    // Mensagens de erro mais específicas
    let errorMessage = 'Erro ao processar aquisição';
    let statusCode = 500;
    
    if (error.message.includes('Fornecedor') || error.message.includes('Produto')) {
      errorMessage = error.message;
      statusCode = 404;
    } else if (error.code === 'P2002') {
      errorMessage = 'Já existe um registro com esses dados';
      statusCode = 400;
    } else if (error.code === 'P2003') {
      errorMessage = 'Referência inválida (fornecedor ou produto não existe)';
      statusCode = 400;
    } else if (error.code === 'P2025') {
      errorMessage = 'Registro não encontrado para atualização';
      statusCode = 404;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message,
        code: error.code 
      }, 
      { status: statusCode }
    );
  }
}