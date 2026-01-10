-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_id_aquisicao_fkey";

-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_id_estoque_fkey";

-- AlterTable
ALTER TABLE "Produto" ALTER COLUMN "id_aquisicao" DROP NOT NULL,
ALTER COLUMN "id_estoque" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_id_aquisicao_fkey" FOREIGN KEY ("id_aquisicao") REFERENCES "Aquisicao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_id_estoque_fkey" FOREIGN KEY ("id_estoque") REFERENCES "Estoque"("id") ON DELETE SET NULL ON UPDATE CASCADE;
