import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import redis from "@/src/lib/redis";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Phone OTP Login",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");

        const { phone, otp } = credentials;
        const storedOtp = await redis.get(`otp:${phone}`);

        if (!storedOtp || storedOtp !== otp) {
          throw new Error("Invalid OTP");
        }

        await redis.del(`otp:${phone}`);

        return { id: phone, phone: String(phone) };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.phone) {
        session.user = { ...(session.user || {}), phone: token.phone as string};
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.phone = user.phone;
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
