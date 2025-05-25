import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findUserByEmail, createUser, updateLastLogin } from "@/app/database/services/userServices";
import connectDb from "@/app/lib/mongodb";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/drive",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
  async signIn({ user }) {
    await connectDb();
    if (!user || !user.email) return false;

    const existingUser = await findUserByEmail(user.email);

    if (!existingUser) {
      await createUser({
        name: user.name || "",
        email: user.email,
        avatar: user.image || "",
      });
    } else {
      await updateLastLogin(existingUser._id);
    }

    return true;
  },
  async jwt({ token, account }) {
    if (account) {
      token.accessToken = account.access_token;
    }
    return token;
  },
  async session({ session, token }) {
    session.accessToken = token.accessToken as string | undefined;
    return session;
  },
}

});

export { handler as GET, handler as POST };
