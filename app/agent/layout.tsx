// app/layout.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AgentLayout } from "@/components/agent/agent-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgentLayout>{children} </AgentLayout>;
}
