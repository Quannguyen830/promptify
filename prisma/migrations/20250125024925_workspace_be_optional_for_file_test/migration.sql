-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_workspaceId_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "workspaceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
