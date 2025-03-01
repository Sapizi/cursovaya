import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.client.count();
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    
    return new NextResponse(JSON.stringify({
      success: true,
      count,
      clients
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error in clients route:", error);
    return new NextResponse(JSON.stringify({
      success: false,
      error: 'Internal Server Error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
