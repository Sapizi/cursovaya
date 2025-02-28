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
      include: {
        classParticipants: true,
        trainer: true, // Загружаем тренера
      },
    });

    const formattedClasses = classes.map((cls) => ({
      id: cls.id,
      startTime: cls.startTime,
      trainer: cls.trainer ? cls.trainer.name : "Без тренера",
      participants: cls.classParticipants.length,
    }));

    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error("Ошибка получения занятий:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { startTime, trainerId, participants } = body;

    if (!startTime || !trainerId) {
      return NextResponse.json({ message: "Все поля обязательны" }, { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        startTime: new Date(startTime),
        trainerId,
        classParticipants: {
          create: participants.map((clientId: string) => ({ clientId })),
        },
      },
      include: {
        classParticipants: true,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Ошибка на сервере:", error);
    return NextResponse.json({ message: "Ошибка на сервере" }, { status: 500 });
  }
}
