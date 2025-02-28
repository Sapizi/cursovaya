import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; 

export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany(); // Получаем всех тренеров из БД
    return NextResponse.json(trainers);
  } catch (error) {
    console.error("Ошибка загрузки тренеров:", error);
    return NextResponse.json({ error: "Ошибка загрузки тренеров" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, specialization } = await request.json();
    const newTrainer = await prisma.trainer.create({
      data: { name, specialization },
    });
    return NextResponse.json(newTrainer);
  } catch (error) {
    console.error("Ошибка создания тренера:", error);
    return NextResponse.json({ error: "Ошибка создания тренера" }, { status: 500 });
  }
}
