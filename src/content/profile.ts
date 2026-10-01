import data from "./profile.json";

export type Bilingual = { jp: string; en: string };

export type LabeledValue = { label: Bilingual; value: Bilingual };

export type DetailCell = { label: string; value: string; href?: string };

export type ImageAsset = { src: string; alt: string };

export type BadgeContent = {
  portrait: ImageAsset;
  status: Bilingual;
  fields: LabeledValue[];
  name: LabeledValue;
  signature: Bilingual;
  logo: ImageAsset;
  details: { start: DetailCell[]; end: DetailCell[] };
  division: string;
};

export type BackIndexEntry = {
  /** Key into the section files in ./sections; the label and tally come from there. */
  section: string;
  href: string | null;
};

export type BackContent = {
  side: Bilingual;
  title: Bilingual;
  stamp: Bilingual;
  summary: string;
  index: BackIndexEntry[];
  found: Bilingual & { email: string };
  serial: string;
};

export type Profile = {
  meta: { title: string; description: string };
  badge: BadgeContent;
  back: BackContent;
};

export const profile: Profile = data;
