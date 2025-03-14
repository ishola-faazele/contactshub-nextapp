import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Contacthub",
  description: "Manage your contacts with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              {children}
            </main>
          </SidebarProvider>
          </Providers>
      </body>
    </html>
  );
}
