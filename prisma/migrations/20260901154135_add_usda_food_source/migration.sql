-- AlterEnum
ALTER TYPE "FoodSource" ADD VALUE 'usda';

-- AlterTable
ALTER TABLE "Food" ADD COLUMN "externalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Food_externalId_key" ON "Food"("externalId");
