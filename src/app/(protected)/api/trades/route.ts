import { authOptions } from '@/features/auth/libs/auth';
import { TRADE_CATEGORIES, TRADE_RESULTS } from '@/features/positions/types/position';
import {
  calculateInvestment,
  calculatePnl,
  calculateRiskPercent,
} from '@/features/positions/utils/calculations';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const trades = await prisma.trade.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ trades });
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();

    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        date: new Date(data.date),
        symbol: data.symbol,
        side: data.side,
        entryPrice: data.entryPrice,
        positionSize: data.positionSize,
        stopLoss: data.stopLoss || 0,
        exitPrice: data.exitPrice || 0,
        commission: data.commission || 0,
        leverage: data.leverage || 0,
        category: data.category || TRADE_CATEGORIES.SOLO,
        deposit: data.deposit || 0,
        investment: calculateInvestment({
          entryPrice: data.entryPrice,
          positionSize: data.positionSize,
          leverage: data.leverage,
        }),
        pnl: calculatePnl({
          side: data.side,
          entryPrice: data.entryPrice,
          exitPrice: data.exitPrice || 0,
          positionSize: data.positionSize,
          commission: data.commission || 0,
          leverage: data.leverage,
        }),
        riskPercent: calculateRiskPercent({
          side: data.side,
          entryPrice: data.entryPrice,
          stopLoss: data.stopLoss || 0,
          positionSize: data.positionSize,
          deposit: data.deposit || 0,
          leverage: data.leverage,
        }),
        result: data.exitPrice
          ? data.pnl && data.pnl > 0
            ? TRADE_RESULTS.WIN
            : TRADE_RESULTS.LOSS
          : TRADE_RESULTS.PENDING,
      },
    });

    return NextResponse.json({ trade });
  } catch (error) {
    console.error('Error creating trade:', error);
    return NextResponse.json({ error: 'Failed to create trade' }, { status: 500 });
  }
}
