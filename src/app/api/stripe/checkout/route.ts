import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { eventId, ticketTypeId, attendees, selectedAddons } = await req.json();

    // 1. Buscar dados do evento e organizador
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true }
    });

    if (!event || !event.organizer.stripeAccountId) {
      return NextResponse.json({ message: 'Evento não configurado para pagamentos' }, { status: 400 });
    }

    // 2. Buscar tipo de ingresso e calcular subtotal
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId }
    });

    if (!ticketType) return NextResponse.json({ message: 'Ingresso inválido' }, { status: 400 });

    let totalAmount = Number(ticketType.price);

    // 3. Somar Adicionais
    for (const addonId of selectedAddons) {
      const addon = await prisma.addon.findUnique({ where: { id: addonId } });
      if (addon) totalAmount += Number(addon.price);
    }

    // 4. Calcular Taxa da Plataforma (Split)
    const platformFeePercent = Number(process.env.STRIPE_PLATFORM_FEE_PERCENT) || 10;
    const applicationFeeAmount = Math.round(totalAmount * (platformFeePercent / 100) * 100); // Em centavos

    // 5. Criar Sessão do Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `${ticketType.name} - ${event.title}`,
              description: `Inscrição para ${attendees.length} participante(s). Inclui adicionais selecionados.`,
            },
            unit_amount: Math.round(totalAmount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/events/${eventId}?cancelled=true`,
      
      // CONFIGURAÇÃO DO SPLIT (Connect)
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: event.organizer.stripeAccountId, // Dinheiro vai para o organizador
        },
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error('STRICT_CHECKOUT_ERROR:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
