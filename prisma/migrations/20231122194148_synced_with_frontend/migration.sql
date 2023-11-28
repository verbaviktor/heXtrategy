/*
  Warnings:

  - You are about to drop the column `actionType` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `destinationX` on the `Action` table. All the data in the column will be lost.
  - You are about to drop the column `destinationY` on the `Action` table. All the data in the column will be lost.
  - Added the required column `destX` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destY` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Made the column `lobbyId` on table `Action` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_lobbyId_fkey";

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "actionType",
DROP COLUMN "destinationX",
DROP COLUMN "destinationY",
ADD COLUMN     "destX" INTEGER NOT NULL,
ADD COLUMN     "destY" INTEGER NOT NULL,
ADD COLUMN     "type" "ActionType" NOT NULL,
ALTER COLUMN "lobbyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
