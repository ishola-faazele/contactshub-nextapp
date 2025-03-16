"use client";
import * as React from "react";
import { LucideTrash, Contact, Lock } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { useSession } from "next-auth/react";
// import { SidebarOptInForm } from "@/components/sidebar-opt-in-form"
import {
  Sidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarHeader,
  // SidebarRail,
} from "@/components/ui/sidebar";

// This is the various statutes of of contacts
const data = {
  navMain: [
    {
      title: "Contacts",
      url: "/",
      icon: Contact,
    },
    {
      title: "Blocked",
      url: "/blocked",
      icon: Lock,
    },
    {
      title: "Bin",
      url: "/bin",
      icon: LucideTrash,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  return (
    session && (
      <Sidebar {...props}>
        <SidebarHeader>
          <h2 className="text-lg font-bold">ContactsHub</h2>
          <div>group 20</div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        {/* <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter> */}
        {/* <SidebarRail /> */}
      </Sidebar>
    )
  );
}
