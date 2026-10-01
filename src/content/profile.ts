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

export type BackContent = {
  side: Bilingual;
  title: Bilingual;
  stamp: Bilingual;
  summary: string;
  /** Keys into the section files in ./sections; each one becomes a room at /<key>. */
  index: string[];
  found: Bilingual & { email: string };
  serial: string;
};

export type OfficeContent = {
  reader: { idle: Bilingual; hint: Bilingual; granted: Bilingual };
  door: { room: Bilingual; notice: Bilingual };
  laptop: { host: string; status: string };
  exit: Bilingual;
};

export type Profile = {
  meta: { title: string; description: string };
  badge: BadgeContent;
  back: BackContent;
  office: OfficeContent;
};

export const profile: Profile = data;
