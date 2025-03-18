import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ContactsHub",
  description: "Manage your contacts with ease",
  viewport: "width=device-width, initial-scale=1",
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
          <SidebarProvider className="flex">
            <AppSidebar />
            <main className="flex flex-1">
              <div className="flex-1">{children}</div>
            </main>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
