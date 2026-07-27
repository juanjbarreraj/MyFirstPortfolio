import { Reveal, Stagger, StaggerItem } from "./Reveal.jsx";

/* Seven roles in Juan's approved order. Rows pair related experiences:
   (Tutor / RA) · (Resident Educator / RE Mentor) · (ISC President / SAAC),
   closing with the featured full-width Track & Field captaincy card. */

const ROLES = [
  {
    title: "Tutor · Point Park University",
    desc: "Mentored students in programming, data structures, debugging, and technical problem-solving while adapting explanations to different learning styles and helping students build confidence and independence.",
    skills: ["Mentorship", "Technical Communication", "Patience", "Adaptability", "Problem-Solving"],
  },
  {
    title: "Summer Resident Assistant · Pre-College Programs",
    desc: "Supported and supervised students between the ages of 14 and 17, maintained a safe residential environment, managed night checks, organized activities, and responded calmly to student concerns and unexpected situations.",
    skills: ["Responsibility", "Decision-Making", "Conflict Management", "Organization", "Student Support"],
  },
  {
    title: "Resident Educator",
    duration: "2 Years",
    desc: "Supported residential students for two years by building community, maintaining residence-life standards, responding to student concerns, helping resolve conflicts, and contributing to a safe and welcoming residential environment.",
    skills: ["Community Leadership", "Conflict Resolution", "Student Support", "Responsibility", "Communication", "Problem-Solving"],
  },
  {
    title: "Resident Educator Mentor",
    duration: "1 Year",
    desc: "Served as a mentor to fellow Resident Educators by providing guidance, sharing experience, supporting team communication, and helping student leaders respond effectively to residential responsibilities and challenges.",
    skills: ["Peer Mentorship", "Team Leadership", "Coaching", "Emotional Intelligence", "Collaboration", "Decision-Making"],
  },
  {
    title: "President · International Students Club",
    desc: "Led initiatives supporting international students, coordinated events, strengthened communication between students and university resources, and helped create a more connected and inclusive campus community.",
    skills: ["Strategic Leadership", "Event Coordination", "Public Communication", "Inclusion", "Collaboration", "Community Building"],
  },
  {
    title: "SAAC Representative · Student-Athlete Advisory Committee",
    duration: "2 Years",
    desc: "Represented student-athletes through the Student-Athlete Advisory Committee, contributed to discussions affecting the athletic community, communicated student-athlete perspectives, and supported initiatives connecting athletics, campus leadership, and student engagement.",
    skills: ["Student Representation", "Advocacy", "Communication", "Collaboration", "Campus Engagement", "Athletic Leadership"],
  },
  {
    title: "Track & Field Team Captain and Student-Athlete",
    featured: true,
    desc: "Balanced academics, employment, campus leadership, and high-level athletic training while serving as a Track & Field Team Captain. Earned multiple conference podium finishes, including conference championships, runner-up finishes, and third-place finishes, while breaking several Point Park University school records throughout my collegiate athletic career.",
    skills: ["Team Captaincy", "Discipline", "Resilience", "Performance Under Pressure", "Accountability", "Time Management", "Team Leadership", "Competitive Excellence"],
  },
];

export default function Leadership() {
  return (
    <section className="section" id="leadership" aria-labelledby="leadership-title">
      <Reveal as="header" className="section-head">
        <p className="kicker">
          <span className="kicker-dot" aria-hidden="true"></span>
          Leadership &amp; Involvement
        </p>
        <h2 id="leadership-title">
          Leadership developed through mentorship, community building, athletics, and
          student support.
        </h2>
        <p className="section-lede">
          The habits that make software teams work were built here: clear communication,
          accountability, mentorship, representing others, and staying steady under
          pressure.
        </p>
      </Reveal>

      <Stagger className="lead-grid" gap={0.09}>
        {ROLES.map((r) => (
          <StaggerItem
            as="article"
            variant="rise"
            key={r.title}
            className={`card lead-card${r.featured ? " lead-card--wide lead-card--feature" : ""}`}
          >
            <h3 className="lead-title">{r.title}</h3>
            {r.duration && <p className="lead-meta">{r.duration}</p>}
            <p className="lead-desc">{r.desc}</p>
            <ul className="tag-row" aria-label="Leadership skills">
              {r.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
