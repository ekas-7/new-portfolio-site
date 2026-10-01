import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionScreen } from "@/components/office/screens";
import { profile } from "@/content/profile";
import { roomIds, sections } from "@/content/sections";

export const dynamicParams = false;

export function generateStaticParams() {
  return roomIds.map((section) => ({ section }));
}

const findRoom = (section: string) => roomIds.find((id) => id === section);

export async function generateMetadata({ params }: PageProps<"/[section]">): Promise<Metadata> {
  const id = findRoom((await params).section);
  if (!id) return {};
  const title = sections[id].title.en.toLowerCase().replace(/^\w|\s\w/g, (c) => c.toUpperCase());
  return { title: `${title} · ${profile.meta.title}` };
}

export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const id = findRoom((await params).section);
  if (!id) notFound();
  return <SectionScreen id={id} host={profile.office.laptop.host} />;
}
