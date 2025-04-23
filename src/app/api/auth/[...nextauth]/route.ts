import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user || !credentials?.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
