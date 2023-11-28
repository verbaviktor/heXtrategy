/*
  Warnings:

  - You are about to drop the `Hex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Map` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('BUILDCAMP', 'BUILDTOWER', 'BUILDCASTLE', 'TRAINARMY', 'MOVEARMY');

-- DropForeignKey
ALTER TABLE "Hex" DROP CONSTRAINT "Hex_mapId_fkey";

-- DropForeignKey
ALTER TABLE "Hex" DROP CONSTRAINT "Hex_userGoogleId_fkey";

-- DropForeignKey
ALTER TABLE "Map" DROP CONSTRAINT "Map_lobbyId_fkey";

-- DropTable
DROP TABLE "Hex";

-- DropTable
DROP TABLE "Map";

-- DropEnum
DROP TYPE "Action";

-- CreateTable
CREATE TABLE "Action" (
    "number" SERIAL NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "destinationX" INTEGER NOT NULL,
    "destinationY" INTEGER NOT NULL,
    "actionType" "ActionType" NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("number")
);
