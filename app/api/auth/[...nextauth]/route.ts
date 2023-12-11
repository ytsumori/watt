import NextAuth, { AuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";

const authOptions: AuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
