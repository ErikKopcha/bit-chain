import { authOptions } from '@/features/auth/libs/auth';
import { createTradeData } from '@/features/positions/utils/trade';
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
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedTrades = trades.map(({ categoryId, ...rest }) => rest);

    return NextResponse.json({ trades: formattedTrades });
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

    try {
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
      } else {
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
      }

      const { categoryId: cId, categoryName, ...tradeData } = data;

      const parsedTradeData = createTradeData(tradeData);
      const { category, ...cleanTradeData } = parsedTradeData;

      const trade = await prisma.trade.create({
        data: {
          userId: user.id,
          categoryId,
          ...cleanTradeData,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const { categoryId: createdCategoryId, ...tradeWithoutCategoryId } = trade;

      return NextResponse.json({ trade: tradeWithoutCategoryId });
    } catch (error) {
      console.error('Error in trade creation process:', error);
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Failed to create trade' }, { status: 500 });
  }
}
