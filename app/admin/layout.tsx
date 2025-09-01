// app/layout.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { AgentLayout } from "@/components/agent/agent-layout";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children} </AdminLayout>;
}
