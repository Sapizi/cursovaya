-- Обновляем существующие записи в таблице Class
UPDATE "Class" SET 
    "name" = 'Default Class'
WHERE "name" IS NULL;

-- Добавляем новые колонки в Client
ALTER TABLE "Client" ADD COLUMN "gender" TEXT;
ALTER TABLE "Client" ADD COLUMN "birthDate" TIMESTAMP(3);

-- Обновляем существующие записи клиентов
UPDATE "Client" SET 
    "gender" = 'male',
    "birthDate" = '2000-01-01 00:00:00'::timestamp
WHERE "gender" IS NULL OR "birthDate" IS NULL;

-- Делаем колонки обязательными
ALTER TABLE "Client" ALTER COLUMN "gender" SET NOT NULL;
ALTER TABLE "Client" ALTER COLUMN "birthDate" SET NOT NULL; 