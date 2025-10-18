"use client";

import { useSidebar } from "./SidebarContext";
import { ReactNode } from "react";

export default function MainContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <main 
      className="pt-[73px] transition-all duration-300"
      style={{ marginLeft: isCollapsed ? '5rem' : '16rem' }}
    >
      <div>{children}</div>
    </main>
  );
}
