/*
  Warnings:

  - You are about to drop the `AgentMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('USER', 'AGENT');

-- DropForeignKey
ALTER TABLE "AgentMessage" DROP CONSTRAINT "AgentMessage_chatSessionId_fkey";

-- DropForeignKey
ALTER TABLE "UserMessage" DROP CONSTRAINT "UserMessage_chatSessionId_fkey";

-- DropTable
DROP TABLE "AgentMessage";

-- DropTable
DROP TABLE "UserMessage";

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "chatSessionId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_id_chatSessionId_idx" ON "Message"("id", "chatSessionId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "ChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
