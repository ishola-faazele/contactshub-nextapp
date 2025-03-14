'use client';
import * as React from "react"
import { GalleryVerticalEnd, LucideTrash, Contact, Download } from "lucide-react"
import Link from "next/link";
import { NavMain } from "@/components/nav-main"
import { useSession } from "next-auth/react";
// import { SidebarOptInForm } from "@/components/sidebar-opt-in-form"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Contacts",
      url: "#",
      icon: Contact
    },
    {
      title: "Archive",
      url: "#",
      icon: Download,
    },
    {
      title: "Bin",
      url: "#",
      icon: LucideTrash,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {data: session, status} = useSession();
  return (
    session &&
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild >
              <Link href="#" className="cursor-pointer">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Contacthub</span>
                  <span className="">group 20</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
