/*
  Warnings:

  - A unique constraint covering the columns `[userId,jobUrl]` on the table `SeenJob` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Feed_userId_idx" ON "Feed"("userId");

-- CreateIndex
CREATE INDEX "SeenJob_userId_idx" ON "SeenJob"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SeenJob_userId_jobUrl_key" ON "SeenJob"("userId", "jobUrl");
