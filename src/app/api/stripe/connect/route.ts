import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ORGANIZER') {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    let stripeAccountId = user?.stripeAccountId;

    // Se o organizador ainda não tem uma conta Stripe vinculada, criamos uma Express
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'BR',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
      });
      
      stripeAccountId = account.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeAccountId },
      });
    }

    // Geramos o link de onboarding do Stripe
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXTAUTH_URL}/dashboard`,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
