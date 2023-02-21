import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1622120928139-0bf6fdc0515d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1610&q=80')] font-mono">
      {children}
    </div>
  );
}
