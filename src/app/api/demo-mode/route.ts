import { authOptions } from '@/features/auth/libs/auth';
import { TRADE_SIDES } from '@/features/positions/types/position';
import { createTradeData } from '@/features/positions/utils/trade';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const DEMO_TRADES_COUNT = 100;

async function generateDemoTrades(userId: string) {
  try {
    const symbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'];
    const sides = Object.values(TRADE_SIDES);

    // Get user's categories
    const categories = await prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true },
    });

    // If no categories, create a solo category
    if (categories.length === 0) {
      try {
        const soloCategory = await prisma.category.create({
          data: {
            name: 'solo',
            userId,
          },
        });
        categories.push(soloCategory);
      } catch (error) {
        throw new Error(
          `Failed to create default category: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    // Still make sure we have at least one category
    if (categories.length === 0) {
      throw new Error('No categories found for user and failed to create a default one');
    }

    // Generate the trade data
    const generatedTrades = [];

    for (let i = 0; i < DEMO_TRADES_COUNT; i++) {
      try {
        const isWin = Math.random() > 0.5;
        const entryPrice = Math.random() * 1000 + 100;
        const exitPrice = isWin
          ? entryPrice * (1 + Math.random() * 0.1)
          : entryPrice * (1 - Math.random() * 0.1);
        const positionSize = Math.random() * 10 + 1;
        const leverage = Math.floor(Math.random() * 5) + 1;

        const symbol = symbols[Math.floor(Math.random() * symbols.length)] || 'BTC';
        const side = sides[Math.floor(Math.random() * sides.length)] || TRADE_SIDES.LONG;

        // Safely get a category - use index 0 as fallback
        let selectedCategory = categories[0]; // Default to first category
        if (categories.length > 1) {
          const randomIndex = Math.floor(Math.random() * categories.length);
          selectedCategory = categories[randomIndex] || selectedCategory;
        }

        if (!selectedCategory || !selectedCategory.id) {
          console.error('Invalid category selected, skipping trade creation');
          continue;
        }

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
        });

        // Remove category from tradeData if present
        const { category: _, ...cleanTradeData } = tradeData;

        generatedTrades.push({
          ...cleanTradeData,
          userId,
          categoryId: selectedCategory.id,
          isDemo: true,
        });
      } catch (error) {
        console.error(`Error creating trade ${i}:`, error);
        // Continue with other trades instead of failing completely
      }
    }

    if (generatedTrades.length === 0) {
      throw new Error('Failed to generate any valid trades');
    }

    const result = await prisma.trade.createMany({
      data: generatedTrades,
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
