/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE profile_id_seq;
ALTER TABLE "profile" ALTER COLUMN "id" SET DEFAULT nextval('profile_id_seq');
ALTER SEQUENCE profile_id_seq OWNED BY "profile"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "user"."id";

-- CreateIndex
CREATE UNIQUE INDEX "profile_id_key" ON "profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");
