import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { 
      title, description, schedule, startDate, endDate, showTimes, 
      location, locationType, image, ticketTypes 
    } = body;

    if (!title || !startDate || !ticketTypes || ticketTypes.length === 0) {
      return NextResponse.json({ message: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    // Criar Evento e suas Sub-estruturas em uma Transação
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        schedule,
        date: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        showTimes: showTimes !== undefined ? showTimes : true,
        location,
        locationType,
        image,
        organizerId: userId,
        ticketTypes: {
          create: ticketTypes.map((t: any) => ({
            name: t.name,
            price: parseFloat(t.price) || 0,
            description: t.description || '',
            capacity: parseInt(t.capacity) || null,
            groupSize: parseInt(t.groupSize) || 1,
            isGroup: (parseInt(t.groupSize) || 1) > 1,
            customFields: t.customFields || [],
          }))
        },
        // Complementos (Addons) mapeados do JSON do evento
        addons: {
          create: ticketTypes.flatMap((t: any) => 
            (t.addons || []).map((a: any) => ({
              name: a.name,
              price: parseFloat(a.price) || 0,
              category: 'OTHER'
            }))
          )
        }
      },
      include: {
        ticketTypes: true,
        addons: true
      }
    });

    return NextResponse.json({ 
      message: 'Evento criado com sucesso!', 
      eventId: newEvent.id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('ERRO AO CRIAR EVENTO:', error);
    return NextResponse.json({ 
      message: 'Erro ao salvar evento no banco de dados',
      error: error.message,
      detail: error.code // Código do erro do Prisma para debug
    }, { status: 500 });
  }
}
