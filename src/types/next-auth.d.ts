import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    phone: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      phone: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    phone: string;
  }
}
