/*
  Warnings:

  - Added the required column `workspaceName` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "hasSubfolders" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workspaceName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "hasSubfolders" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Folder_workspaceId_idx" ON "Folder"("workspaceId");

-- CreateIndex
CREATE INDEX "Workspace_id_idx" ON "Workspace"("id");

-- CreateIndex
CREATE INDEX "Workspace_userId_idx" ON "Workspace"("userId");
