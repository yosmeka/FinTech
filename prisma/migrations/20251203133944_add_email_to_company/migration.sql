/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `FintechCompany` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `FintechCompany` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FintechCompany" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FintechCompany_email_key" ON "FintechCompany"("email");

-- RenameIndex
ALTER INDEX "User_email_idx" RENAME TO "User_username_idx";

-- RenameIndex
ALTER INDEX "User_email_key" RENAME TO "User_username_key";
