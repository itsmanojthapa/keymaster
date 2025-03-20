import { AuthError, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import prisma from "@/server/prismaClient";
import { comparePassword } from "@/utils/password";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import emailHTML from "@/utils/emailHTML";

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "address@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "********",
        },
      },
      authorize: async (credentials) => {
        let user: {
          id: string;
          name: string;
          password?: string | null;
          email: string;
          image?: string | null;
          emailVerified?: Date | null;
        } | null = null;

        const { email, password } = await signInSchema.parseAsync(credentials);

        user = await prisma.user.findFirst({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            image: true,
            emailVerified: true,
          },
        });
        if (!user) {
          throw new AuthError("User not found", { cause: "User not found" });
        }
        if (!user.password) {
          throw new AuthError(
            "Try Sign with Google. User password not found.",
            { cause: "Try Sign with Google. User password not found." },
          );
        }
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
          throw new AuthError("Invalid credentials.", {
            cause: "Invalid credentials.",
          });
        }

        if (!user.emailVerified) {
          const resend = new Resend(process.env.RESEND_API_KEY);

          const obj = {
            email: user.email,
            token: Math.floor(Math.random() * 10000000000),
          };
          if (!process.env.AUTH_SECRET) {
            throw new AuthError("AUTH_SECRET is not defined", {
              cause: "AUTH_SECRET is not defined",
            });
          }
          const token = jwt.sign(obj, process.env.AUTH_SECRET, {
            expiresIn: "30m",
          });

          await prisma.verificationToken.upsert({
            // Create new token if doesn't exist
            where: { email },
            update: {
              token: token.toString(),
              expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
            }, // Update token & expiry if already exists
            create: {
              email,
              token: token.toString(),
              expiresAt: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
            },
          });
          console.log(`${process.env.AUTH_URL}/verify-email/${token}`);

          const { data, error } = await resend.emails.send({
            from: "verify-email@manojthapa.software",
            to: [user.email],
            subject: "Verify your email",
            html: emailHTML({
              name: user.name,
              link: `${process.env.AUTH_URL}/verify-email/${token}`,
            }),
          });
          console.log(error);

          if (data?.id)
            throw new AuthError("Email not verified", {
              cause: "Check your email to verify first",
            });

          throw new AuthError("Email not verified", {
            cause: "Email not verified: ",
          });
        }

        if (isValid) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
