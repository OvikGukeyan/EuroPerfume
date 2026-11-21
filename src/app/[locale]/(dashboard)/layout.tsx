import { AdminNotificationsProvider } from "@/src/shared/components/shared/admin-notifications-context";
import { AdminNotificationBell } from "@/src/shared/components/shared/admin-notification-bell";
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
    <AdminNotificationsProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="min-h-screen min-w-0 w-full">
          <div className="sticky top-0 z-50 flex min-h-14 items-center justify-between border-b border-[#eeeae7] bg-white/95 px-3 backdrop-blur-sm md:px-6">
            <SidebarTrigger />
            <AdminNotificationBell />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </AdminNotificationsProvider>
  );
}
