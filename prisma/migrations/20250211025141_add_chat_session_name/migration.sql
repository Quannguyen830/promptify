-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "ChatSession_id_idx" ON "ChatSession"("id");

-- CreateIndex
CREATE INDEX "ChatSession_userId_idx" ON "ChatSession"("userId");
