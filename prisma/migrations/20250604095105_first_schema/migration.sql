-- CreateEnum
CREATE TYPE "FintechStatus" AS ENUM ('NEW', 'ENGAGED', 'RETIRED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DONE', 'INPROGRESS', 'NEW');

-- CreateTable
CREATE TABLE "FintechCompany" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contactPersonPhoneNumber" TEXT NOT NULL,
    "contactAddress" TEXT NOT NULL,
    "status" "FintechStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FintechCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "weakness" TEXT NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fintechCompanyId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_fintechCompanyId_idx" ON "Product"("fintechCompanyId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_fintechCompanyId_fkey" FOREIGN KEY ("fintechCompanyId") REFERENCES "FintechCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
