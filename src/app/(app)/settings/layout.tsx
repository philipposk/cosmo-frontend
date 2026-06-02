import { ReactNode } from "react";
import { SettingsNav } from "@/components/settings/SettingsNav";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="settings-grid">
      <SettingsNav />
      <div>{children}</div>
    </div>
  );
}
