"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const { data: session, status } = useSession();
//   const { data: session, status } = await getServerSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h2 className="text-2xl mb-4">Welcome, {session?.user?.phone}</h2>
      <button onClick={() => signOut()} className="bg-red-500 text-white p-2">
        Logout
      </button>
    </div>
  );
}
