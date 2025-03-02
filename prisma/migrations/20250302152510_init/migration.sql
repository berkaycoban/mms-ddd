/*
  Warnings:

  - You are about to drop the column `timeSlot` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,roomNumber]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sessions_date_timeSlot_roomNumber_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "timeSlot",
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_date_roomNumber_key" ON "sessions"("date", "roomNumber");
