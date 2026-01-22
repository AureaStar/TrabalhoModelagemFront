import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const aquisicoes = await prisma.aquisicao.findMany({
      include: {
        Produto: {
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
          quantidade: parseFloat(data.quantidade),
          preco: parseFloat(data.preco), // Preço UNITÁRIO
          desconto: parseFloat(data.desconto || 0),
          entrada: new Date(data.entrada || new Date()),
          observacoes: data.observacoes || '',
        },
      });

      console.log("✅ Aquisição criada:", novaAquisicao.id);

      // 4. Criar ou atualizar o Estoque e conectar o Produto
      // Verifica se o produto já tem estoque associado
      let estoqueAtualizado;
      if (produtoExiste.id_estoque) {
        // Produto já tem estoque - atualiza a quantidade
        estoqueAtualizado = await tx.estoque.update({
          where: { id: produtoExiste.id_estoque },
          data: {
            quantidade: { increment: parseFloat(data.quantidade) }
          }
        });
      } else {
        // Produto não tem estoque - cria um novo com os dados do produto
        estoqueAtualizado = await tx.estoque.create({
          data: {
            nome: produtoExiste.nome,
            categoria: produtoExiste.categoria,
            preco: produtoExiste.preco,
            quantidade: parseFloat(data.quantidade)
          }
        });
      }

      console.log("✅ Estoque atualizado:", estoqueAtualizado.id);

      // 5. Atualizar o Produto para conectá-lo à Aquisição e ao Estoque
      await tx.produto.update({
        where: { id: Number(data.id_produto) },
        data: {
          id_aquisicao: novaAquisicao.id,
          id_estoque: estoqueAtualizado.id
        }
      });

      console.log("✅ Produto atualizado com aquisição e estoque");

      return {
        aquisicao: novaAquisicao,
        estoque: estoqueAtualizado
      };
    });

    console.log("🎉 Transação concluída com sucesso!");
    return NextResponse.json(transaction, { status: 201 });
    
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string; meta?: unknown; stack?: string };
    console.error('❌ ERRO DETALHADO:', {
      message: err.message,
      code: err.code,
      meta: err.meta,
      stack: err.stack
    });
    
    // Mensagens de erro mais específicas
    let errorMessage = 'Erro ao processar aquisição';
    let statusCode = 500;
    
    if (err.message?.includes('Fornecedor') || err.message?.includes('Produto')) {
      errorMessage = err.message;
      statusCode = 404;
    } else if (err.code === 'P2002') {
      errorMessage = 'Já existe um registro com esses dados';
      statusCode = 400;
    } else if (err.code === 'P2003') {
      errorMessage = 'Referência inválida (fornecedor ou produto não existe)';
      statusCode = 400;
    } else if (err.code === 'P2025') {
      errorMessage = 'Registro não encontrado para atualização';
      statusCode = 404;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: err.message,
        code: err.code 
      }, 
      { status: statusCode }
    );
  }
}