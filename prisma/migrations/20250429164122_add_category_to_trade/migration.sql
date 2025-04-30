/*
  Warnings:

  - Added the required column `category` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TradeCategory" AS ENUM ('solo', 'radar', 'everest', 'cryptonite_radar', 'cryptonite_everest', 'humster');

-- AlterEnum
ALTER TYPE "TradeResult" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "category" "TradeCategory" NOT NULL,
ADD COLUMN     "deposit" DOUBLE PRECISION NOT NULL DEFAULT 500;
