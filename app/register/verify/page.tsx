// app/register/verify/page.tsx
"use client";

import { Suspense } from "react";
import  VerifyPageClient from './verify-token'

export default function VerifyPage() {
  return (
    <Suspense fallback={<p>Loading verification...</p>}>
      <VerifyPageClient />
    </Suspense>
  );
}
