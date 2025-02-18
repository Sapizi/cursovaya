import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { login },
    });

    if (!admin) {
      return NextResponse.json({ message: "Неверный логин или пароль" }, { status: 401 });
    }

    // Сравниваем пароль напрямую, без хеширования
    if (password !== admin.password) {
      return NextResponse.json({ message: "Неверный логин или пароль" }, { status: 401 });
    }

    return NextResponse.json({ message: "Успешный вход" });
  } catch (error) {
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
