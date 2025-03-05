import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import redis from "@/src/lib/redis";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Phone OTP Login",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) throw new Error("Missing credentials");
      
        const phone = credentials.phone as string; // Ensure phone is a string
        const otp = credentials.otp as string;
      
        
        const storedOtp = await redis.get(`otp:${phone}`);
      
        if (!storedOtp || storedOtp !== otp) {
          throw new Error("Invalid OTP");
        }
      
        await redis.del(`otp:${phone}`);
      
        return { id: phone, phone };
      }
      
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.phone) {
        session.user = { ...session.user, phone: token.phone };
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
