import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full decoration-[#d8b4fe] font-mono">
      {children}
    </div>
  );
}
