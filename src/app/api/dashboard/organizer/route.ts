import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ORGANIZER') {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // 1. Buscar Eventos do Organizador
    const events = await prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        orders: {
          where: { status: 'PAID' }
        },
        ticketTypes: {
          include: {
            _count: {
              select: { tickets: { where: { status: 'PAID' } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Calcular Estatísticas
    let totalSales = 0;
    let totalTickets = 0;
    
    events.forEach(event => {
      event.orders.forEach(order => {
        totalSales += Number(order.total);
      });
      event.ticketTypes.forEach(tt => {
        totalTickets += tt._count.tickets;
      });
    });

    return NextResponse.json({
      stats: {
        totalSales: totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        ticketsSold: totalTickets,
        eventsCreated: events.length,
        usersRegistered: totalTickets // Simplificação: 1 ticket = 1 inscrito
      },
      events: events.map(e => ({
        id: e.id,
        title: e.title,
        date: e.date,
        location: e.location,
        image: e.image,
      }))
    });

  } catch (error: any) {
    console.error('ERRO DASHBOARD:', error);
    return NextResponse.json({ message: 'Erro ao carregar dados' }, { status: 500 });
  }
}
