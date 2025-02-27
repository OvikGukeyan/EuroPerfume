'use client'

import React, { FC } from "react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Folders, Plus, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  className?: string;
};

export const AppSidebar: FC<Props> = ({ className }) => {
    const pathName = usePathname();
  const tools = [
    {
      name: "Create New Product",
      icon: <Plus />,
      href: "/create",
    },
    { name: "Update Product", icon: <Settings2 />, href: "/update" },
    {
      name: "Orders",
      icon: <Folders />,
      href: "/orders",
    },
  ];
  return (
    <Sidebar collapsible="icon" className={cn("", className)}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((tool) => (
                <Link key={tool.name} href={tool.href}>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={pathName === tool.href}  asChild>
                      <a href={"#"}>
                        {tool.icon}
                        <span>{tool.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
