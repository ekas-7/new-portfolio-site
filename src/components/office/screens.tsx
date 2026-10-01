import type { ReactNode } from "react";
import { type Bilingual } from "@/content/profile";
import {
  type Achievements,
  type Connect,
  type Experience,
  type Project,
  type Projects,
  type Resume,
  type SectionId,
  sections,
  sectionTally,
} from "@/content/sections";
import styles from "./screens.module.css";

export function SectionScreen({ id, host }: { id: SectionId; host: string }) {
  return (
    <div className={styles.scroll}>
      <article className={styles.screen}>
        <p className={styles.prompt}>
          <span className={styles.muted}>{host}:~/portfolio $</span> open {id}
          <span className={styles.caret} aria-hidden />
        </p>
        <Title title={sections[id].title} tally={sectionTally(id)} />
        {renderSection(id)}
      </article>
    </div>
  );
}

function renderSection(id: SectionId): ReactNode {
  switch (id) {
    case "experience":
      return <ExperienceScreen data={sections.experience} />;
    case "projects":
      return <ProjectsScreen data={sections.projects} />;
    case "achievements":
      return <AchievementsScreen data={sections.achievements} />;
    case "connect":
      return <ConnectScreen data={sections.connect} />;
    case "resume":
      return <ResumeScreen data={sections.resume} email={sections.connect.email} />;
    case "skills":
      return <SkillsBlock />;
  }
}

function Title({ title, tally }: { title: Bilingual; tally: string }) {
  return (
    <header className={styles.title}>
      <span className={styles.titleJp}>{title.jp}</span>
      <h1 className={styles.titleEn}>{title.en}</h1>
      <span className={styles.tally}>{tally}</span>
    </header>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return <h2 className={styles.heading}>{children}</h2>;
}

function External({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={`${styles.external} ${className ?? ""}`} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className={styles.chips}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const month = (ym: string | null) => (ym ? ym.replace("-", ".") : "PRESENT");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthName = (ym: string | null) => {
  if (!ym) return "Present";
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

/** Inclusive month count, LinkedIn style; ongoing positions are measured to the build date. */
function tenure(start: string, end: string | null) {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const total = (ey - sy) * 12 + (em - sm) + 1;
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years && `${years} yr${years > 1 ? "s" : ""}`, months && `${months} mo${months > 1 ? "s" : ""}`]
    .filter(Boolean)
    .join(" ");
}

/** "Lead – detail" bullets get a bold lead; plain bullets render as written. */
function Highlight({ text }: { text: string }) {
  const at = text.indexOf(" – ");
  if (at === -1) return text;
  return (
    <>
      <strong className={styles.strong}>{text.slice(0, at)}</strong>
      <span className={styles.muted}> – </span>
      {text.slice(at + 3)}
    </>
  );
}

function ExperienceScreen({ data }: { data: Experience }) {
  return (
    <>
      <ol className={styles.timeline}>
        {data.roles.map((role) => (
          <li key={role.company} className={styles.role}>
            <div className={styles.roleMeta}>
              <span>
                {month(role.positions.at(-1)!.start)} — {month(role.positions[0].end)}
              </span>
              <span className={styles.muted}>{role.location}</span>
            </div>
            <div className={styles.roleBody}>
              <h3 className={styles.roleHead}>
                <External href={role.url}>{role.company}</External>
                <span className={styles.muted}>{role.team}</span>
              </h3>
              <ol className={styles.positions}>
                {role.positions.map((p) => (
                  <li key={p.title}>
                    <span className={styles.positionTitle}>{p.title}</span>
                    <span className={styles.muted}>
                      {monthName(p.start)} – {monthName(p.end)} · {tenure(p.start, p.end)}
                    </span>
                  </li>
                ))}
              </ol>
              <ul className={styles.bullets}>
                {role.highlights.map((h) => (
                  <li key={h}>
                    <Highlight text={h} />
                  </li>
                ))}
              </ul>
              <Chips items={role.stack} />
              {role.links && role.links.length > 0 && (
                <div className={styles.cardLinks}>
                  {role.links.map((link) => (
                    <External key={link.href} href={link.href} className={styles.button}>
                      {link.label}
                    </External>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <Heading>EDUCATION</Heading>
      {data.education.map((ed) => (
        <div key={ed.institution} className={styles.role}>
          <div className={styles.roleMeta}>
            <span>
              {ed.start} — {ed.end}
            </span>
          </div>
          <div className={styles.roleBody}>
            <h3 className={styles.roleHead}>
              <External href={ed.url}>{ed.institution}</External>
              <span className={styles.muted}>{ed.degree}</span>
            </h3>
            <p className={styles.line}>{ed.grade}</p>
          </div>
        </div>
      ))}

      <SkillsBlock />
    </>
  );
}

function SkillsBlock() {
  const skills = sections.skills;
  return (
    <>
      <Heading>{skills.title.en}</Heading>
      <dl className={styles.skills}>
        {skills.groups.map((group) => (
          <div key={group.label}>
            <dt className={styles.muted}>{group.label}</dt>
            <dd>
              <Chips items={group.items} />
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function ProjectsScreen({ data }: { data: Projects }) {
  const featured = data.projects.filter((p) => p.featured);
  const more = data.projects.filter((p) => !p.featured);

  return (
    <>
      <div className={styles.cards}>
        {featured.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>

      {more.length > 0 && (
        <>
          <Heading>MORE BUILDS</Heading>
          <ul className={styles.builds}>
            {more.map((project) => (
              <li key={project.name} className={styles.build}>
                <h3 className={styles.buildHead}>
                  <span className={styles.buildName}>{project.name}</span>
                  <span className={styles.muted}>{project.tagline}</span>
                </h3>
                <p className={styles.line}>{project.description.join(" ")}</p>
                <div className={styles.buildFoot}>
                  <span className={styles.muted}>{project.stack.join(" · ")}</span>
                  <span className={styles.buildLinks}>
                    {project.links.map((link) => (
                      <External key={link.href} href={link.href} className={styles.buildLink}>
                        {link.label}
                      </External>
                    ))}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <section className={styles.card}>
      <header className={styles.cardHead}>
        <h3 className={styles.cardName}>{project.name}</h3>
        <span className={styles.muted}>{project.tagline}</span>
      </header>
      {project.award && <p className={styles.award}>★ {project.award}</p>}
      <ul className={styles.bullets}>
        {project.description.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <Chips items={project.stack} />
      {project.links.length > 0 && (
        <div className={styles.cardLinks}>
          {project.links.map((link) => (
            <External key={link.href} href={link.href} className={styles.button}>
              {link.label}
            </External>
          ))}
        </div>
      )}
    </section>
  );
}

function AchievementsScreen({ data }: { data: Achievements }) {
  return (
    <>
      <Heading>HACKATHONS</Heading>
      <table className={styles.table}>
        <tbody>
          {data.hackathons.map((h) => (
            <tr key={`${h.event}-${h.track}`}>
              <td className={styles.result}>{h.result}</td>
              <td>{h.event}</td>
              <td className={styles.muted}>{h.track}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Heading>COMPETITIVE PROGRAMMING</Heading>
      <div className={styles.stats}>
        {data.competitive.map((c) => (
          <External key={c.platform} href={c.href} className={styles.stat}>
            <span className={styles.statPlatform}>
              {c.platform} <span className={styles.muted}>@{c.handle}</span>
            </span>
            <span className={styles.statRating}>{c.rating}</span>
            <span className={styles.muted}>
              {c.rank} · {c.solved} solved
            </span>
          </External>
        ))}
      </div>

      <Heading>SECURITY</Heading>
      <ul className={styles.bullets}>
        {data.security.map((s) => (
          <li key={s.target}>
            <strong className={styles.strong}>{s.target}</strong> <span className={styles.muted}>—</span> {s.finding}
          </li>
        ))}
      </ul>

      <Heading>ACADEMICS · CERTIFICATIONS · CLUBS</Heading>
      <ul className={styles.bullets}>
        {[...data.academics, ...data.certifications, ...data.clubs].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

function ConnectScreen({ data }: { data: Connect }) {
  return (
    <>
      <p className={styles.pitch}>{data.pitch}</p>
      <a className={`${styles.button} ${styles.buttonSolid}`} href={`mailto:${data.email}`}>
        ✉ {data.email}
      </a>

      <Heading>ELSEWHERE</Heading>
      <ul className={styles.links}>
        {data.links.map((link) => (
          <li key={link.label}>
            <External href={link.href} className={styles.linkRow}>
              <span>{link.label}</span>
              <span className={styles.leader} aria-hidden />
              <span className={styles.muted}>{link.handle}</span>
            </External>
          </li>
        ))}
      </ul>
    </>
  );
}

function ResumeScreen({ data, email }: { data: Resume; email: string }) {
  if (data.file) {
    return (
      <div className={styles.notice}>
        <p className={styles.line}>resume.pdf · updated {month(data.updated)}</p>
        <a className={`${styles.button} ${styles.buttonSolid}`} href={data.file} target="_blank" rel="noopener">
          Open resume.pdf
        </a>
      </div>
    );
  }

  const subject = encodeURIComponent("Resume request");
  return (
    <div className={styles.notice}>
      <p className={styles.line}>
        <span className={styles.muted}>$</span> ls resume.pdf
      </p>
      <p className={styles.line}>
        <span className={styles.muted}>ls: resume.pdf: not published yet</span>
      </p>
      <p className={styles.pitch}>The full resume is shared on request. Drop a line and I&apos;ll send the latest copy.</p>
      <a className={`${styles.button} ${styles.buttonSolid}`} href={`mailto:${email}?subject=${subject}`}>
        ✉ Request a copy
      </a>
    </div>
  );
}
