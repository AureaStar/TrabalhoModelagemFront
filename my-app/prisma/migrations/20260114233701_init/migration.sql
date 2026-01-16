-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "instituicao" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "responsavel" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "codigo_pedido" TEXT NOT NULL,
    "id_cliente" INTEGER NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo_produto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "id_aquisicao" INTEGER NOT NULL,
    "id_estoque" INTEGER NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estoque" (
    "id" SERIAL NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aquisicao" (
    "id" SERIAL NOT NULL,
    "id_fornecedor" INTEGER NOT NULL,
    "entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Aquisicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_instituicao_key" ON "Cliente"("instituicao");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cnpj_key" ON "Cliente"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_codigo_pedido_key" ON "Pedido"("codigo_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_codigo_produto_key" ON "Produto"("codigo_produto");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_id_aquisicao_fkey" FOREIGN KEY ("id_aquisicao") REFERENCES "Aquisicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_id_estoque_fkey" FOREIGN KEY ("id_estoque") REFERENCES "Estoque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aquisicao" ADD CONSTRAINT "Aquisicao_id_fornecedor_fkey" FOREIGN KEY ("id_fornecedor") REFERENCES "Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
