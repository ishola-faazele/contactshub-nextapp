"use client";

import { type LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                {item.icon && <item.icon className="mr-2" />}
                {item.title}
              </Link>
            </SidebarMenuButton>
            {item.items?.length ? (
              <DropdownMenu>
                <DropdownMenuTrigger />
                <DropdownMenuContent>
                  {item.items.map((subItem) => (
                    <DropdownMenuItem key={subItem.url} asChild>
                      <Link href={subItem.url}>{subItem.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
