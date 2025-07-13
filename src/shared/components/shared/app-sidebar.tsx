"use client";

import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  Folders,
  GalleryHorizontalEnd,
  House,
  Plus,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { usePathname } from "@/src/i18n/navigation";

type Props = {
  className?: string;
};

export const AppSidebar: FC<Props> = ({ className }) => {
  const pathName = usePathname();
  const tools = [
    { name: "Products", icon: <Settings2 />, href: "/products" },

    {
      name: "Create Top Slde",
      icon: <Plus />,
      href: "/create-slide/1",
    },
     {
      name: "Create Bottom Slde",
      icon: <Plus />,
      href: "/create-slide/2",
    },
    {
      name: "Slides",
      icon: <GalleryHorizontalEnd />,
      href: "/slides",
    },
    {
      name: "Orders",
      icon: <Folders />,
      href: "/orders",
    },
    {
      name: "Home",
      icon: <House />,
      href: "/",
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
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Plus /> Create
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <Link href={"/create/1"}>
                        <SidebarMenuSubItem>
                          <SidebarMenuButton>Perfume</SidebarMenuButton>
                        </SidebarMenuSubItem>
                      </Link>

                      <Link href={"/create/2"}>
                        <SidebarMenuSubItem>
                          <SidebarMenuButton>Makeup</SidebarMenuButton>
                        </SidebarMenuSubItem>
                      </Link>

                      <Link href={"/create/3"}>
                        <SidebarMenuSubItem>
                          <SidebarMenuButton>Other</SidebarMenuButton>
                        </SidebarMenuSubItem>
                      </Link>
                      <Link href={"/create-promocode"}>
                        <SidebarMenuSubItem>
                          <SidebarMenuButton>Promocode</SidebarMenuButton>
                        </SidebarMenuSubItem>
                      </Link>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {tools.map((tool) => (
                <Link key={tool.name} href={tool.href}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={pathName === tool.href}
                      asChild
                    >
                      <div>
                        {tool.icon}
                        <span>{tool.name}</span>
                      </div>
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
