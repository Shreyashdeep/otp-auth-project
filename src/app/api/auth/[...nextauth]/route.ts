import NextAuth from "next-auth";
import { authOptions } from "@/src/lib/auth"; // Move authOptions to a separate file

const handler = NextAuth(authOptions);


export { handler as GET, handler as POST };