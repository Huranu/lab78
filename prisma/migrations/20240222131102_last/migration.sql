/*
  Warnings:

  - The primary key for the `project_dep` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `task_dep` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tdepartmentid` on the `task_dep` table. All the data in the column will be lost.
  - The primary key for the `task_tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `due_date` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `task_dep` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "stage" AS ENUM ('PROPOSED', 'INPROGRESS', 'REVIEW', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "task_dep" DROP CONSTRAINT "task_dep_tdepartmentid_fkey";

-- AlterTable
ALTER TABLE "milestone" ALTER COLUMN "end_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "due_date" DATE NOT NULL,
ADD COLUMN     "end_date" DATE;

-- AlterTable
ALTER TABLE "project_dep" DROP CONSTRAINT "project_dep_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "project_dep_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sprint" ALTER COLUMN "end_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tag" ALTER COLUMN "color" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "stage" "stage" NOT NULL DEFAULT 'PROPOSED',
ALTER COLUMN "end_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_dep" DROP CONSTRAINT "task_dep_pkey",
DROP COLUMN "tdepartmentid",
ADD COLUMN     "department_id" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "task_dep_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "task_tag" DROP CONSTRAINT "task_tag_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "task_tag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_task" DROP CONSTRAINT "user_task_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_task_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "task_dep" ADD CONSTRAINT "task_dep_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
