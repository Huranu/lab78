/*
  Warnings:

  - You are about to drop the column `workspace_id` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `stage_id` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `task` table. All the data in the column will be lost.
  - You are about to alter the column `fname` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `lname` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_workspace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `due_date` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "section" DROP CONSTRAINT "section_project_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_project_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_stage_id_fkey";

-- DropForeignKey
ALTER TABLE "user_task" DROP CONSTRAINT "user_task_task_id_fkey";

-- DropForeignKey
ALTER TABLE "user_workspace" DROP CONSTRAINT "user_workspace_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_workspace" DROP CONSTRAINT "user_workspace_workspace_id_fkey";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "workspace_id";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "stage_id",
DROP COLUMN "start_date",
ADD COLUMN     "due_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "project_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "fname" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "lname" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "section";

-- DropTable
DROP TABLE "stage";

-- DropTable
DROP TABLE "user_workspace";

-- DropTable
DROP TABLE "workspace";

-- CreateTable
CREATE TABLE "milestone" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sprint" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "milestone_id" INTEGER,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "sprint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "milestone_title_key" ON "milestone"("title");

-- CreateIndex
CREATE UNIQUE INDEX "sprint_title_key" ON "sprint"("title");

-- AddForeignKey
ALTER TABLE "user_task" ADD CONSTRAINT "user_task_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "milestone" ADD CONSTRAINT "milestone_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprint" ADD CONSTRAINT "sprint_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sprint" ADD CONSTRAINT "sprint_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
