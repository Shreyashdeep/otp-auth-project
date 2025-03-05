"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AuthForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    if (!phone) {
      alert("Please enter a phone number.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    setLoading(false);
    if (res.ok) {
      setOtpSent(true);
      alert("OTP sent successfully!");
    } else {
      alert("Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP.");
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      phone,
      otp,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    setLoading(false);
    if (res?.error) {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-semibold mb-4">Login with Phone OTP</h2>
      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border border-gray-300 p-2 rounded w-64 mb-2"
      />
      {otpSent && (
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border border-gray-300 p-2 rounded w-64 mb-2"
        />
      )}
      {!otpSent ? (
        <button
          onClick={sendOtp}
          className="bg-blue-500 text-white p-2 rounded w-64"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      ) : (
        <button
          onClick={verifyOtp}
          className="bg-green-500 text-white p-2 rounded w-64"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      )}
    </div>
  );
}
