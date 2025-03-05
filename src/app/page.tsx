export default function Home() {
    return (
      <div className="flex flex-col items-center min-h-screen">
        <h1 className="text-3xl">Welcome to OTP Auth App</h1>
        <a href="/login" className="mt-4 bg-blue-500 text-white p-2">
          Login with OTP
        </a>
      </div>
    );
  }
  