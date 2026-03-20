import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { role } = body;

    if (!['BUYER', 'ORGANIZER'].includes(role)) {
       return NextResponse.json({ message: 'Role inválida' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ 
      message: `Perfil atualizado para ${role} com sucesso!`, 
      user: updatedUser 
    });
  } catch (error: any) {
    console.error('ERRO AO ATUALIZAR ROLE:', error);
    return NextResponse.json({ 
      message: 'Erro ao atualizar perfil',
      error: error.message 
    }, { status: 500 });
  }
}
