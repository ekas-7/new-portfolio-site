import type { ReactNode } from "react";
import { Door } from "@/components/door/door";
import { Laptop } from "@/components/office/laptop";
import { profile } from "@/content/profile";
import { backIndex } from "@/content/sections";

export default function OfficeLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col">
      <Laptop office={profile.office} rooms={backIndex}>
        {children}
      </Laptop>
      <Door door={profile.office.door} mode="opening" />
    </main>
  );
}
