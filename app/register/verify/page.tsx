"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyToken } from "@/services/auth-services";
import { Button } from "@/components/ui/button";

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

    const tokenVerification = async () => {
      try {
        const verify = await verifyToken({ token });
        if (verify.data.statusCode !== 200) {
          throw new Error("Invalid or expired token");
        }

        setStatus("success");

        // Auto-redirect after 3 seconds
        const timer = setTimeout(() => {
          router.push("/login");
        }, 3000);

        return () => clearTimeout(timer); // cleanup
      } catch (err) {
        setStatus("error");
      }
    };

    tokenVerification();
  }, [token, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Verifying your email...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">Invalid or expired verification link.</p>
      </div>
    );
  }

  // ✅ Success state
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-green-600 mb-4">
        ✅ Email verified successfully! Redirecting to login...
      </p>
      <Button size="sm" onClick={() => router.push("/login")}>
        Go to Login Now
      </Button>
    </div>
  );
}
