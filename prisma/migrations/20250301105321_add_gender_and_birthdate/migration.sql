/*
  Warnings:

  - The primary key for the `Class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `startTime` on the `Class` table. All the data in the column will be lost.
  - The `id` column on the `Class` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ClassParticipants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Client` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Trainer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `classId` on the `ClassParticipants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `clientId` on the `ClassParticipants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `birthDate` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClassParticipants" DROP CONSTRAINT "ClassParticipants_classId_fkey";

-- DropForeignKey
ALTER TABLE "ClassParticipants" DROP CONSTRAINT "ClassParticipants_clientId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP CONSTRAINT "Class_pkey",
DROP COLUMN "startTime",
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Class_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ClassParticipants" DROP CONSTRAINT "ClassParticipants_pkey",
DROP COLUMN "classId",
ADD COLUMN     "classId" INTEGER NOT NULL,
DROP COLUMN "clientId",
ADD COLUMN     "clientId" INTEGER NOT NULL,
ADD CONSTRAINT "ClassParticipants_pkey" PRIMARY KEY ("classId", "clientId");

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "goal" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "trainerId" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "trainerId" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_email_key" ON "Trainer"("email");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassParticipants" ADD CONSTRAINT "ClassParticipants_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassParticipants" ADD CONSTRAINT "ClassParticipants_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
