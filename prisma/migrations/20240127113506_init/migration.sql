-- AlterTable
ALTER TABLE "task" ADD COLUMN     "milestone_id" INTEGER,
ADD COLUMN     "sprint_id" INTEGER,
ADD COLUMN     "weight" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
