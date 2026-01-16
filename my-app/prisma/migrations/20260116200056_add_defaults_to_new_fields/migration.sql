-- AlterTable
ALTER TABLE "Aquisicao" ADD COLUMN     "desconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "observacoes" TEXT;

-- AlterTable
ALTER TABLE "Fornecedor" ADD COLUMN     "area_atuacao" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "cpf" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "endereco" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Cooperado',
ADD COLUMN     "tipo_associado" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "telefone" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "unidade" TEXT NOT NULL DEFAULT 'unidades';
