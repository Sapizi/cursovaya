/*
  Warnings:

  - You are about to drop the column `age` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `subscription` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "age",
DROP COLUMN "birthDate",
DROP COLUMN "createdAt",
DROP COLUMN "gender",
DROP COLUMN "subscription";
