/*
  Warnings:

  - Added the required column `start_date` to the `milestone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `sprint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "milestone" ADD COLUMN     "start_date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "start_date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "sprint" ADD COLUMN     "start_date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "start_date" DATE NOT NULL;
