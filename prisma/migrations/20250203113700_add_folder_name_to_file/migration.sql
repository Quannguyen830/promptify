/*
  Warnings:

  - Added the required column `workspaceName` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "folderName" TEXT,
ADD COLUMN     "workspaceName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "File_id_idx" ON "File"("id");

-- CreateIndex
CREATE INDEX "File_folderId_idx" ON "File"("folderId");

-- CreateIndex
CREATE INDEX "File_workspaceId_idx" ON "File"("workspaceId");

-- CreateIndex
CREATE INDEX "Folder_id_idx" ON "Folder"("id");
