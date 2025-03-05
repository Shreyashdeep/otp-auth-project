import { NextResponse } from "next/server";
import redis from "@/src/lib/redis";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    await redis.set(`otp:${phone}`, otp, { ex: 300 }); 

    console.log(`OTP for ${phone}:`, otp); 

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
