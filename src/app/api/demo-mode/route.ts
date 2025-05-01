import { authOptions } from '@/features/auth/libs/auth';
import { TRADE_CATEGORIES, TRADE_SIDES } from '@/features/positions/types/position';
import { createTradeData } from '@/features/positions/utils/trade';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const DEMO_TRADES_COUNT = 100;

async function generateDemoTrades(userId: string) {
  try {
    const categories = Object.values(TRADE_CATEGORIES);
    const symbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'];
    const sides = Object.values(TRADE_SIDES);

    const trades = Array.from({ length: DEMO_TRADES_COUNT }, (_, index) => {
      try {
        const isWin = Math.random() > 0.5;
        const entryPrice = Math.random() * 1000 + 100;
        const exitPrice = isWin
          ? entryPrice * (1 + Math.random() * 0.1)
          : entryPrice * (1 - Math.random() * 0.1);
        const positionSize = Math.random() * 10 + 1;
        const leverage = Math.floor(Math.random() * 5) + 1;

        const symbol = symbols[Math.floor(Math.random() * symbols.length)] as string;
        const side = sides[Math.floor(Math.random() * sides.length)] as string;
        const category = categories[Math.floor(Math.random() * categories.length)] as string;

        const tradeData = createTradeData({
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          stopLoss: entryPrice * (1 - Math.random() * 0.05),
          commission: Math.random() * 10,
          deposit: Math.random() * 1000 + 100,
          symbol,
          side,
          entryPrice,
          positionSize,
          exitPrice,
          leverage,
          category,
        });

        return {
          ...tradeData,
          userId,
          isDemo: true,
        };
      } catch (error) {
        console.error(`Error creating trade ${index}:`, error);
        throw error;
      }
    });

    const result = await prisma.trade.createMany({
      data: trades,
    });

    return result;
  } catch (error) {
    throw new Error(
      `Failed to generate demo trades: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function removeDemoTrades(userId: string) {
  try {
    const result = await prisma.trade.deleteMany({
      where: {
        userId,
        isDemo: true,
      },
    });
    return result;
  } catch (error) {
    throw new Error(
      `Failed to remove demo trades: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();
    if (!action || (action !== 'add' && action !== 'remove')) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'add') {
      await generateDemoTrades(user.id);
      return NextResponse.json({ message: 'Demo trades added successfully' });
    } else {
      await removeDemoTrades(user.id);
      return NextResponse.json({ message: 'Demo trades removed successfully' });
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
