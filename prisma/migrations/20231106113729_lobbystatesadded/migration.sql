-- CreateEnum
CREATE TYPE "LobbyState" AS ENUM ('PREPARATION', 'IN_PROGRESS', 'FINISHED');

-- AlterTable
ALTER TABLE "Lobby" ADD COLUMN     "currentPlayer" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lobbyState" "LobbyState" NOT NULL DEFAULT 'PREPARATION';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "indexInLobby" INTEGER,
ADD COLUMN     "readyState" BOOLEAN DEFAULT false;
