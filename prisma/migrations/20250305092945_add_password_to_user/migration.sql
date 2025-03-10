-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");
