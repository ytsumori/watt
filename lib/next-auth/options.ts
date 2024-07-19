import { PrismaAdapter } from "@next-auth/prisma-adapter";
import LineProvider from "next-auth/providers/line";
import { AuthOptions } from "next-auth";
import prisma from "@/lib/prisma/client";

export const options: AuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: { params: { scope: "profile openid email" } },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        };
      }
    })
  ],
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) token.id = user.id;
      if (account) token.accessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.id } };
    }
  }
};
