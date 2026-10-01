import { IdBadge } from "@/components/id-badge/id-badge";
import { profile } from "@/content/profile";
import { backIndex } from "@/content/sections";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <IdBadge content={profile.badge} back={{ ...profile.back, index: backIndex }} office={profile.office} />
    </main>
  );
}
