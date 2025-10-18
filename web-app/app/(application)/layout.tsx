"use client";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import { SidebarProvider } from "../components/SidebarContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="bg-gray-900 text-white min-h-screen">
        <Sidebar />
        <Header />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}