/*
  Warnings:

  - Made the column `department_id` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_department_id_fkey";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "department_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "task_dep" (
    "task_id" INTEGER NOT NULL,
    "tdepartmentid" INTEGER NOT NULL,

    CONSTRAINT "task_dep_pkey" PRIMARY KEY ("task_id","tdepartmentid")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_dep" ADD CONSTRAINT "task_dep_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_dep" ADD CONSTRAINT "task_dep_tdepartmentid_fkey" FOREIGN KEY ("tdepartmentid") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
