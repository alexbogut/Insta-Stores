import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-gray-200 font-mono">{children}</div>
  );
}
