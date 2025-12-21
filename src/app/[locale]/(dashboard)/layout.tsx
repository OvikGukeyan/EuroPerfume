import { prisma } from "@/prisma/prisma-client";
import { AppSidebar } from "@/src/shared/components";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/src/shared/components/ui/sidebar";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { UserRole } from "@prisma/client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUserSession();

  if (!session || session.role !== UserRole.ADMIN) {
    redirect("/not-auth");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
