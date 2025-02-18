import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const classes = await prisma.class.findMany({
      where: {
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        startTime: "asc",
      },
      take: 3,
    });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Ошибка загрузки занятий:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
