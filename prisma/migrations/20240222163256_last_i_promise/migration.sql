-- DropForeignKey
ALTER TABLE "user_task" DROP CONSTRAINT "user_task_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_task" ADD CONSTRAINT "user_task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
