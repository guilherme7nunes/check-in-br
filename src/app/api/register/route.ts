import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone, role, acceptedTerms } = body;

    if (!email || !password || !acceptedTerms) {
      return NextResponse.json(
        { message: 'Campos obrigatórios ausentes ou termos não aceitos.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Este email já está cadastrado.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajuste dos Enums e Campos para o Novo Modelo de Banco
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone: phone || null,
        role: (role === 'ORGANIZER' || role === 'ADMIN') ? role : 'USER',
      },
    });

    return NextResponse.json(
      { message: 'Usuário criado com sucesso!', userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('ERRO NO REGISTRO:', error);
    return NextResponse.json(
      { message: 'Erro ao criar usuário', error: error.message },
      { status: 500 }
    );
  }
}
