/*
  Warnings:

  - You are about to alter the column `name` on the `department` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `milestone` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `sprint` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `title` on the `tag` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[title]` on the table `tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `milestone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `sprint` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "milestone_title_key";

-- DropIndex
DROP INDEX "project_title_key";

-- DropIndex
DROP INDEX "sprint_title_key";

-- AlterTable
ALTER TABLE "department" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "milestone" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "project" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "sprint" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "tag" ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "project_dep" (
    "project_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "project_dep_pkey" PRIMARY KEY ("project_id","department_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_title_key" ON "tag"("title");

-- AddForeignKey
ALTER TABLE "project_dep" ADD CONSTRAINT "project_dep_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_dep" ADD CONSTRAINT "project_dep_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
