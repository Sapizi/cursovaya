import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        trainer: true,
        classParticipants: true
      }
    });
    
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
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
