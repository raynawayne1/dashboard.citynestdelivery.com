import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "../Authcontext/AuthContext";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>

        <body className={`${outfit.variable} dark:bg-gray-900`} suppressHydrationWarning>
          <ToastContainer />

          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
