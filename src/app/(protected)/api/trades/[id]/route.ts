import { authOptions } from '@/features/auth/libs/auth';
import { createTradeData } from '@/features/positions/utils/trade';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: {
    id: string;
  };
};

// PUT /api/trades/[id]
export async function PUT(request: NextRequest, context: unknown) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userEmail = session.user?.email;
    if (!userEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const data = await request.json();

    let categoryId;

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: data.categoryId,
          userId: user.id,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found or does not belong to user' },
          { status: 400 },
        );
      }

      categoryId = category.id;
    } else if (data.categoryName) {
      const category = await prisma.category.findFirst({
        where: {
          name: data.categoryName,
          userId: user.id,
        },
      });

      if (!category) {
        const defaultCategory = await prisma.category.findFirst({
          where: {
            name: user.defaultCategory,
            userId: user.id,
          },
        });

        if (!defaultCategory) {
          const soloCategory = await prisma.category.findFirst({
            where: {
              name: 'solo',
              userId: user.id,
            },
          });

          if (!soloCategory) {
            return NextResponse.json({ error: 'No valid category found' }, { status: 500 });
          }

          categoryId = soloCategory.id;
        } else {
          categoryId = defaultCategory.id;
        }
      } else {
        categoryId = category.id;
      }
    }

    const { categoryId: _, categoryName, ...tradeData } = data;

    const parsedTradeData = createTradeData(tradeData);
    const { category, ...cleanTradeData } = parsedTradeData;

    const existingTrade = await prisma.trade.findUnique({
      where: { id: (context as Context).params.id },
    });

    if (!existingTrade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    }

    if (existingTrade.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this trade' }, { status: 401 });
    }

    const updateData = {
      ...cleanTradeData,
      ...(categoryId ? { categoryId } : {}),
    };

    const trade = await prisma.trade.update({
      where: { id: (context as Context).params.id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const { categoryId: updatedCategoryId, ...tradeWithoutCategoryId } = trade;

    return NextResponse.json({ trade: tradeWithoutCategoryId });
  } catch (error) {
    console.error('Error updating trade:', error);
    return NextResponse.json({ error: 'Failed to update trade' }, { status: 500 });
  }
}

// DELETE /api/trades/[id]
export async function DELETE(_: NextRequest, context: unknown) {
  try {
    const { id } = (context as Context).params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userEmail = session.user?.email;
    if (!userEmail) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const trade = await prisma.trade.findUnique({ where: { id } });
    if (!trade) return NextResponse.json({ error: 'Trade not found' }, { status: 404 });

    if (trade.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.trade.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trade:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: 'Failed to delete trade' }, { status: 500 });
  }
}
