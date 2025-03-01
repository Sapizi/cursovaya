import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();
async function main() {
  await prisma.admin.create({
    data: {
      id: 1,
      login: "admin",
      password: "1234"
    }
  });
  console.log("Админ создан!");
}
main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
