-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "endereco" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ativo';
