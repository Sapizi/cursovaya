import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany();
    return NextResponse.json({ count: clients.length, clients }); // Возвращаем количество и список клиентов
  } catch (error) {
    console.error("Ошибка получения клиентов:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, age, subscription } = body;

    if (!name || !age || !subscription) {
      return NextResponse.json({ message: "Все поля обязательны" }, { status: 400 });
    }

    const newClient = await prisma.client.create({
      data: {
        name,
        age: Number(age),
        subscription,
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка на сервере" }, { status: 500 });
  }
}
