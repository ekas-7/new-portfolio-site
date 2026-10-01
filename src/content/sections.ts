import achievementsData from "./sections/achievements.json";
import connectData from "./sections/connect.json";
import experienceData from "./sections/experience.json";
import projectsData from "./sections/projects.json";
import resumeData from "./sections/resume.json";
import skillsData from "./sections/skills.json";
import { type Bilingual, profile } from "./profile";

export type Link = { label: string; href: string };

export type Position = {
  title: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM, or null while ongoing */
  end: string | null;
};

export type Role = {
  company: string;
  url: string;
  team: string;
  location: string;
  /** Newest first; one company can hold several positions. */
  positions: Position[];
  /** Ordered most impressive first. */
  highlights: string[];
  stack: string[];
  links?: Link[];
};

export type Education = {
  institution: string;
  url: string;
  degree: string;
  start: string;
  end: string;
  grade: string;
};

export type Experience = { title: Bilingual; roles: Role[]; education: Education[] };

export type Project = {
  name: string;
  tagline: string;
  award: string | null;
  description: string[];
  stack: string[];
  links: Link[];
};

export type Projects = { title: Bilingual; projects: Project[] };

export type Achievements = {
  title: Bilingual;
  hackathons: { event: string; result: string; track: string }[];
  security: { target: string; finding: string }[];
  competitive: { platform: string; handle: string; solved: string; rank: string; rating: string; href: string }[];
  academics: string[];
  certifications: string[];
  clubs: string[];
};

export type Skills = { title: Bilingual; groups: { label: string; items: string[] }[] };

export type Connect = {
  title: Bilingual;
  pitch: string;
  email: string;
  links: { label: string; handle: string; href: string }[];
};

export type Resume = { title: Bilingual; file: string | null; updated: string };

export type Sections = {
  experience: Experience;
  projects: Projects;
  achievements: Achievements;
  skills: Skills;
  connect: Connect;
  resume: Resume;
};

export type SectionId = keyof Sections;

export const sections: Sections = {
  experience: experienceData,
  projects: projectsData,
  achievements: achievementsData,
  skills: skillsData,
  connect: connectData,
  resume: resumeData,
};

export type BackIndexItem = {
  id: SectionId;
  number: string;
  label: Bilingual;
  tally: string;
  href: string;
};

export const isSectionId = (id: string): id is SectionId => Object.hasOwn(sections, id);

/** The sections listed on the back of the badge, in order; each one is a room at /<id>. */
export const roomIds: SectionId[] = profile.back.index.map((id) => {
  if (!isSectionId(id)) throw new Error(`profile.json back.index: unknown section "${id}"`);
  return id;
});

export const backIndex: BackIndexItem[] = roomIds.map((id, i) => ({
  id,
  number: pad(i + 1),
  label: sections[id].title,
  tally: sectionTally(id),
  href: `/${id}`,
}));

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Short tally shown beside each entry on the back of the badge. */
export function sectionTally(id: SectionId): string {
  switch (id) {
    case "experience":
      return `${pad(sections.experience.roles.reduce((n, r) => n + r.positions.length, 0))} ROLES`;
    case "projects":
      return `${pad(sections.projects.projects.length)} BUILDS`;
    case "achievements":
      return `${pad(sections.achievements.hackathons.length)} WINS`;
    case "skills":
      return `${pad(sections.skills.groups.reduce((n, g) => n + g.items.length, 0))} TOOLS`;
    case "connect":
      return `${pad(sections.connect.links.length + 1)} CHANNELS`;
    case "resume":
      return sections.resume.file ? "PDF" : "SOON";
  }
}
