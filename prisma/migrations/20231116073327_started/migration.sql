-- CreateEnum
CREATE TYPE "HexType" AS ENUM ('HEX', 'VILLAGE', 'CAMP', 'TOWER', 'CASTLE', 'FOREST', 'MOUNTAIN');

-- CreateEnum
CREATE TYPE "Action" AS ENUM ('BUILDCAMP', 'BUILDTOWER', 'BUILDCASTLE', 'TRAINARMY', 'MOVEARMY');

-- CreateTable
CREATE TABLE "Map" (
    "lobbyId" TEXT NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("lobbyId")
);

-- CreateTable
CREATE TABLE "Hex" (
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "mapId" TEXT,
    "villageLevel" INTEGER,
    "hp" INTEGER,
    "hasArmy" BOOLEAN NOT NULL,
    "userGoogleId" TEXT,

    CONSTRAINT "Hex_pkey" PRIMARY KEY ("x","y")
);

-- AddForeignKey
ALTER TABLE "Map" ADD CONSTRAINT "Map_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hex" ADD CONSTRAINT "Hex_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("lobbyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hex" ADD CONSTRAINT "Hex_userGoogleId_fkey" FOREIGN KEY ("userGoogleId") REFERENCES "User"("googleId") ON DELETE SET NULL ON UPDATE CASCADE;
