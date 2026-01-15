import { prisma } from './lib/prisma'

async function main() {
  // Criar um estoque
  const estoque = await prisma.estoque.create({
    data: {
      quantidade: 0,
    },
  })
  console.log('Estoque criado:', estoque)

  // Criar um fornecedor
  const fornecedor = await prisma.fornecedor.create({
    data: {
      nome: 'Fornecedor ABC',
      telefone: '11987654321',
    },
  })
  console.log('Fornecedor criado:', fornecedor)

  // Criar uma aquisição com produto
  const aquisicao = await prisma.aquisicao.create({
    data: {
      id_fornecedor: fornecedor.id,
      quantidade: 10,
      preco: 100.50,
      produtos: {
        create: {
          nome: 'Produto Teste',
          codigo_produto: 'PROD001',
          categoria: 'Eletrônicos',
          preco: 150.00,
          id_estoque: estoque.id,
        },
      },
    },
    include: {
      fornecedor: true,
      produtos: true,
    },
  })
  console.log('Aquisição criada:', aquisicao)

  // Criar um cliente com pedido
  const cliente = await prisma.cliente.create({
    data: {
      instituicao: 'Empresa XYZ',
      cnpj: '12345678000190',
      telefone: '11999999999',
      responsavel: 'João Silva',
      pedidos: {
        create: {
          codigo_pedido: 'PED001',
        },
      },
    },
    include: {
      pedidos: true,
    },
  })
  console.log('Cliente criado:', cliente)

  // Buscar todos os clientes
  const allClientes = await prisma.cliente.findMany({
    include: {
      pedidos: true,
    },
  })
  console.log('Todos os clientes:', JSON.stringify(allClientes, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })