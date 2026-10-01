import { IdBadge } from "@/components/id-badge/id-badge";
import { profile } from "@/content/profile";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <IdBadge content={profile.badge} />
    </main>
  );
}
