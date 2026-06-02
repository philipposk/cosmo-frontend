import { ReactNode } from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { TweaksPanel } from "@/components/shell/TweaksPanel";
import { CommandK } from "@/components/search/CommandK";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Topbar />
        <div className="content">{children}</div>
      </main>
      <TweaksPanel />
      <CommandK />
    </div>
  );
}
