import twilio from "twilio";
import { NextRequest, NextResponse } from "next/server";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via Twilio
    console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
    console.log("TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN);
    console.log("TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER);

    console.log(phone);
    const message = await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Use a verified Twilio number
      to: phone.startsWith("+") ? phone : `+${phone}`, // Ensure proper format
    });

    console.log("OTP sent:", otp); // Remove this in production!

    return NextResponse.json({ success: true, messageSid: message.sid });
  } catch (error: any) {
    console.error("Twilio error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send OTP" },
      { status: 500 }
    );
  }
}
