/*
  Warnings:

  - You are about to drop the column `url` on the `Feed` table. All the data in the column will be lost.
  - Added the required column `skill` to the `Feed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feed" DROP COLUMN "url",
ADD COLUMN     "skill" TEXT NOT NULL;
