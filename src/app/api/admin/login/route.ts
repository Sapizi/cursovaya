import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { login, password } = body;

    // Проверяем, что все необходимые поля присутствуют
    if (!login || !password) {
      return NextResponse.json(
        { error: 'Login and password are required' },
        { status: 400 }
      );
    }

    // Ищем админа в базе данных
    const admin = await prisma.admin.findUnique({
      where: {
        login: login
      }
    });

    // Проверяем существование админа и правильность пароля
    if (!admin || admin.password !== password) {
      return NextResponse.json(
        { error: 'Invalid login or password' },
        { status: 401 }
      );
    }

    // Успешный вход
    return NextResponse.json({
      success: true,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
