import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { qrCode, activityType, mode } = await req.json();

    if (!qrCode || !activityType) {
      return NextResponse.json({ message: 'Dados ausentes' }, { status: 400 });
    }

    // 1. Localizar o Ticket pelo QR Code
    const ticket = await prisma.ticket.findUnique({
      where: { qrCode },
      include: {
        ticketType: true,
        addons: {
          include: { addon: true }
        },
        checkIns: true
      }
    });

    if (!ticket) {
      return NextResponse.json({ 
        status: 'INVALID', 
        message: 'Código não encontrado ou inválido.' 
      });
    }

    // 2. Verificar se a atividade é válida para este ticket
    let isValidActivity = false;
    let activityLabel = 'Entrada Geral';

    if (activityType === 'GENERAL_ENTRANCE') {
      isValidActivity = true;
    } else if (activityType.startsWith('ADDON:')) {
      const addonId = activityType.split(':')[1];
      const hasAddon = ticket.addons.some(a => a.addonId === addonId);
      if (hasAddon) {
        isValidActivity = true;
        const addonObj = ticket.addons.find(a => a.addonId === addonId);
        activityLabel = addonObj?.addon.name || 'Complemento';
      } else {
        return NextResponse.json({ 
          status: 'INVALID', 
          message: `Participante não possui direito a: ${activityType}` 
        });
      }
    }

    // 3. Verificar se já foi usado
    const alreadyUsed = ticket.checkIns.some(c => c.activityType === activityType);
    
    if (alreadyUsed) {
      return NextResponse.json({ 
        status: 'ALREADY_USED', 
        message: `Este item (${activityLabel}) já foi validado anteriormente.`,
        attendee: ticket.attendeeName
      });
    }

    // 4. Se o modo for apenas CHECK, retorna sucesso sem gravar
    if (mode === 'CHECK') {
      return NextResponse.json({ 
        status: 'VALID', 
        message: 'Tudo certo! Pronto para validar.',
        attendee: ticket.attendeeName,
        activity: activityLabel
      });
    }

    // 5. MODO CONFIRM: Gravar o log de uso
    await prisma.checkInLog.create({
      data: {
        ticketId: ticket.id,
        activityType
      }
    });

    return NextResponse.json({ 
      status: 'SUCCESS', 
      message: `${activityLabel} validado com sucesso!`,
      attendee: ticket.attendeeName
    });

  } catch (error: any) {
    console.error('ERRO NA VALIDAÇÃO:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}
