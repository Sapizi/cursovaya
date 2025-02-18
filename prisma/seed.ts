import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Простой пароль без хеширования
  const password = "1234";

  await prisma.admin.create({
    data: {
      login: "admin",
      password: password, // Храним пароль в открытом виде
    },
  });

  console.log("Админ создан!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
