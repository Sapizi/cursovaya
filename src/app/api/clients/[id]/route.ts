import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { name, age, subscription } = body;

        const updatedClient = await prisma.client.update({
            where: { id },
            data: {
                name,
                age,
                subscription,
            },
        });

        return NextResponse.json(updatedClient);
    } catch (error) {
        return NextResponse.json(
            { error: 'Ошибка при обновлении клиента' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await prisma.client.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Клиент успешно удален' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Ошибка при удалении клиента' },
            { status: 500 }
        );
    }
} 