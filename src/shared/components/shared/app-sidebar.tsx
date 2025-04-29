"use client";

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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { Folders, GalleryHorizontalEnd, House, Music3, Plus, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

type Props = {
  className?: string;
};

export const AppSidebar: FC<Props> = ({ className }) => {
  const pathName = usePathname();
  const tools = [
   
    { name: "Products", icon: <Settings2 />, href: "/products" },
   
    {
      name: "Create New Slde",
      icon: <Plus />,
      href: "/create-slide",
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
