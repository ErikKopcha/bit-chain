import { authOptions } from '@/features/auth/libs/auth';
import { Trade, TRADE_CATEGORIES, TRADE_RESULTS } from '@/features/positions/types/position';
import {
  calculateInvestment,
  calculatePnl,
  calculateRiskPercent,
} from '@/features/positions/utils/calculations';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const calculatedPnl = calculatePnl({
      side: data.side,
      entryPrice: data.entryPrice,
      exitPrice: data.exitPrice,
      positionSize: data.positionSize,
      commission: data.commission,
      leverage: data.leverage,
    });

    const tradeData: Trade = {
      id: data.id || '',
      date: new Date(data.date),
      symbol: data.symbol,
      side: data.side,
      entryPrice: data.entryPrice,
      positionSize: data.positionSize,
      stopLoss: data.stopLoss || 0,
      deposit: data.deposit || 0,
      exitPrice: data.exitPrice || 0,
      commission: data.commission || 0,
      leverage: data.leverage || 0,
      category: data.category || TRADE_CATEGORIES.SOLO,
      investment: calculateInvestment({
        entryPrice: data.entryPrice,
        positionSize: data.positionSize,
        leverage: data.leverage,
      }),
      pnl: calculatedPnl,
      riskPercent: calculateRiskPercent({
        side: data.side,
        entryPrice: data.entryPrice,
        stopLoss: data.stopLoss || 0,
        positionSize: data.positionSize,
        deposit: data.deposit || 0,
        leverage: data.leverage,
      }),
      result: data.exitPrice
        ? calculatedPnl > 0
          ? TRADE_RESULTS.WIN
          : TRADE_RESULTS.LOSS
        : TRADE_RESULTS.PENDING,
    };

    const trade = await prisma.trade.update({
      where: { id: params.id },
      data: { userId: user.id, ...tradeData },
    });

    return NextResponse.json({ trade });
  } catch (error) {
    console.error('Error updating trade:', error);
    return NextResponse.json({ error: 'Failed to update trade' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    await prisma.trade.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trade:', error);
    return NextResponse.json({ error: 'Failed to delete trade' }, { status: 500 });
  }
}
