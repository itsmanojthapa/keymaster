import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import prisma from "@/server/prismaClient";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  // debug: true,
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  session: {
    strategy: "jwt",
    maxAge: 2592000, // 30 days,
    updateAge: 86400, // 24 hours
  },
  callbacks: {
    // async signIn({ user, account }) {
    //   if (account?.provider === "google") {
    //     // Find user by email
    //     const existingUser = await prisma.user.findUnique({
    //       where: { email: user.email as string },
    //     });

    //     if (existingUser) {
    //       // Ensure the OAuth account is linked
    //       await prisma.account.upsert({
    //         where: {
    //           provider_providerAccountId: {
    //             provider: "google",
    //             providerAccountId: account.providerAccountId,
    //           },
    //         },
    //         update: {}, // If exists, do nothing
    //         create: {
    //           userId: existingUser.id,
    //           provider: "google",
    //           providerAccountId: account.providerAccountId,
    //           type: account.type,
    //           access_token: account.access_token,
    //           refresh_token: account.refresh_token,
    //           expires_at: account.expires_at,
    //           token_type: account.token_type,
    //           id_token: account.id_token,
    //           updatedAt: new Date(),
    //         },
    //       });
    //     }
    //   }

    //   return true;
    // },

    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      const provider = account.provider;
      const providerAccountId = account.providerAccountId;

      // 1️⃣ Try to find an existing user by email
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // 2️⃣ If user doesn't exist, create user & link account
      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            name: user.name ?? "",
            email: user.email,
            image: user.image,
            Account: {
              create: {
                provider: provider,
                providerAccountId: providerAccountId,
                type: account.type,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                id_token: account.id_token,
                updatedAt: new Date(), // required by your model
              },
            },
          },
        });
      } else {
        // 3️⃣ If user exists, make sure account is linked (upsert)
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: provider,
              providerAccountId: providerAccountId,
            },
          },
          update: {
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            id_token: account.id_token,
            updatedAt: new Date(),
          },
          create: {
            userId: existingUser.id,
            provider: provider,
            providerAccountId: providerAccountId,
            type: account.type,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            id_token: account.id_token,
            updatedAt: new Date(),
          },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name;
      session.user.email = token.email!;
      session.user.image = token.picture;
      return session;
    },
  },
});
