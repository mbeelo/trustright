import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './db';
import { users, userSubscriptions } from './db/schema';

export const authOptions: NextAuthOptions = {
  providers: [
    // Demo credentials provider for testing
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        if (credentials?.email) {
          // Check if user exists in database
          let existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, credentials.email),
          });

          // If user doesn't exist, create them
          if (!existingUser) {
            const newUsers = await db.insert(users).values({
              id: credentials.email,
              email: credentials.email,
              name: credentials.email.split('@')[0],
            }).returning();

            existingUser = newUsers[0];

            // Create default subscription
            await db.insert(userSubscriptions).values({
              userId: existingUser.id,
              plan: 'free',
              searchesUsed: 0,
              searchesLimit: 5,
              isActive: true,
            });
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
          };
        }
        return null;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};