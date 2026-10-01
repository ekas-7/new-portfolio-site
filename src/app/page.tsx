import { IdBadge } from "@/components/id-badge/id-badge";
import { profile } from "@/content/profile";
import { resolveBackIndex } from "@/content/sections";

export default function Home() {
  const back = { ...profile.back, index: resolveBackIndex(profile.back.index) };

  return (
    <main className="flex flex-1 flex-col">
      <IdBadge content={profile.badge} back={back} />
    </main>
  );
}
