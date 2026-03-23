import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Sessão expirada. Refaça o login.' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { 
      title, description, schedule, startDate, endDate, showTimes, 
      location, locationType, image, ticketTypes 
    } = body;

    // Validações Básicas
    if (!title) return NextResponse.json({ message: 'Título é obrigatório' }, { status: 400 });
    if (!startDate) return NextResponse.json({ message: 'Data de início é obrigatória' }, { status: 400 });
    if (!ticketTypes || ticketTypes.length === 0) return NextResponse.json({ message: 'Crie ao menos um ingresso' }, { status: 400 });

    const startDateObj = new Date(startDate);
    if (isNaN(startDateObj.getTime())) {
      return NextResponse.json({ message: 'Formato de data inválido' }, { status: 400 });
    }

    // Criar Evento e suas Sub-estruturas em uma Transação
    const newEvent = await prisma.event.create({
      data: {
        title,
        description: description || '',
        schedule: schedule || '',
        date: startDateObj,
        endDate: endDate ? new Date(endDate) : null,
        showTimes: showTimes !== undefined ? showTimes : true,
        location: location || 'Presencial',
        locationType: locationType || 'PHYSICAL',
        image: image || null,
        organizerId: userId,
        ticketTypes: {
          create: ticketTypes.map((t: any) => ({
            name: t.name,
            price: Number(t.price) || 0,
            description: t.description || '',
            capacity: t.capacity ? parseInt(t.capacity) : null,
            groupSize: parseInt(t.groupSize) || 1,
            isGroup: (parseInt(t.groupSize) || 1) > 1,
            customFields: t.customFields || [],
          }))
        },
        addons: {
          create: ticketTypes.flatMap((t: any) => 
            (t.addons || []).map((a: any) => ({
              name: a.name,
              price: Number(a.price) || 0,
              category: 'OTHER'
            }))
          )
        }
      }
    });

    return NextResponse.json({ 
      message: 'Evento criado com sucesso!', 
      eventId: newEvent.id 
    }, { status: 201 });

  } catch (error: any) {
    console.error('DETALHE DO ERRO NO SERVIDOR:', error);
    
    // Captura erros específicos do Prisma
    let friendlyMessage = 'Erro interno ao salvar no banco';
    if (error.code === 'P2002') friendlyMessage = 'Já existe um registro com estes dados.';
    if (error.code === 'P2003') friendlyMessage = 'Erro de vínculo (Chave estrangeira).';
    
    return NextResponse.json({ 
      message: friendlyMessage,
      error: error.message || String(error),
      code: error.code || 'UNKNOWN'
    }, { status: 500 });
  }
}
