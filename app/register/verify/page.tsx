"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyToken } from "@/services/auth-services";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    const payload = {
      token,
    };
    const tokenVerification = async () => {
      try {
        const verify = await verifyToken(payload);
        if (verify.data.statusCode !== 200) {
          throw new Error("Invalid or expired token");
        }

        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    tokenVerification();
  }, [token]);

  if (status === "loading") {
    return <p>Verifying your email...</p>;
  }

  if (status === "error") {
    return (
      <p className="text-red-500">Invalid or expired verification link.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-green-600 mb-4">✅ Email verified successfully!</p>
      <button
        onClick={() => router.push("/login")}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Go to Login
      </button>
    </div>
  );
}
