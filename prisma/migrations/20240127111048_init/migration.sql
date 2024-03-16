-- CreateEnum
CREATE TYPE "role" AS ENUM ('EMPLOYEE', 'ADMIN');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "role" NOT NULL DEFAULT 'EMPLOYEE';
