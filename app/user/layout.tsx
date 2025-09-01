// app/layout.tsx
"use client";

import { UserLayout } from "@/components/user/user-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children} </UserLayout>;
}
